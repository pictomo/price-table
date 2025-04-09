const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

const filePath = path.join(__dirname, "price-table.csv");

// ① ファイルがなければ作成（サンプルデータ付き）
if (!fs.existsSync(filePath)) {
  const header =
    "date,bitcoin,ethereum\n20250401,60000,40000\n20250402,50000,40000\n";
  fs.writeFileSync(filePath, header, "utf-8");
  console.log("price-table.csv を新規作成しました。");
}

// ② CSVファイルを読み込む
const csvData = fs.readFileSync(filePath, "utf-8");

// ③ パース（ヘッダを含む2次元配列として出力）
const rows = parse(csvData, {
  columns: false, // 配列として読み込む
  skip_empty_lines: true,
});

// ④ 数値を文字列から数値に変換（1行目はヘッダーなのでスキップ）
const converted = [rows[0]]; // ヘッダー行そのまま

for (let i = 1; i < rows.length; i++) {
  converted.push(
    rows[i].map((val, idx) => (idx === 0 ? Number(val) : Number(val)))
  );
}

console.log(converted);
