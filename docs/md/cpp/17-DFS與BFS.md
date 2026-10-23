# 17. 圖的搜尋：DFS 與 BFS

**本課目標：** 理解本節核心觀念、獨立執行範例，並完成隨堂題。建議先完成前一課。

## 1. Core Principle（核心原理）

地圖和社群關係可以表示為 Graph（點與邊）。DFS 先沿一路走深；BFS 像水波向外擴散，適合無權圖最短步數。

## 2. 必要規則與語法

BFS 使用 queue，入列時就標記拜訪與距離，避免重複入列。圖走訪時間約 O(V+E)。

## 3. 可編譯的完整 C++17 範例

```cpp
#include <iostream>
#include <queue>
#include <vector>

int main() {
    int n, m;
    std::cin >> n >> m;
    std::vector<std::vector<int>> adj(n);
    for (int i = 0; i < m; i++) {
        int u, v;
        std::cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }
    std::vector<int> dist(n, -1);
    std::queue<int> q;
    dist[0] = 0;
    q.push(0);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : adj[u]) {
            if (dist[v] != -1) continue;
            dist[v] = dist[u] + 1;
            q.push(v);
        }
    }
    std::cout << dist[n - 1] << "\n";
    return 0;
}
```

## 4. 用手追蹤程式

節點 0—1—2—3 的無向鏈中，從 0 到 3 最少跨越 3 條邊。假設 n≥1、節點編號從 0 開始。

## 5. 驗證：先預測，再執行

輸入 `4 3↵0 1↵1 2↵2 3`，應輸出 3。

## 6. 四關漸進式練習

從觀念識讀開始，一關完成後才會解鎖下一關。程式實作的「輸出相符」僅是公開範例比對，**不是線上編譯，也不代表 AC**。

<div data-cpp-practice="17-DFS與BFS">
  <p>練習載入中……如未顯示，請確認瀏覽器啟用 JavaScript。</p>
</div>

## 7. 原始延伸練習

⭐ 自己畫 5 個點的圖，逐輪記錄 queue 和距離。

??? tip "只在卡住時展開"
    先寫出「輸入 → 變數如何改變 → 預期輸出」，再改寫程式並自行執行。不要只複製解答。

## 8. 常見錯誤

有權重時 BFS 未必得到成本最低路徑；邊數最少不同於總權重最少。

---

[← 上一課](16-常用容器.md) · [學習地圖](00-學習地圖.md) · [下一課 →](18-貪心.md)
