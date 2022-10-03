use rusqlite::{named_params, Connection, Result};
use serde::{Deserialize, Serialize};

/**
 * 存储 高亮、波浪线、下划线 笔记
 */

#[derive(Serialize, Deserialize, Clone)]
pub struct DomMeta {
    pub parent_tag_name: String,
    pub parent_index: usize,
    pub text_offset: usize,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Highlight {
    pub book_id: String,
    pub id: String,
    pub text: String,
    pub start_meta: DomMeta,
    pub end_meta: DomMeta,
    pub class_name: String,
}

pub struct HighlightData {
    pub conn: Connection,
}

impl HighlightData {
    pub fn new() -> Result<HighlightData> {
        let conn = Connection::open("highlight.db")?;
        // 定义 Highlight 表
        conn.execute(
            "CREATE TABLE IF NOT EXISTS Highlight (
              book_id               TEXT     not null,
              id                    TEXT     PRIMARY KEY,
              text                  text     NOT NULL,
              class_name            text     NOT NULL,
              start_parent_index    integer  NOT NULL,
              start_parent_tag_name text     NOT NULL,
              start_text_offset     integer  NOT NULL,
              end_parent_index      integer  NOT NULL,
              end_parent_tag_name   text     NOT NULL,
              end_text_offset       integer  NOT NULL
          )",
            [],
        )?;
        Ok(HighlightData { conn })
    }
    /**
     * 根据书本 id 获取对应的 高亮笔记内容
     * book_id 书本 id
     */
    pub fn query_highlightes(&self, book_id: &str) -> Result<Vec<Highlight>> {
        let mut stmt = self
            .conn
            .prepare("select * from Highlight as h where h.book_id = :book_id")
            .unwrap();
        let mut rows = stmt.query(named_params! { ":book_id": book_id})?;
        let mut highlightes: Vec<Highlight> = Vec::new();
        while let Some(row) = rows.next()? {
            let result = Highlight {
                book_id: row.get(0)?,
                id: row.get(1)?,
                text: row.get(2)?,
                class_name: row.get(3)?,
                start_meta: DomMeta {
                    parent_index: row.get(4)?,
                    parent_tag_name: row.get(5)?,
                    text_offset: row.get(6)?,
                },
                end_meta: DomMeta {
                    parent_index: row.get(7)?,
                    parent_tag_name: row.get(8)?,
                    text_offset: row.get(9)?,
                },
            };
            highlightes.push(result)
        }

        Ok(highlightes)
    }
    // pub fn update_highlight(&mut self, book_id: String, id: String) {}
    pub fn insert_highlight(&mut self, data: Highlight) -> (bool, String) {
        match self.conn.execute(
            "INSERT INTO Highlight 
            (book_id, id,text,class_name,start_parent_index,start_parent_tag_name, start_text_offset, end_parent_index, end_parent_tag_name, end_text_offset) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                data.book_id,
                data.id,
                data.text,
                data.class_name,
                data.start_meta.parent_index.to_string(),
                data.start_meta.parent_tag_name,
                data.start_meta.text_offset.to_string(),
                data.end_meta.parent_index.to_string(),
                data.end_meta.parent_tag_name,
                data.end_meta.text_offset.to_string(),
            ],
        ){
          Ok(_) => (true, "成功".to_string()),
          Err(err) => {
            println!("INSERT INTO Highlight: {}", err);
            (false, err.to_string())
          }
        }
    }
    // pub fn dellete_highlight(&mut self, book_id: String, id: String) {}
}
