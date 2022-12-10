#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use tokio::sync::mpsc;
use tokio::sync::Mutex;
use tracing_subscriber;
mod data_base;
mod file;
mod language;
mod tray;

fn main() {
    tracing_subscriber::fmt::init();

    let (async_proc_input_tx, async_proc_input_rx) = mpsc::channel(1);
    let (async_proc_output_tx, mut async_proc_output_rx) = mpsc::channel(1);

    let context = tauri::generate_context!();

    tauri::Builder::default()
        .manage(file::AsyncProcInputTx {
            inner: Mutex::new(async_proc_input_tx),
        })
        .invoke_handler(tauri::generate_handler![
            file::download_local_file,         // 读取文件
            data_base::command::get_notes,     // 获取书某本书全部笔记内容
            data_base::command::get_all_notes, // 获取全部笔记内容
            data_base::command::add_notes,     // 新增一条笔记
            data_base::command::delete_notes,  // 更新一条笔记
            data_base::command::update_notes,  // 删除一条笔记
            language::set_lang,
        ])
        .setup(|app| {
            tauri::async_runtime::spawn(async move {
                async_process_model(async_proc_input_rx, async_proc_output_tx).await
            });

            let app_handle = app.handle();
            tauri::async_runtime::spawn(async move {
                loop {
                    if let Some(output) = async_proc_output_rx.recv().await {
                        file::send_file(output, &app_handle);
                    }
                }
            });

            Ok(())
        })
        .menu(tauri::Menu::os_default(&context.package_info().name))
        .on_system_tray_event(tray::handler) //  注册系统托盘事件处理程序
        .system_tray(tauri::SystemTray::default()) // 将 `tauri.conf.json` 上配置的图标添加到系统托盘
        .system_tray(tray::menu())
        .run(context)
        .expect("error while running tauri application");
}

async fn async_process_model(
    mut input_rx: mpsc::Receiver<Vec<u8>>,
    output_tx: mpsc::Sender<Vec<u8>>,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    while let Some(input) = input_rx.recv().await {
        let output = input;
        output_tx.send(output).await?;
    }

    Ok(())
}
