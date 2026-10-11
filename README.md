# Python 筆記

公開網站：https://ray20123315.github.io/

這份網站使用本儲存庫**原有的 MkDocs Material 模板**，保留原先的深色 cyan 配色、側邊導覽、右側目錄、程式碼高亮與文章搜尋。網站內容只顯示 Python 語法筆記及 APCS 題目練習。

- `mkdocs.python.yml`：Python 專屬的 Material 主題設定與完整章節導覽
- `docs/md/python/`：保留原有 20 份 Markdown（含原始首頁）與 32 份 HTML 題目
- `theme/`：沿用原始的 Material 版型覆寫、CSS 和 JavaScript
- `.github/workflows/deploy-python.yml`：GitHub Actions 建置與部署 Python-only 靜態網站

**其他科目及原有 MkDocs 設定檔均沒有刪除。** 部署流程僅從 `docs/md/python/` 選取 Markdown 與 HTML 文件，加上模板資產，產生對外發布的網站。Python 資料夾下的其他備份或測試檔案不會發布。

如果 GitHub Pages 設定尚未切換，請在儲存庫 **Settings → Pages → Build and deployment → Source** 選 **GitHub Actions**，讓 `Deploy Python Notes` 成為網站的部署來源。

原先的 `index.html`、`lesson.html`、`python.css` 和 `python.js` 作為既有檔案保留，但不是 MkDocs 網站使用的入口與樣式。
