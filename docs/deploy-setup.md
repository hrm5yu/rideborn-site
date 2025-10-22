# お名前.comレンタルサーバー自動デプロイ設定ガイド

このドキュメントでは、GitHub Actionsを使用してお名前.comのレンタルサーバーに自動デプロイするための設定手順を説明します。

## 前提条件

- お名前.comのレンタルサーバー契約済み
- SSH接続が有効になっている
- GitHubリポジトリの管理権限がある

## 設定手順

### 1. SSH鍵の生成と設定

#### 1.1 SSH鍵ペアの生成
```bash
# 新しいSSH鍵を生成（既存の鍵がある場合はスキップ）
ssh-keygen -t rsa -b 4096 -C "your-email@example.com" -f ~/.ssh/onamae_deploy_key
```

#### 1.2 公開鍵をサーバーに追加
1. 生成された公開鍵（`~/.ssh/onamae_deploy_key.pub`）の内容をコピー
2. お名前.comのサーバー管理画面でSSH鍵を登録
3. または、サーバーにSSH接続して `~/.ssh/authorized_keys` に追加

#### 1.3 秘密鍵をGitHub Secretsに追加
1. GitHubリポジトリの「Settings」→「Secrets and variables」→「Actions」に移動
2. 「New repository secret」をクリック
3. 以下のSecretsを追加：

| Secret名 | 値 | 説明 |
|---------|-----|------|
| `SERVER_HOST` | サーバーのホスト名またはIPアドレス | 例: `example.com` または `123.456.789.0` |
| `SERVER_USERNAME` | SSH接続用のユーザー名 | 例: `username` |
| `SERVER_SSH_KEY` | 秘密鍵の内容（`~/.ssh/onamae_deploy_key`） | 秘密鍵ファイルの内容をそのまま貼り付け |
| `SERVER_PORT` | SSH接続ポート | 通常は `22` |
| `SERVER_DEPLOY_PATH` | デプロイ先のディレクトリパス | 例: `/home/username/public_html` |

### 2. サーバー側の準備

#### 2.1 デプロイ先ディレクトリの作成
```bash
# サーバーにSSH接続
ssh username@your-server.com

# デプロイ先ディレクトリを作成（存在しない場合）
mkdir -p /home/username/public_html

# 適切な権限を設定
chmod 755 /home/username/public_html
```

#### 2.2 .htaccessファイルの設定（必要に応じて）
```apache
# /home/username/public_html/.htaccess
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [QSA,L]
```

### 3. GitHub Actionsの設定確認

ワークフローファイル（`.github/workflows/deploy.yml`）が正しく設定されていることを確認してください。

### 4. デプロイの実行

#### 4.1 自動デプロイ
- `main`ブランチにpushすると自動的にデプロイが実行されます

#### 4.2 手動デプロイ
1. GitHubリポジトリの「Actions」タブに移動
2. 「Deploy to Onamae.com Server」ワークフローを選択
3. 「Run workflow」ボタンをクリック

## トラブルシューティング

### SSH接続エラー
- SSH鍵の権限を確認：`chmod 600 ~/.ssh/onamae_deploy_key`
- サーバーのSSH設定を確認
- ファイアウォール設定を確認

### デプロイエラー
- サーバーのディスク容量を確認
- ファイル権限を確認
- ログを確認：GitHub Actionsの「Actions」タブで詳細を確認

### ファイルが表示されない
- デプロイ先ディレクトリのパスを確認
- ファイル権限を確認（644 for files, 755 for directories）
- Webサーバーの設定を確認

## セキュリティの注意点

1. **SSH鍵の管理**
   - 秘密鍵は絶対に公開しない
   - 定期的に鍵を更新する
   - 不要になった鍵は削除する

2. **サーバーアクセス**
   - 最小権限の原則に従う
   - 定期的にアクセスログを確認する

3. **Secrets管理**
   - GitHub Secretsは定期的に更新する
   - 不要になったSecretsは削除する

## 参考リンク

- [GitHub Actions公式ドキュメント](https://docs.github.com/ja/actions)
- [お名前.comレンタルサーバー公式サイト](https://www.onamae.com/)
- [SSH接続の設定方法](https://help.onamae.com/answer/1000)
