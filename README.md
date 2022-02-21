# Container

mongodb: MongoDB server
node: Web server
insertdata: Connector

# Usage

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
# node ./bin/www
```

`npm install`は初回だけ.

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
- テスト環境なので、もう少しこる

### node
- PDSからデータを取ることはできている（コンソールで確認）ので、フロントエンドで表示したい