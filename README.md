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

## C++ 漸進式練習

- 21 堂課各四關：觀念選擇、語法填空、引導實作、獨立挑戰；分級題庫十關、模擬測驗三關，共 97 個練習階段。
- 每頁原本的程式碼、教學與延伸題保留；JavaScript/CSS 以及 JSON 題庫置於 `docs/md/cpp/assets/`。
- 關卡與程式草稿保存在目前瀏覽器 localStorage，不跨裝置同步；選擇、填空可自動比對答案。
- C++ 程式碼**不會在網頁被編譯或判題**；實作關比對使用者貼上的本機執行輸出，不能代表 AC。
- GitHub Actions 透過 `tools/verify_cpp_progression.py` 檢查所有關卡並用 g++ 編譯執行 21 個課程範例。

## 獨立練習及模擬考分類

- `docs/md/cpp/24-漸進式練習.html`：C++ 漸進式練習中心，顯示 21 課進度並連結 10 題分級實作；原有 21 堂課與題庫路徑不變。
- `docs/md/cpp/25-模擬考中心.html`：90 分鐘自編模擬考，三題自由切換、倒數計時、程式草稿 localStorage 儲存、提前或時間到交卷、交卷後自行核對公開範例。
- `docs/md/cpp/23-模擬測驗.md`：保留舊版不計時、逐題解鎖的練習模式。
- 模擬考不執行或批改 C++；不產生虛構分數。計時以 localStorage 的絕對截止時間判定，換裝置不會同步。

## C++ 獨立 HTML 練習與模擬考

和原有 Python 的獨立練習網站一樣，C++ 現在使用 `docs/md/cpp/24-漸進式練習.html` 與 `docs/md/cpp/25-模擬考中心.html` 兩個完整、全頁式的獨立網頁。兩頁直接使用自己 HTML 的 header/sidebar/作答區，**不經 MkDocs Markdown 轉換**。`cpp-standalone.js` 與 `cpp-standalone.css` 提供載入題庫、進度兼容、題目切換、草稿、計時、交卷等功能；程式碼仍須在本機編譯，無網頁 C++ 編譯器。

原有的 `24-漸進式練習.md`、`25-模擬考中心.md` 已由同名 `.html` 取代，因此公開網址保持不變；MkDocs 只負責原檔拷貝與導覽連結。
