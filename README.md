# Python × C++ 程式設計學習中心

網站：https://ray20123315.github.io/

本站 fork 自 [peicd100/peicd100.github.io](https://github.com/peicd100/peicd100.github.io)，沿用原始 MkDocs Material 樣式、擴充與自訂模板。

## 獨立語言導覽

- **Python**：原有 `docs/md/python/` 筆記、APCS 識讀及練習題保持不變。
- **C++**：新增 `docs/md/cpp/` 24 篇從零到競賽的循序教材，含語法、容器、搜尋、圖論、DP 以及自編題庫和模擬測驗。
- **共用首頁**：`docs/portal.md`。
- **MkDocs 設定**：`mkdocs.python.yml` 沿用 `mkdocs.yml` 和上游樣式。
- **GitHub Actions**：`.github/workflows/deploy-python.yml` 同時部署兩種語言，保留 Python 的全部路徑。

網站只提供靜態教材，不在瀏覽器執行 C++。頁面假設 C++17；正式比賽規則以當屆公告為準。Pages 請維持 **Settings → Pages → Source: GitHub Actions**。
