use super::highlight::{DeleteHightIds, Highlight, HighlightData};

#[tauri::command]
pub fn get_highlightes(book_id: &str) -> Vec<Highlight> {
    let handler = HighlightData::new().unwrap();
    let result = handler.query_highlightes(book_id).unwrap();
    handler.conn.close().unwrap();
    result
}

#[tauri::command]
pub fn add_highlight(data: Highlight) -> Result<bool, String> {
    let mut handler = HighlightData::new().unwrap();
    let result = handler.insert_highlight(data);
    handler.conn.close().unwrap();
    result
}

#[tauri::command]
pub fn delete_highlight(data: DeleteHightIds) -> Result<bool, String> {
    let mut handler = HighlightData::new().unwrap();
    let result = handler.dellete_highlight(data);
    handler.conn.close().unwrap();
    result
}
