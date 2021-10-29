# PersonalDataStore

## comment

`mongod`コマンドは正常に実行できる。
`mongod --fork --logpath /data/db/mongod.log`コマンドならバックグラウンドで起動が可能。--forkは、ログの出力先を指定してあげないとダメらしい。

`systemctl start mongod`を実行すると、`systemctl status mongod`で確認したところ、inactive(dead)と言われる。
おそらく、PID1が/sbin/init ではないのが問題。

## command

```bash:docker (イメージのビルド、立ち上げ、操作)
% docker-compose build  # 初回だけ
% docker-compose up -d
% docker-compose exec ubuntu bash
```

```bash:まとめたもの(コピペ用)
% docker-compose build && docker-compose up -d && docker-compose exec ubuntu bash
% docker-compose up -d && docker-compose exec ubuntu bash
```

```bash:バージョン確認
$ mongod --version
db version v4.4.10
Build Info: {
    "version": "4.4.10",
    "gitVersion": "58971da1ef93435a9f62bf4708a81713def6e88c",
    "openSSLVersion": "OpenSSL 1.1.1f  31 Mar 2020",
    "modules": [],
    "allocator": "tcmalloc",
    "environment": {
        "distmod": "ubuntu2004",
        "distarch": "aarch64",
        "target_arch": "aarch64"
    }
}
```

```bash:mongodで起動
$ mongod
$  # ↓バックグラウンドで起動するなら
$ mongod --fork --logpath /data/db/mongod.log
```

```bash:systemctlで起動(現状できていない)
$ systemctl start mongod
```