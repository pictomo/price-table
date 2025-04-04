const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

const filePath = path.join(__dirname, "price-table.csv");

// ① ファイルがなければ作成（ヘッダだけのCSV）
if (!fs.existsSync(filePath)) {
  const header = "product,price\n";
  fs.writeFileSync(filePath, header, "utf-8");
  console.log("price-table.csv を新規作成しました。");
}

// ② ファイルを読み込む
const csvData = fs.readFileSync(filePath, "utf-8");

// ③ パース（JSON形式で出す）
const records = parse(csvData, {
  columns: true, // ヘッダをキーにしたオブジェクトにする
  skip_empty_lines: true,
});

console.log(records);

// ④ 2重リストで表示したい場合
const rawRecords = parse(csvData, {
  columns: false, // ヘッダ行含むすべてを配列として扱う
  skip_empty_lines: true,
});

console.log(rawRecords);
