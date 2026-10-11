# Python 筆記網站

網站：https://ray20123315.github.io/

此儲存庫 fork 自 [peicd100/peicd100.github.io](https://github.com/peicd100/peicd100.github.io)。網站**直接繼承 fork 來源原有的 MkDocs 設定與自訂模板**（`mkdocs.yml`、`docs/.mkdocs/site.yml`、`theme/`、`tools/`），而非另寫一套 Material 視覺設計。

## Python 專用發布

- `mkdocs.python.yml`：繼承原本 `mkdocs.yml` 的完整外觀、Markdown 擴充與主題覆寫，只替換站名、目錄與需要的插件
- `.github/workflows/deploy-python.yml`：使用原 fork 專案的 `requirements.txt` 建置 Python-only 網站
- `docs/md/python/`：原有 20 份 Markdown（包含首頁）及 32 份 HTML 練習
- `theme/`：保留原 fork 專案的 CSS、JavaScript、頁首及頁尾覆寫

除了 Python 以外的素材與來源仍存在 GitHub 儲存庫，但不複製到對外部署目錄；Python 頁面會使用原來的網址路徑 `/md/python/...`。

GitHub Pages 請使用 **Settings → Pages → Build and deployment → Source: GitHub Actions**，避免分支部署重新覆蓋成不是 Python 專用的網站。
