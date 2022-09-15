use std::fs::{metadata, File};
use std::io::{BufRead, BufReader};
use std::time::Instant;
use tauri::Window;

#[derive(Clone, serde::Serialize)]
struct Payload {
    message: Vec<u8>,
}

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
        "size is: {}, time: {:?}, result is: {}",
        size,
        duration,
        result.len()
    );
    result
}

/**
 * 此处待优化，rust 向 js 传递较大数值太慢了
 */
#[tauri::command]
pub fn download_local_file(window: Window, path: &str) -> usize {
    let size = file_size(path) as usize;
    let buf = read_buffer(path, size);
    std::thread::spawn(move || {
        let temp = BUFFER_LEN * 4;
        let len = buf.len();
        let mut n = 0;
        while n < len {
            // 防止动态数组读取的时候发生越界行为
            let max = if (n + temp) > len { len } else { n + temp };
            let buffer = &buf[n..max];
            println!("n: {}, max: {}", n, max);
            n = max;
            window
                .emit(
                    "downloadLocalFileEvent",
                    Payload {
                        message: buffer.into(),
                    },
                )
                .unwrap();
        }
        // 代表着 数据读取完毕
        window
            .emit(
                "downloadLocalFileEvent",
                Payload {
                    message: vec![].into(),
                },
            )
            .unwrap();
    });
    size
}
