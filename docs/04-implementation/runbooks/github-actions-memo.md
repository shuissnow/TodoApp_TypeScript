# GitHub Actions メモ

---

## 全体構造

```yaml
name: ワークフロー名

on: ...          # トリガー

concurrency: ... # 同時実行制御（省略可）

jobs:
  job-id:
    runs-on: ubuntu-latest
    steps:
      - uses: ...
      - run: ...
```

### 階層関係

```
Workflow
  └── Job × 1以上   ← 並列実行
        └── Step × 1以上  ← 逐次実行
```

---

## トリガー（on）

```yaml
on:
  push:
    branches: [main]
    paths: ["src/backend/**"]    # このパス配下の変更時のみ
    paths-ignore: ["**.md"]      # Markdown の変更は無視

  pull_request:
    branches: [main]

  workflow_dispatch:             # GitHub UI から手動実行
    inputs:
      environment:
        required: true
        type: choice
        options: [staging, production]

  schedule:
    - cron: "0 9 * * 1-5"       # 平日 9:00 UTC
```

---

## ジョブ（jobs）

### 実行環境

| 値 | OS |
|---|---|
| `ubuntu-latest` | Ubuntu（現在 24.04） |
| `windows-latest` | Windows Server |
| `macos-latest` | macOS |

### ジョブ間の依存（needs）

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: dotnet build

  test:
    needs: build          # build 完了後に実行
    runs-on: ubuntu-latest
    steps:
      - run: dotnet test

  deploy:
    needs: [build, test]  # 両方完了後に実行
```

### ジョブ間のデータ受け渡し（outputs）

```yaml
jobs:
  build:
    outputs:
      version: ${{ steps.get-version.outputs.version }}
    steps:
      - id: get-version
        run: echo "version=1.2.3" >> $GITHUB_OUTPUT

  deploy:
    needs: build
    steps:
      - run: echo "${{ needs.build.outputs.version }}"
```

---

## アクション（uses）

`uses:` で呼び出すアクションの実態は **GitHub 上のリポジトリ**。書式は `{owner}/{repo}@{version}` に対応している。

```yaml
uses: actions/checkout@v4
#     ~~~~~~~ ~~~~~~~~ ~~
#     owner   repo    version（タグ / ブランチ / コミットSHA）
```

### owner の種類

| owner | 意味 | 例 |
|---|---|---|
| `actions` | GitHub 公式 Organization | `actions/checkout` |
| 企業・OSS | サードパーティ | `azure/login`, `docker/build-push-action` |
| 個人 | コミュニティ製 | `codecov/codecov-action` |
| `.` | 同リポジトリ内の自作アクション | `./.github/actions/my-action` |

### よく使う公式アクション（actions/○○）

| アクション | 用途 |
|---|---|
| `actions/checkout@v4` | リポジトリのチェックアウト |
| `actions/setup-dotnet@v4` | .NET SDK のセットアップ |
| `actions/setup-node@v4` | Node.js のセットアップ |
| `actions/cache@v4` | 依存パッケージのキャッシュ |
| `actions/upload-artifact@v4` | ファイルのアップロード保存 |
| `actions/download-artifact@v4` | アップロードしたファイルの取得 |

### バージョン指定の書き方

```yaml
uses: actions/checkout@v4          # タグ指定（推奨）
uses: actions/checkout@main        # ブランチ指定（NG：破壊的変更の影響を受ける）
uses: actions/checkout@a81bbbf     # コミットSHA指定（最も厳密）
```

### 自作アクション（同リポジトリ内）

```yaml
uses: ./.github/actions/my-action  # action.yml を置いたディレクトリを指定
```

---

## ステップ（steps）

```yaml
steps:
  # アクション呼び出し
  - name: リポジトリ取得
    uses: actions/checkout@v4
    with:
      fetch-depth: 0             # アクションへのパラメータ

  # コマンド実行
  - name: ビルド
    working-directory: src/backend
    run: |
      dotnet restore
      dotnet build

  # 条件付き実行
  - name: 失敗時も必ず実行
    if: always()
    uses: actions/upload-artifact@v4

  - name: 失敗時のみ実行
    if: failure()
    run: ./notify.sh

  - name: main ブランチのみ
    if: github.ref == 'refs/heads/main'
    run: ./deploy.sh

  # 前ステップの出力を使う
  - id: my-step
    run: echo "result=ok" >> $GITHUB_OUTPUT
  - run: echo "${{ steps.my-step.outputs.result }}"
