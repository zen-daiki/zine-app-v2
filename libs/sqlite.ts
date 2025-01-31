import * as SQLite from 'expo-sqlite';

export type Book = {
  id?: number;
  created_at: string;
  updated_at: string;
  title: string;
  booktype: string;
  color: string;
  page_count: number;
  status: string;
  content: string; // JSON文字列として保存
};

const db = SQLite.openDatabaseSync('zine_book.db');

export async function initDatabase(): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      title TEXT NOT NULL,
      booktype TEXT NOT NULL,
      color TEXT NOT NULL,
      page_count INTEGER NOT NULL,
      status TEXT NOT NULL,
      content TEXT NOT NULL
    )
  `);
}

export async function addBook(book: Omit<Book, 'id'>): Promise<void> {
  const now = new Date().toISOString();
  await db.execAsync(`
    INSERT INTO books (
      created_at,
      updated_at,
      title,
      booktype,
      color,
      page_count,
      status,
      content
    ) VALUES (
      '${now}',
      '${now}',
      '${book.title}',
      '${book.booktype}',
      '${book.color}',
      ${book.page_count},
      '${book.status}',
      '${JSON.stringify(book.content)}'
    )
  `);
}

export async function getBooks(): Promise<Book[]> {
  const result = await db.execAsync('SELECT * FROM books ORDER BY created_at DESC');
  const books = ((result as any)?.rows ?? []).map((row: any) => ({
    ...row,
    content: JSON.parse(row.content)
  }));
  return books;
}

export async function getAllBooks(): Promise<Book[]> {
  const result = await db.execAsync('SELECT * FROM books');
  return ((result as any)?.rows ?? []).map((row: any) => ({
    ...row,
    content: JSON.parse(row.content)
  }));
}

export async function updateBook(book: Book): Promise<void> {
  if (!book.id) {
    throw new Error('Book ID is required for update');
  }

  const now = new Date().toISOString();
  await db.execAsync(`
    UPDATE books SET
      updated_at = '${now}',
      title = '${book.title}',
      booktype = '${book.booktype}',
      color = '${book.color}',
      page_count = ${book.page_count},
      status = '${book.status}',
      content = '${JSON.stringify(book.content)}'
    WHERE id = ${book.id}
  `);
}

export async function deleteBook(id: number): Promise<void> {
  await db.execAsync(`DELETE FROM books WHERE id = ${id}`);
}

export async function getTableInfo(): Promise<any[]> {
  const result = await db.execAsync(`
    SELECT * FROM sqlite_master 
    WHERE type='table' AND name='books';
  `) as any;
  return result[0].rows;
}
