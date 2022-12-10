use tauri::{
    AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem,
};

use crate::language::get_lang;

// 托盘菜单
pub fn menu() -> SystemTray {
    println!("{}", get_lang());
    let (exit_title, show_title) = match get_lang().as_str() {
        "en-US" => ("exit", "show"),
        "zh-CN" => ("退出应用", "打开窗口"),
        _ => ("exit", "show"),
    };

    let exit = CustomMenuItem::new("exit".to_string(), exit_title);
    // let relaunch = CustomMenuItem::new("relaunch".to_string(), relaunch_title);
    let show = CustomMenuItem::new("show".to_string(), show_title);

    let tray_menu = SystemTrayMenu::new()
        .add_item(show) // 打开窗口
        .add_native_item(SystemTrayMenuItem::Separator) // 分割线
        // .add_item(relaunch) // 重启应用
        .add_item(exit); // 退出应用

    // 设置在右键单击系统托盘时显示菜单
    SystemTray::new().with_menu(tray_menu)
}

// 托盘事件
pub fn handler(app: &AppHandle, event: SystemTrayEvent) {
    // 获取应用窗口
    let window = app.get_window("main").unwrap();

    match event {
        SystemTrayEvent::LeftClick {
            position: _,
            size: _,
            ..
        } => {
            // 点击左键
            window.show().unwrap();
        }
        SystemTrayEvent::RightClick {
            position: _,
            size: _,
            ..
        } => {
            // println!("点击右键");
        }
        SystemTrayEvent::DoubleClick {
            position: _,
            size: _,
            ..
        } => {
            // println!("双击");
            // app.emit_all("win-show", {}).unwrap();
        }
        SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
            "show" => {
                window.show().unwrap();
            }
            "exit" => {
                std::process::exit(0);
            }
            _ => {}
        },
        _ => {}
    }
}