```

---

## 式展開（${{ }}）

GitHub Actions エンジンがランナーに渡す**前**に評価・展開される。bash の `$VAR` とは別物。

### 主要コンテキスト

```yaml
${{ github.ref }}           # refs/heads/main
${{ github.sha }}           # コミット SHA
${{ github.workflow }}      # ワークフロー名
${{ github.event_name }}    # push / pull_request 等
${{ runner.os }}            # Linux / Windows / macOS
${{ secrets.MY_SECRET }}    # シークレット
${{ env.MY_VAR }}           # 環境変数
${{ steps.ID.outputs.KEY }} # 前ステップの出力
${{ needs.JOB.outputs.KEY }}# 前ジョブの出力
```

### よく使う関数

```yaml
${{ hashFiles('**/*.csproj') }}           # ファイルのハッシュ値
${{ contains(github.ref, 'main') }}       # bool
${{ startsWith(github.ref, 'refs/') }}    # bool
${{ toJSON(github) }}                     # JSON 文字列化
```

### 文字列への埋め込み

```yaml
key: ${{ runner.os }}-nuget-${{ hashFiles('**/*.csproj') }}
# → "Linux-nuget-9f86d081..."
```

---

## 環境変数とシークレット

```yaml
env:
  GLOBAL: "全体で有効"              # ワークフローレベル

jobs:
  build:
    env:
      JOB_VAR: "このジョブ内"       # ジョブレベル
    steps:
      - env:
          STEP_VAR: "このステップのみ" # ステップレベル
        run: echo "$STEP_VAR"
```

### シークレットは環境変数経由で渡す（推奨）

```yaml
# NG: run: 内で直接展開するとログ漏洩リスク
- run: curl -H "Authorization: ${{ secrets.API_KEY }}" ...

# OK
- env:
    API_KEY: ${{ secrets.API_KEY }}
  run: curl -H "Authorization: $API_KEY" ...
```

---

## キャッシュ

```yaml
# .NET（NuGet）
- uses: actions/cache@v4
  with:
    path: ~/.nuget/packages
    key: ${{ runner.os }}-nuget-${{ hashFiles('**/*.csproj') }}
    restore-keys: |
      ${{ runner.os }}-nuget-

# Node.js（npm）は setup-node に内蔵
- uses: actions/setup-node@v4
  with:
    node-version: "20"
    cache: "npm"
    cache-dependency-path: "src/frontend/package-lock.json"
```

`key` が完全一致 → キャッシュ使用  
`key` が不一致 → `restore-keys` で前方一致フォールバック

---

## アーティファクト

ランナー（仮想マシン）は**ジョブ終了後に環境ごと破棄**される。
アーティファクトとしてアップロードすることで、実行後も GitHub 上にファイルを保持できる。

### 主な用途

| 用途 | 具体例 |
|---|---|
| テスト結果の保存 | `.trx`（Visual Studio のテスト結果形式） |
| カバレッジレポートの保存 | `coverage.cobertura.xml` |
| ビルド成果物の受け渡し | `publish/` → 後続のデプロイジョブで使用 |

### アップロード

```yaml
- uses: actions/upload-artifact@v4
  if: always()                       # テスト失敗時も必ずアップロード
  with:
    name: test-results               # アーティファクト名（UI に表示される）
    path: ./test-results/**/*.trx    # アップロード対象のパス（glob 指定可）
    retention-days: 30               # 保存期間（デフォルト: 90日）
```

### ダウンロード（別ジョブでの利用）

ジョブ間はファイルシステムを共有しないため、アーティファクト経由で受け渡す。

```yaml
jobs:
  build:
    steps:
      - run: dotnet publish -o ./publish
      - uses: actions/upload-artifact@v4
        with:
          name: publish-files
          path: ./publish

  deploy:
    needs: build
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: publish-files
          path: ./publish            # ダウンロード先のパス
      - run: ./deploy.sh
```

### GitHub UI での確認場所

```
Actions タブ → 対象のワークフロー実行を選択 → ページ下部「Artifacts」セクション
```

ZIP 形式でダウンロードできる。

---

## 同時実行制御（concurrency）

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true  # 新しい実行が来たら古い実行をキャンセル
```

同じ PR に連続コミットしたとき、古い CI を自動キャンセルしてコストを節約。

---

## よくあるミスメモ

```yaml
# アクションバージョンは必ず固定
uses: actions/checkout@v4     # OK
uses: actions/checkout@main   # NG

# dotnet は --no-build / --no-restore で二重実行を防ぐ
- run: dotnet build --configuration Release
- run: dotnet test --no-build --configuration Release

# テスト失敗時もアーティファクトを上げる
- uses: actions/upload-artifact@v4
  if: always()   # ← これを忘れがち

# paths フィルターで不要な CI 実行を防ぐ
on:
  push:
    paths: ["src/backend/**"]
```

---

## 参考

- [ワークフロー構文リファレンス](https://docs.github.com/ja/actions/writing-workflows/workflow-syntax-for-github-actions)
- [式構文リファレンス](https://docs.github.com/ja/actions/writing-workflows/choosing-what-your-workflow-does/evaluate-expressions-in-workflows-and-actions)
- [Actions Marketplace](https://github.com/marketplace?type=actions)
