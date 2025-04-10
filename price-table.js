const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

// デフォルトの通貨
const defaultCurrencies = ["bitcoin", "ethereum", "litecoin", "dogecoin"];
// ベース通貨
const baseCurrency = "jpy";
// RateLimit回避のためのリクエスト間隔
// coingecko API のレートリミット ~30calls/minute
// https://docs.coingecko.com/reference/common-errors-rate-limit#rate-limit
const baseRequestSpeed = 12000;

(async () => {
  const now = new Date();

  // ファイルパスの定義
  const filePath = path.join(__dirname, "price-table.csv");

  // 二次元配列をCSV形式の文字列に変換する関数
  list2csv = (list) => {
    return list.map((row) => row.join(",")).join("\n") + "\n";
  };

  // price-table.csv がなければ新規作成
  if (!fs.existsSync(filePath)) {
    // 初期配列の定義
    const initialData = [["date", ...defaultCurrencies]];

    // 初期データをファイルに保存
    const csvString = list2csv(initialData);
    fs.writeFileSync(filePath, csvString, "utf-8");
    console.log("'price-table.csv' created");
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

  // 価格データを挿入
  let firstItr = true;
  for (let i = 1; i < data.length; i++) {
    date = new Date(data[i][0]);
    for (let currencyNum = 1; currencyNum <= currencyCount; currencyNum++) {
      // データがない場合は null を挿入
      if (data[i][currencyNum] === null) {
        let requestSpeed = baseRequestSpeed;
        while (true) {
          let response;
          try {
            if (firstItr) {
              firstItr = false;
            } else {
              console.log(`Waiting ${requestSpeed.toLocaleString()} msec...`);
              await new Promise((resolve) => setTimeout(resolve, requestSpeed));
            }
            response = await fetch(
              `https://api.coingecko.com/api/v3/coins/${
                data[0][currencyNum]
              }/history?date=${date.toLocaleDateString("brx-IN")}`
            );
            const json = await response.json();
            const price = json.market_data.current_price[baseCurrency];
            data[i][currencyNum] = price;
            break;
          } catch (error) {
            if (response.status === 429) {
              // レートリミットに引っかかった場合は、リクエストを遅延させる
              requestSpeed *= 2;
              console.log(
                `Rate limit exceeded. Waiting ${requestSpeed.toLocaleString()} msec...`
              );
            } else {
              // その他のエラーの場合は、responseを表示して終了
              console.error("Error:", error);
              console.error("Response:", response);
              console.error("[Process ended with an Error]");
              process.exit(1);
            }
          }
        }
      }

      // データごとにファイルに保存
      const csvString = list2csv(data);
      fs.writeFileSync(filePath, csvString, "utf-8");
    }
  }
})();
