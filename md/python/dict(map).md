# Python dict 超級簡單筆記


## 0. 總整理

### 創建
```py
d = { 
    'm': 1,
    'n':4 
}

or

d = {}
```

### 加入
```py
d['z'] = 9                  # 直接建立/修改
d['k'] = d.get('k',0) + 1   # 不確定裡面有沒有
d['a'] = d.get('a',0) + 1
```

### 取值
```py
# 結果不是 list，要自己轉換
print(d.keys())         # dict_keys(['m', 'n', 'z', 'k', 'a'])

print(list(d.items()))  # [('m', 1), ('n', 4), ('z', 9), ('k', 1), ('a', 1)]
print(list(d.keys()))   # ['m', 'n', 'z', 'k', 'a']
print(list(d.values())) # [1, 4, 9, 1, 1]
```

---

## 1. dict 是什麼？

`dict` 是 Python 的「字典」。

它用來存：

```python
key -> value
```

也就是：

```text
名稱 -> 對應資料
```

例如：

```python
score = {
    "Tom": 90,
    "Amy": 85,
    "Bob": 70
}
```

意思是：

```text
Tom 的分數是 90
Amy 的分數是 85
Bob 的分數是 70
```

可以把它想成 C++ 的：

```cpp
map<string, int>
```

---

## 2. 建立 dict

建立空字典：

```python
d = {}
```

建立有資料的字典：

```python
d = {
    "A": 3,
    "B": 5,
    "C": 1
}
```

---

## 3. 讀取 value

```python
d = {
    "A": 3,
    "B": 5
}

print(d["A"])
```

輸出：

```text
3
```

因為 `"A"` 對應到 `3`。

---

## 4. 新增資料

```python
d = {}

d["A"] = 1
d["B"] = 2

print(d)
```

輸出：

```text
{'A': 1, 'B': 2}
```

意思是：

```text
A -> 1
B -> 2
```

---

## 5. 修改資料

```python
d = {
    "A": 1
}

d["A"] = 5

print(d["A"])
```

輸出：

```text
5
```

如果 key 已經存在，重新指定就會修改 value。

---

## 6. 計數常用寫法

假設我們要統計字母出現幾次。

```python
s = "ABCA"
cnt = {}

for ch in s:
    cnt[ch] = cnt.get(ch, 0) + 1

print(cnt)
```

輸出：

```text
{'A': 2, 'B': 1, 'C': 1}
```

這是競程很常用的寫法。

---

## 7. get 是什麼？

```python
cnt.get(ch, 0)
```

意思是：

```text
如果 cnt 裡面有 ch，就回傳 cnt[ch]
如果 cnt 裡面沒有 ch，就回傳 0
```

例如：

```python
cnt = {
    "A": 2
}

print(cnt.get("A", 0))
print(cnt.get("B", 0))
```

輸出：

```text
2
0
```

因為 `"A"` 存在，所以回傳 `2`。

因為 `"B"` 不存在，所以回傳預設值 `0`。

---

## 8. 為什麼計數要用 get？

如果直接寫：

```python
cnt = {}
cnt["A"] += 1
```

會錯。

因為一開始 `cnt["A"]` 不存在。

正確寫法：

```python
cnt = {}

cnt["A"] = cnt.get("A", 0) + 1
```

意思是：

```text
A 原本不存在，所以當作 0
0 + 1 = 1
cnt["A"] = 1
```

---

## 9. 判斷 key 存不存在

```python
d = {
    "A": 3,
    "B": 5
}

if "A" in d:
    print("A exists")
```

輸出：

```text
A exists
```

也可以判斷不存在：

```python
if "C" not in d:
    print("C does not exist")
```

---

## 10. 刪除資料

```python
d = {
    "A": 3,
    "B": 5
}

del d["A"]

print(d)
```

輸出：

```text
{'B': 5}
```

---

## 11. 走訪 dict 的 key

```python
d = {
    "A": 3,
    "B": 5
}

for key in d:
    print(key)
```

輸出：

```text
A
B
```

直接 `for key in d`，會拿到每個 key。

---

## 12. 走訪 key 和 value

