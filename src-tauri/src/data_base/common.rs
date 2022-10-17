use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct DomMeta {
    pub parent_tag_name: String,
    pub parent_index: usize,
    pub text_offset: usize,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct DeleteIds {
    pub book_id: String,
    pub id: String,
}
