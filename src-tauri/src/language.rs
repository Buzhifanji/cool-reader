use lazy_static::lazy_static;
use std::sync::Mutex;

#[derive(Debug)]
struct Language {
    lang: String,
}

impl Language {
    fn new() -> Language {
        Language {
            lang: "en-US".to_string(),
        }
    }
}

lazy_static! {
    static ref LANG: Mutex<Language> = Mutex::new(Language::new());
}

// 设置 语言
#[tauri::command]
pub fn set_lang(value: String) {
    println!("language: {}", value);
    LANG.lock().unwrap().lang = value;
}

// 获取 语言
pub fn get_lang() -> String {
    LANG.lock().unwrap().lang.clone()
}
