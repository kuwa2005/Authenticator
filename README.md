# Authenticator

[English](README.en.md)

<img align="right" width="100" height="100" src="https://github.com/kuwa2005/Authenticator/raw/main/images/icon.svg">

> ブラウザ上で2段階認証コードを生成します。

## このリポジトリについて

`kuwa2005/Authenticator` を、このフォークの保守先として使います。上流の [Authenticator-Extension/Authenticator](https://github.com/Authenticator-Extension/Authenticator) は、今後の不具合報告・機能追加・リリースの対象にしません。上流への Pull Request も送りません。

次は、このリポジトリで受け付けます。

- 不具合報告
- セキュリティ報告
- 機能要望
- リリースの確認

## リリースタグ

フォークのリリースは次の形式です。

`fork-v<major>.<minor>.<patch>`

例: `fork-v8.0.3`

- タグは、確認が済んだ `main` からのみ切ります。
- セキュリティ修正だけのリリースは、パッチ番号だけ上げることがあります（例: `fork-v8.0.4`）。
- リリースノートには、このフォーク固有の変更と、セキュリティに影響する修正を書きます。

## 配布先

Chrome、Firefox、Microsoft Edge 向けのストア版があります。ストア版は上流の公開物です。このフォークの開発ビルドとは別です。

[<img src="https://raw.githubusercontent.com/wiki/Authenticator-Extension/Authenticator/readme-images/chrome-web-store.png" title="Chrome Web Store" width="170" height="48" />](https://chrome.google.com/webstore/detail/authenticator/bhghoamapcdpbohphigoooaddinpkbai) [<img src="https://raw.githubusercontent.com/wiki/Authenticator-Extension/Authenticator/readme-images/firefox-add-ons.png" title="Firefox Add-ons" width="170" height="48" />](https://addons.mozilla.org/en-US/firefox/addon/auth-helper?src=external-github) [<img src="https://raw.githubusercontent.com/wiki/Authenticator-Extension/Authenticator/readme-images/microsoft-store.png" title="Microsoft Store" height="48">](https://microsoftedge.microsoft.com/addons/detail/ocglkepbibnalbgmbachknglpdipeoio)

### Safari 版

Safari 版は App Store にあります。このフォークでは Safari 版を公式にはサポートしません。

[<img width="150" alt="Download on the App Store" src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"/>](https://apps.apple.com/us/app/authen/id1602945200?mt=12)

## Chrome に読み込む

リポジトリ直下には `manifest.json` がありません。Chrome は、選んだフォルダの直下にある `manifest.json` だけを見ます。クローンしたディレクトリ自体を指定すると、「マニフェスト ファイルが見つからないか、または読み取れません」となります。

ビルド済みの拡張機能は `chrome/` に入っています。クローンしたあと、追加のビルドなしでこのフォルダを読み込めます。

Chrome で次の操作をします。

1. `chrome://extensions` を開く
2. デベロッパーモードをオンにする
3. 「パッケージ化されていない拡張機能を読み込む」を押す
4. このリポジトリの `chrome` ディレクトリを選ぶ（`manifest.json` があるフォルダ）

ソースを変更したあとに読み込み用のフォルダを更新する場合:

```bash
npm install
npm run chrome
```

Windows でビルドする場合は、[Git Bash](https://git-scm.com/download/win) か [Cygwin](http://cygwin.com/) を使います。

開発中に JavaScript だけ再ビルドする場合:

```bash
npm run dev:chrome
```

webpack が出力を書いたあとは、`chrome://extensions` で拡張機能を再読み込みします。

ワンタイムパスワードの生成自体は、API キーがなくても動きます。Google ドライブ / Dropbox / OneDrive へのバックアップを使うときだけ、`src/models/credentials.ts` に各サービスのキーを入れます。

## ビルド

```bash
npm install
npm run chrome    # ./chrome
npm run firefox   # ./firefox
npm run edge      # ./edge
npm run prod      # ./release/{chrome,firefox,edge}
```

再現ビルド:

```bash
npm ci
npm run prod
```

Safari 向けの再現ビルドは、[Authenticator-Extension/Authen](https://github.com/Authenticator-Extension/Authen#how-to-contribute) の手順に従います。

Windows でビルドする場合は、[Git Bash](https://git-scm.com/download/win) か [Cygwin](http://cygwin.com/) を使います。

## 謝辞

ルクセンブルク大学の最高情報セキュリティ責任者（CISO）である Laurent と、同大学の情報セキュリティチームに感謝します。開発中に受けたセキュリティ上の指摘は、脆弱性の特定と対処に役立ち、このプロジェクトの安全性と信頼性を高めています。

オープンソースの維持には人手が要ります。同チームの協力は大学内に留まらず、利用者と開発者の双方に届いています。
