import './styles/main.css'
import { initApp } from './app'

/**
 * DOMの読み込み完了後にアプリを初期化する
 */
document.addEventListener('DOMContentLoaded', () => {
  void initApp()
})
