use rusqlite::{named_params, Connection, Result};
use serde::{Deserialize, Serialize};

use super::common::DeleteIds;

#[derive(Serialize, Deserialize, Clone)]
pub struct DomMeta {
    pub tag_name: String,
    pub index: usize,
    pub offset: usize,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Notes {
    pub book_id: String,
    pub id: String,
    pub text: String,
    pub start_dom_meta: DomMeta,
    pub end_dom_meta: DomMeta,
    pub class_name: String,
    pub page_number: usize,
    pub notes: String,
    pub create_time: usize,
    pub tag_name: String,
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
          start_index           integer  NOT NULL,
          start_tag_name        text     NOT NULL,
          start_offset          integer  NOT NULL,
          end_index             integer  NOT NULL,
          end_tag_name          text     NOT NULL,
          end_offset            integer  NOT NULL,
          page_number           integer  NOT NULL,
          notes                 text     NOT NULL,
          create_time           integer  NOT NULL,
          tag_name              text     NOT NULL
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
                start_dom_meta: DomMeta {
                    index: row.get(4)?,
                    tag_name: row.get(5)?,
                    offset: row.get(6)?,
                },
                end_dom_meta: DomMeta {
                    index: row.get(7)?,
                    tag_name: row.get(8)?,
                    offset: row.get(9)?,
                },
                page_number: row.get(10)?,
                notes: row.get(11)?,
                create_time: row.get(12)?,
                tag_name: row.get(13)?,
            };
            list.push(result)
        }

        Ok(list)
    }

    pub fn insert_notes(&mut self, data: Notes) -> Result<bool, String> {
        match self.conn.execute(
          "INSERT INTO Notes 
          (book_id, id,text,class_name,start_index,start_tag_name, start_offset, end_index, end_tag_name, end_offset, page_number, notes,create_time,tag_name) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
              data.book_id,
              data.id,
              data.text,
              data.class_name,
              data.start_dom_meta.index.to_string(),
              data.start_dom_meta.tag_name,
              data.start_dom_meta.offset.to_string(),
              data.end_dom_meta.index.to_string(),
              data.end_dom_meta.tag_name,
              data.end_dom_meta.offset.to_string(),
              data.page_number.to_string(),
              data.notes,
              data.create_time.to_string(),
              data.tag_name,
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
            "UPDATE Notes as h set notes = ?1 where h.book_id = ?2 and h.id = ?3",
            [data.notes, data.book_id, data.id],
        ) {
            Ok(_) => Ok(true.into()),
            Err(err) => {
                println!("UPDATE FROM Notes: {}", err);
                Err(err.to_string().into())
            }
        }
    }
}
