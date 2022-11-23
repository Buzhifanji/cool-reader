use super::notes::{DeleteIds, Notes, NotestData};

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
