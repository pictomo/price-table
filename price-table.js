const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

const now = new Date();

// ファイルパスの定義
const filePath = path.join(__dirname, "price-table.csv");

// 二次元配列をCSV形式の文字列に変換する関数
list2csv = (list) => {
  return list.map((row) => row.join(",")).join("\n") + "\n";
};

// price-table.csv がなければ新規作成
if (!fs.existsSync(filePath)) {
  // デフォルトの通貨
  const defaultCurrencies = ["bitcoin", "ethereum", "litecoin", "dogecoin"];

  // 初期配列の定義
  const initialData = [["date", ...defaultCurrencies]];

  // 初期データをファイルに保存
  const csvString = list2csv(initialData);
  fs.writeFileSync(filePath, csvString, "utf-8");
  console.log("price-table.csv を新規作成しました。");
}

// CSVファイルを読み込む
const csvData = fs.readFileSync(filePath, "utf-8");

// パースして2次元配列として出力
const data = parse(csvData, {
  columns: false,
  skip_empty_lines: true,
  cast: (value) => {
    return value === "" ? null : value;
  },
});

const currencyCount = data[0].length - 1;

// 行が一つもなければ、本日の行を追加
if (data.length === 1) {
  const newRow = [
    now.toLocaleDateString("sv-SE"),
    ...Array(currencyCount).fill(null),
  ];
  data.push(newRow);
}

// 本日までの行を追加
let lastDate = new Date(data[data.length - 1][0]);
lastDate.setDate(lastDate.getDate() + 1);
while (lastDate < now) {
  const newRow = [
    lastDate.toLocaleDateString("sv-SE"),
    ...Array(currencyCount).fill(null),
  ];
  data.push(newRow);
  lastDate.setDate(lastDate.getDate() + 1);
}

// ファイルに保存
const csvString = list2csv(data);
fs.writeFileSync(filePath, csvString, "utf-8");
