import './styles/main.css'
import { render } from './app'

/**
 * DOMの読み込み完了後にアプリを初回描画する
 */
document.addEventListener('DOMContentLoaded', () => {
  render()
})
