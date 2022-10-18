use rusqlite::{named_params, Connection, Result};
use serde::{Deserialize, Serialize};

use super::common::{DeleteIds, DomMeta};

#[derive(Serialize, Deserialize, Clone)]
pub struct Notes {
    pub book_id: String,
    pub id: String,
    pub text: String,
    pub start_meta: DomMeta,
    pub end_meta: DomMeta,
    pub class_name: String,
    pub page_number: usize,
    pub notes: String,
}

pub struct NotestData {
    pub conn: Connection,
}

impl NotestData {
    pub fn new() -> Result<NotestData> {
        let conn = Connection::open("notes.db")?;
        // 定义 Highlight 表
        conn.execute(
            "CREATE TABLE IF NOT EXISTS Notes (
          book_id               TEXT     not null,
          id                    TEXT     PRIMARY KEY,
          text                  text     NOT NULL,
          class_name            text     NOT NULL,
          start_parent_index    integer  NOT NULL,
          start_parent_tag_name text     NOT NULL,
          start_text_offset     integer  NOT NULL,
          end_parent_index      integer  NOT NULL,
          end_parent_tag_name   text     NOT NULL,
          end_text_offset       integer  NOT NULL,
          page_number           integer  NOT NULL,
          notes                 text     NOT NULL
      )",
            [],
        )?;
        Ok(NotestData { conn })
    }

    pub fn query_notes(&self, book_id: &str) -> Result<Vec<Notes>> {
        let mut stmt = self
            .conn
            .prepare("select * from Notes as h where h.book_id = :book_id")
            .unwrap();
        let mut rows = stmt.query(named_params! { ":book_id": book_id})?;
        let mut list: Vec<Notes> = Vec::new();
        while let Some(row) = rows.next()? {
            let result = Notes {
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
                page_number: row.get(10)?,
                notes: row.get(11)?,
            };
            list.push(result)
        }

        Ok(list)
    }

    pub fn insert_notes(&mut self, data: Notes) -> Result<bool, String> {
        match self.conn.execute(
          "INSERT INTO Notes 
          (book_id, id,text,class_name,start_parent_index,start_parent_tag_name, start_text_offset, end_parent_index, end_parent_tag_name, end_text_offset, page_number, notes) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
              data.page_number.to_string(),
              data.notes,
          ],
      ){
        Ok(_) => Ok(true.into()),
        Err(err) => {
          println!("INSERT INTO Notes: {}", err);
          Err(err.to_string().into())
        }
      }
    }
    pub fn delete_notes(&mut self, data: DeleteIds) -> Result<bool, String> {
        match self.conn.execute(
            "DELETE FROM Notes as h where h.book_id = ?1 and h.id = ?2",
            [data.book_id, data.id],
        ) {
            Ok(_) => Ok(true.into()),
            Err(err) => {
                println!("INSERT INTO Notes: {}", err);
                Err(err.to_string().into())
            }
        }
    }
    pub fn update_notes(&mut self, data: Notes) -> Result<bool, String> {
        match self.conn.execute(
            "UPDATE Notes as h set class_name = ?1 where h.book_id = ?2 and h.id = ?3",
            [data.class_name, data.book_id, data.id],
        ) {
            Ok(_) => Ok(true.into()),
            Err(err) => {
                println!("UPDATE FROM Notes: {}", err);
                Err(err.to_string().into())
            }
        }
    }
}
