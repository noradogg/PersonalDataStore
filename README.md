## Comment

mongodb: MongoDB server
node: Web server

## Usage

```:コンテナの立ち上げ
% docker-compose up -d
% docker-compose exec node bash
```

```:サーバの実行
# cd mongo/
# npm install
# node ./bin/www
```

## URI

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


## MongoDB Compass

connection string: `mongodb://root:password@localhost:27017`