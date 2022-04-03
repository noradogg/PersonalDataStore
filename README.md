# Container

mongodb: MongoDB server

node: Web server

insertdata: Connector

# Usage

データをPDSに追加する.  
Database: persona_data  
Collection: persona_data2

データを利用者に表示させるためのフィルターを追加.  
Database: persona_data  
Collection: filter_format  

## docker-compose up

```:コンテナの立ち上げ
% docker-compose up -d
```

## Portal Site

```:実行中のコンテナに入る
% docker-compose exec node bash
```

```:サーバの実行
# npm install
# startserver
```

`startserver`は`node /src/mongo/bin/www`のエイリアス

`npm install`は初回だけ。

[新規登録ページ](http://localhost:3000/users/register)にアクセスして登録し（初回のみ）、[ログインページ](http://localhost:3000/users/login)からログインする。

## Insert Data

```:実行中のコンテナに入る
% docker-compose exec mongo bash
```

```:コネクタの動作確認(テスト)
# python get.py
```

```:mongodbにjsonファイルから得たデータを格納
# python -O get.py
```

# URI

expressのページ  
[http://localhost:3000/](http://localhost:3000/)

新規登録  
[http://localhost:3000/users/register](http://localhost:3000/users/register)

ログイン  
[http://localhost:3000/users/login](http://localhost:3000/users/login)

ログアウト  
[http://localhost:3000/users/logout](http://localhost:3000/users/logout)

マイページ  
[http://localhost:3000/mypage](http://localhost:3000/mypage)

ネットワークログ一覧(VPNで学内ネットワークに接続する.)  
[http://localhost:3000/mypage/ocunet_log](http://localhost:3000/mypage/ocunet_log)

testページ  
[http://localhost:3000/mypage/test](http://localhost:3000/mypage/test)


# MongoDB Compass

connection string: `mongodb://root:password@localhost:27017`

# Abbreviations

DP: Data provider (The source of personal data)

SP: Service provider

PDS: Personal Data Store

# Memo

### insertdata
- データソースがJSONファイルなので、実際に流れてくるデータを取得したい
