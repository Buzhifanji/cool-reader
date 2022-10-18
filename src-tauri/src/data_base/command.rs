use super::{
    common::DeleteIds,
    highlight::{Highlight, HighlightData},
    notes::{Notes, NotestData},
};

/*****************  highlight *********************/
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
pub fn delete_highlight(data: DeleteIds) -> Result<bool, String> {
    let mut handler = HighlightData::new().unwrap();
    let result = handler.dellete_highlight(data);
    handler.conn.close().unwrap();
    result
}

#[tauri::command]
pub fn update_highlight(data: Highlight) -> Result<bool, String> {
    let mut handler = HighlightData::new().unwrap();
    let result = handler.update_highlight(data);
    handler.conn.close().unwrap();
    result
}

/*****************  notes *********************/
#[tauri::command]
pub fn get_notes(book_id: &str) -> Vec<Notes> {
    let handler = NotestData::new().unwrap();
    let result = handler.query_notes(book_id).unwrap();
    handler.conn.close().unwrap();
    result
}

#[tauri::command]
pub fn add_notes(data: Notes) -> Result<bool, String> {
    let mut handler = NotestData::new().unwrap();
    let result = handler.insert_notes(data);
    handler.conn.close().unwrap();
    result
}

#[tauri::command]
pub fn delete_notes(data: DeleteIds) -> Result<bool, String> {
    let mut handler = NotestData::new().unwrap();
    let result = handler.delete_notes(data);
    handler.conn.close().unwrap();
    result
}

#[tauri::command]
pub fn update_notes(data: Notes) -> Result<bool, String> {
    let mut handler = NotestData::new().unwrap();
    let result = handler.update_notes(data);
    handler.conn.close().unwrap();
    result
}