```python
d = {
    "A": 3,
    "B": 5
}

for key, value in d.items():
    print(key, value)
```

輸出：

```text
A 3
B 5
```

`items()` 會把 dict 裡面的資料變成一組一組：

```python
("A", 3)
("B", 5)
```

---

## 13. 只拿 key

```python
d.keys()
```

例如：

```python
d = {
    "A": 3,
    "B": 5
}

print(d.keys())
```

可以看成拿到：

```text
A, B
```

---

## 14. 只拿 value

```python
d.values()
```

例如：

```python
d = {
    "A": 3,
    "B": 5
}

print(d.values())
```

可以看成拿到：

```text
3, 5
```

---

## 15. dict 排序

dict 本身通常不是直接排序，而是拿出 `items()` 來排序。

例如：

```python
cnt = {
    "A": 2,
    "B": 5,
    "C": 1
}

ans = sorted(cnt.items())

print(ans)
```

輸出：

```text
[('A', 2), ('B', 5), ('C', 1)]
```

這是按照 key，也就是字母排序。

---

## 16. 按照 value 排序

```python
cnt = {
    "A": 2,
    "B": 5,
    "C": 1
}

ans = sorted(cnt.items(), key=lambda x: x[1])

print(ans)
```

輸出：

```text
[('C', 1), ('A', 2), ('B', 5)]
```

因為：

```python
x = ("A", 2)
x[0] 是 "A"
x[1] 是 2
```

所以：

```python
key=lambda x: x[1]
```

代表按照次數排序。

---

## 17. 按照 value 由大到小排序

```python
cnt = {
    "A": 2,
    "B": 5,
    "C": 1
}

ans = sorted(cnt.items(), key=lambda x: -x[1])

print(ans)
```

輸出：

```text
[('B', 5), ('A', 2), ('C', 1)]
```

因為 Python 預設是小到大，所以加負號 `-x[1]` 可以變成大到小。

---

## 18. UVA 10008 常用排序

題目要：

```text
次數由大到小
次數相同時，字母由小到大
```

可以寫：

```python
ans = sorted(cnt.items(), key=lambda x: (-x[1], x[0]))
```

意思是：

```text
先看 -次數
再看 字母
```

---

## 19. 完整計數範例

```python
s = "Hello World"

cnt = {}

for ch in s.upper():
    if "A" <= ch <= "Z":
        cnt[ch] = cnt.get(ch, 0) + 1

ans = sorted(cnt.items(), key=lambda x: (-x[1], x[0]))

for ch, num in ans:
    print(ch, num)
```

輸出大概會是：

```text
L 3
O 2
D 1
E 1
H 1
R 1
W 1
```

---

## 20. 最重要的三行

如果你現在只想先背最常用的 dict 寫法，背這三個就好：

```python
cnt = {}
```

建立空字典。

```python
cnt[ch] = cnt.get(ch, 0) + 1
```

統計 `ch` 出現次數。

```python
for key, value in cnt.items():
    print(key, value)
```

走訪所有 key 和 value。

---

## 21. dict 和 list 的差別

list 用數字位置找資料：

```python
a = [10, 20, 30]

print(a[0])
```

輸出：

```text
10
```

dict 用 key 找資料：

```python
d = {
    "Tom": 90,
    "Amy": 85
}

print(d["Tom"])
```

輸出：

```text
90
```

可以這樣記：

```text
list：用 index 找資料
dict：用 key 找資料
```

---

## 22. 競程常用情境

dict 很常用在：

```text
統計出現次數
記錄某個東西是否出現過
把名字對應到分數
把字串對應到編號
記錄座標、狀態、資料表
```

例如：

```python
id_map = {}

id_map["Alice"] = 1
id_map["Bob"] = 2

print(id_map["Alice"])
```

輸出：

```text
1
```

---

## 23. 最簡單心法

dict 就是：

```text
key 對應 value
```

例如：

```text
字母 -> 次數
名字 -> 分數
城市 -> 人口
字串 -> 編號
```

在 Python 裡寫成：

```python
d[key] = value
```

讀取時寫成：

```python
d[key]
```
