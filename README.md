# Python 學習筆記

網站：https://ray20123315.github.io/

本儲存庫的公開首頁目前只顯示 Python 筆記與 APCS 題目練習。其他原有目錄、教材與設定檔**保留在儲存庫中，不在公開首頁導覽展示**。

## 公開網頁檔案

- `index.html`：Python 學習筆記首頁、搜尋、分類
- `lesson.html`：本網域內的 Markdown 閱讀器
- `python.css`、`python.js`：視覺設計、深淺色、轉場、搜尋、文章閱讀
- `md/python/`：原始 Python .md 與 HTML 練習題的本站副本（Git blob 未變）
- `.github/workflows/deploy-python.yml`：只發布 Python 內容的 GitHub Pages 工作流程

原本的 `docs/`、MkDocs 設定和其他內容未被刪除；如日後需要恢復，仍可從儲存庫取用。GitHub Pages 建議使用 **Settings → Pages → Build and deployment → Source: GitHub Actions**。

### 注意

- Markdown 筆記由本站讀取，使用第三方 Marked.js JavaScript 套件在瀏覽器呈現；不會導往原始筆記網站。若 CDN 無法使用，筆記頁面會顯示載入錯誤。
- `md/python/*.html` 練習頁沿用儲存庫既有內容，因此其內部若自行連結外部資源，仍可能會開啟外部網站。
