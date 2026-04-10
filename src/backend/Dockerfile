# Stage 1: build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS builder
WORKDIR /app

# slnファイルをコピーする
COPY TodoApp.sln ./
# Directory.Build.propsをコピーする（ImplicitUsings・Nullable等の共通設定）
COPY Directory.Build.props ./
# .scprojをsrc/TodoApp.Api/にコピーする
COPY src/TodoApp.Api/TodoApp.Api.csproj src/TodoApp.Api/
# dotnet restore-プロジェクトの依存関係とツールを復元する
RUN dotnet restore src/TodoApp.Api/TodoApp.Api.csproj

# ソースコードをsrc/TodoApp.Api/にコピーする
COPY src/TodoApp.Api/ src/TodoApp.Api/
# dotnet publish-アプリケーションをコンパイルし、一連の結果を発行する
# -c:ビルド構成を「Release」に指定する
# -o:出力先フォルダを指定する
# dotnet resotreを実行しない
RUN dotnet publish src/TodoApp.Api/TodoApp.Api.csproj -c Release -o /publish --no-restore

# Stage 2: runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# AS builder と名付けたステージの内容をコピーする
COPY --from=builder /publish .

# Port:8080を使用することを明示する
EXPOSE 8080
# 環境変数を定義する（リクエストを待ち受けるURL）
# +:すべてのネットワークインターフェースで待ち受ける（localhostだとコンテナ内部からしかアクセスできなくなる。）
ENV ASPNETCORE_URLS=http://+:8080

# コンテナ起動時に実行するコマンドを指定する
ENTRYPOINT ["dotnet", "TodoApp.Api.dll"]
