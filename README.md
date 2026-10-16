# oedo11

大江戸Ruby会議11のWebサイトです。

## 開発

RubyとBundlerを用意したうえで、依存関係をインストールします。

```sh
bundle install
bundle exec middleman server
```

ブラウザーで http://localhost:4567 を開きます。

静的ファイルの生成は `bundle exec middleman build` で行います。