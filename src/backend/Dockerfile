# Stage 1: build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS builder
WORKDIR /app

COPY TodoApp.sln ./
COPY src/TodoApp.Api/TodoApp.Api.csproj src/TodoApp.Api/
RUN dotnet restore src/TodoApp.Api/TodoApp.Api.csproj

COPY src/TodoApp.Api/ src/TodoApp.Api/
RUN dotnet publish src/TodoApp.Api/TodoApp.Api.csproj -c Release -o /publish --no-restore

# Stage 2: runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

COPY --from=builder /publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "TodoApp.Api.dll"]
