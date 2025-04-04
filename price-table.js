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

// ③ パースして日付をキーにしたオブジェクトに変換
const records = parse(csvData, {
  columns: true,
  skip_empty_lines: true,
});

const result = {};
for (const row of records) {
  const { date, ...rest } = row;
  result[date] = Object.fromEntries(
    Object.entries(rest).map(([key, value]) => [key, Number(value)])
  );
}

console.log(result);
