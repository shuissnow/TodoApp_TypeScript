/**
 * バックエンドAPIのベースURL
 * - 本番ビルド（vite build）時は空文字（相対パス）にする。
 *   Nginx が /api/ をバックエンドコンテナにプロキシするため、絶対 URL は不要。
 * - 開発時は VITE_API_BASE_URL 環境変数、未設定なら http://localhost:8080 を使用する。
 */
export const BASE_URL: string = import.meta.env.PROD
  ? ''
  : ((import.meta.env['VITE_API_BASE_URL'] as string | undefined) ?? 'http://localhost:8080')
