# "price-table"の使い方
1. 価格表を配置したい任意のディレクトリ上に、"price-table"を配置する。
2. ファイルに実行権限を付与する。
  1. "Terminal.app"を開く。
  2. コマンド`chmod u+x {"price-table"のパス}`を入力し実行する。
    * "price-table"を配置したのがデスクトップであれば、`chmod u+x ~/Desktop/price-table`
3. "price-table"をダブルクリックして実行する。
  1. "Terminal.app"が起動し、処理の経過が表示される。
  2. CoinGeckoのリクエストレートリミットのため、実行には時間がかかる。
    * (デフォルトで1データにつき12秒)
  3. "[Process completed]"と表示されたら終了、"Terminal.app"を閉じて良い。
    * この時、"[Process ended with Error]"と表示されている場合は何らかの問題が発生し異常終了している。
    * プロセスの実行中に"Terminal.app"を終了した場合、プロセスが中断しその時点までのデータが挿入される。
    * 再度実行すれば、中断された場所からデータ挿入が再開される。
4. "price-table.csv"が同一ディレクトリ上に配置される。
5. "price-table.csv"は、"price-table"を実行する度に最新版に更新される。

## ファイルの操作
基本的にはダブルクリックによって実行することのみが想定されています。
以下に示す操作はなるべく最小限に、厳密にマニュアル通りにお願いします。
もし頻繁に行う様であれば藤田まで。

### Excelによる操作
#### 日付を増やす
1. 1列目に(日付欄)に日付を追加する。
  * この時、日付のフォーマットを逸脱しないように注意。
  * 日付は必ず若い順の順番となるように配置する。
2. "price-table"を実行する。

#### 通貨を増やす
1. 1行目(通貨欄)に[通貨表](https://docs.google.com/spreadsheets/d/1wTTuxXt8n9q7C4NDXqQpI3wpKu1_5bGVmP9Xz0XGSyU/edit?gid=0#gid=0)から調べたIdを追加し、保存する。
2. "price-table"を実行する。

#### 通貨を減らす(非推奨)
1. 既存の通貨の列を消去し、保存する。
  * この時、特定のセルだけではなく必ず列を全選択して消去する。

### Excel以外による操作(非推奨)
未検証。
TextEditorを使う場合は、カンマの数に注意して行うこと。

# その他の情報
[ソース](https://github.com/pictomo/price-table)