use std::fs::{metadata, File};
use std::io::{BufRead, BufReader};
use std::time::Instant;
use tauri::{Manager, Window};
use tokio::sync::mpsc;
use tokio::sync::Mutex;

const BUFFER_LEN: usize = 5 * 1024 * 1024;

fn file_size(path: &str) -> u64 {
    let result = metadata(path);
    match result {
        Ok(metadata) => metadata.len(),
        _ => 0,
    }
}

fn read_buffer(path: &str, size: usize) -> Vec<u8> {
    let start = Instant::now();
    let file = File::open(path).unwrap();
    let mut result: Vec<u8> = Vec::with_capacity(size);
    let mut reader = BufReader::with_capacity(BUFFER_LEN, file);
    let mut count = 0;
    loop {
        count += BUFFER_LEN;
        let v = reader.fill_buf().unwrap();
        let mut bytes = v.to_vec();
        result.append(&mut bytes);
        let len = v.len();
        reader.consume(len);
        if count > size {
            break;
        }
    }

    let duration = start.elapsed();
    println!(
        "size is: {}, time: {:?}, result: {:?}",
        size,
        duration,
        result.len()
    );
    result
}

pub struct AsyncProcInputTx {
    pub inner: Mutex<mpsc::Sender<Vec<u8>>>,
}

#[derive(Clone, serde::Serialize)]
struct Payload {
    message: usize,
}

/**
 * 此处待优化，rust 向 js 传递较大数值太慢了
 */
#[tauri::command]
pub async fn download_local_file(
    window: Window,
    message: &str,
    state: tauri::State<'_, AsyncProcInputTx>,
) -> Result<(), String> {
    let size = file_size(message) as usize;
    let buf = read_buffer(message, size);
    let temp = BUFFER_LEN * 2;
    let len = buf.len();
    let mut n = 0;
    let async_proc_input_tx = state.inner.lock().await;

    // 发送 文件大小
    std::thread::spawn(move || {
        window
            .emit(
                "fileSize",
                Payload {
                    message: size.into(),
                },
            )
            .unwrap();
    });

    while n < len {
        // 防止动态数组读取的时候发生越界行为
        let max = if (n + temp) > len { len } else { n + temp };
        let buffer = &buf[n..max];
        println!("n: {}, max: {}", n, max);
        n = max;
        // 切片发送内容
        async_proc_input_tx
            .send(buffer.into())
            .await
            .map_err(|e| e.to_string())
            .unwrap();
    }
    // 发送空数组代表着 结束
    async_proc_input_tx
        .send(vec![].into())
        .await
        .map_err(|e| e.to_string())
}

// A function that sends a message from Rust to JavaScript via a Tauri Event
pub fn send_file<R: tauri::Runtime>(message: Vec<u8>, manager: &impl Manager<R>) {
    manager.emit_all("downloadLocalFileEvent", message).unwrap();
}
