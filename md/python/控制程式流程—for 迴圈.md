## range 是啥？

Python 的 `range()` 格式是：

```py
range(start, stop, step)
```

其中：

```py
start  # 起始值，會包含
stop   # 結束值，不包含
step   # 每次增加或減少多少
```

如果 `step` 是負數，就可以倒數。

### 一個參數：`range(stop)`

```py
print(list(range(5))) # [0, 1, 2, 3, 4]

# 等同於

print(list(range(0, 5, 1)))
```

### 兩個參數：`range(start, stop)`

```py
print(list(range(2,5))) # [2, 3, 4]

# 等同於

print(list(range(2,5,1)))
```

### 三個參數：`range(start, stop, step)`

```py
print(list(range(1, 10, 2))) # [1, 3, 5, 7, 9]
```

### step 是負數：倒著跑

```py
print(list(range(5, 0, -1))) # [5, 4, 3, 2, 1]
```

### 如果想倒著跑到 0，要這樣寫

```py
print(list(range(5, -1, -1))) # [5, 4, 3, 2, 1, 0]
```

## for 迴圈

```py
for i in range(10):
    print(i, end=" ") # 0 1 2 3 4 5 6 7 8 9
```

> 所以格式是 `for i in <一個可迭代物件>`

可迭代物件除了 `range`、`list`，也可以是字串：

```py
a = "axxple"
x = 0

for i in a:
    if i == "x":
        x += 1

print(x) # 2
```

上面程式碼也可以寫成：

```py
a = "axxple"
print(a.count("x")) # 2
```

## 提早結束迴圈：`break` 與 `continue`

`break`：跳離整個迴圈，接著執行迴圈結束後的下一個指令。

`continue`：略過本回合剩下的程式，直接準備進入下一回合。是否還有下一回合，取決於迭代是否結束。

```py
for i in range(100):
    if input() == "1":
        print("It is 1")
        continue

    print("It is not 1")
    break
```

輸出：

```text
1
It is 1
1
It is 1
1
It is 1
2
It is not 1
```

## for 迴圈如何逐項取值

`for` 迴圈會依序從可迭代物件中取得下一個值，再把這個值指定給迴圈變數。

例如：

```py
a = [10, 20, 30]

for x in a:
    print(x)
```

輸出：

```text
10
20
30
```

對串列進行正向走訪時，可以暫時使用下面的簡化模型理解：

```py
a = [10, 20, 30]

index = 0

while index < len(a):
    x = a[index]
    index += 1

    print(x)
```

可以把流程想成：

```text
index = 0 → 取得 a[0]
index = 1 → 取得 a[1]
index = 2 → 取得 a[2]
index = 3 → 已到串列結尾，迴圈結束
```

這只是方便理解串列走訪的簡化模型。Python 實際上會先建立 Iterator（迭代器），再逐次取得下一個值，因此 `for` 也可以走訪字串、`range` 等其他可迭代物件。

### 走訪時修改串列長度要小心

如果在走訪串列時刪除元素，後面的元素會向左移，但迴圈仍會繼續前進，因此可能跳過某些元素。

```py
a = [1, 2, 2, 2, 3]

for x in a:
    if x == 2:
        a.remove(x)

print(a) # [1, 2, 3]
```

簡單記法：

```text
串列元素被刪除
→ 後面的元素向左移

迴圈的位置仍然向前
→ 可能跳過剛剛向左移的元素
```
