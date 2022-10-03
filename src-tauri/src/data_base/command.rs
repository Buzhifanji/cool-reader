use super::highlight::{Highlight, HighlightData};

#[tauri::command]
pub fn get_highlightes(book_id: &str) -> Vec<Highlight> {
    let handler = HighlightData::new().unwrap();
    let result = handler.query_highlightes(book_id).unwrap();
    handler.conn.close().unwrap();
    result
}

#[tauri::command]
pub fn add_highlight(data: Highlight) -> (bool, String) {
    match HighlightData::new() {
        Ok(mut handler) => {
            let result = handler.insert_highlight(data);
            handler.conn.close().unwrap();
            result
        }
        Err(err) => {
            println!("err:  {}", err);
            (false, err.to_string())
        }
    }
}
