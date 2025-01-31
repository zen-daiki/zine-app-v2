import { getTableInfo, getAllBooks } from '../libs/sqlite';

async function checkDatabase() {
  try {
    console.log('=== テーブル情報 ===');
    const tableInfo = await getTableInfo();
    console.log(JSON.stringify(tableInfo, null, 2));

    console.log('\n=== 登録されているデータ ===');
    const books = await getAllBooks();
    console.log(JSON.stringify(books, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

checkDatabase();
