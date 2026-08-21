# LINE Chat App

LINE風チャットアプリケーション

## 🚀 デプロイ方法

### Renderへのデプロイ

1. **Renderアカウント作成**
   - https://render.com にアクセス
   - GitHubアカウントで登録

2. **デプロイ手順**
   - Renderダッシュボードで「New +」 → 「Web Service」
   - GitHubリポジトリを接続
   - 以下の設定を入力：
     ```
     Name: line-chat-app
     Environment: Node
     Build Command: npm install && npm run build
     Start Command: npm start
     ```

3. **環境変数設定**
   - 特に設定不要（LocalStorageを使用）

4. **デプロイ実行**
   - 「Create Web Service」をクリック
   - デプロイが自動的に開始

## 📦 ローカル実行

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm start

# 本番ビルド
npm run build
```

## 🔐 ログイン情報

### 管理者アカウント
- **ユーザー名**: curo
- **パスワード**: 071011

## ✨ 主な機能

- ✅ ユーザー認証（サインアップ・ログイン）
- ✅ プロフィール設定
- ✅ リアルタイムチャット
- ✅ 友達管理
- ✅ メッセージ編集・削除
- ✅ 既読機能
- ✅ テーマカラーカスタマイズ
- ✅ 管理者機能（ユーザー管理、お知らせ配信）

## 🛠️ 技術スタック

- **フロントエンド**: React 18.2.0
- **スタイリング**: CSS3
- **データ保存**: LocalStorage
- **ホスティング**: Render

## 📝 パスワード要件

- 最小文字数: 4文字
- 最大文字数: 12文字

## 🌐 URL構成

デプロイ後、以下のURLでアクセス可能：
```
https://your-app-name.onrender.com
```

## ⚙️ トラブルシューティング

### デプロイが失敗する場合
1. ログを確認: Renderダッシュボードの「Logs」タブ
2. Node.jsバージョン確認: 18.x以上が必要
3. package.jsonが正しくフォーマットされているか確認

### ローカルで動作しない場合
1. Node.jsをインストール: https://nodejs.org/
2. 依存関係を再インストール: `rm -rf node_modules && npm install`
3. キャッシュをクリア: `npm cache clean --force`
