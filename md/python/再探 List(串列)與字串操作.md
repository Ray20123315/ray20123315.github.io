# List

## 簡單介紹 list

```py
a = [1, 5, 4, 3, 7, 2, 4, 1]

print(a) # python 井字號之後該行是註解，註解是給人看的，編譯器不看
print(*a) # 這個先記一下，相當是 C 語言的指標
print(*a, sep=',') # 分隔符號可以更改

```

## 複製

> 注意！假設 a、b 是 list， b = a 是製作別名，不是複製。
> 要複製要用：
```py 
b = a.copy() # a.copy() 回傳 a 的內容
b = a[:]     # 功能和上面一樣
```

但是當我 a 重新指向新的東西時，並不會改掉 b，如下。

```py
a = [1, 2, 3]
b = a

# a ─┐
#    ├──> [1, 2, 3]
# b ─┘


a[0] = 4

# a ─┐
#    ├──> [4, 2, 3]
# b ─┘

print(a, b)
# [4, 2, 3] [4, 2, 3]


a = [1]

# a ───> [1]
#
# b ───> [4, 2, 3]

print(a, b)
# [1] [4, 2, 3]
```



## 序列運算只有 + 、 *

- \+ 串接 (Concatenation)
- \* 重複 (Repetition)

```py
a = [1,3,4]+[4,6,7,8]   # [1,3,4,4,6,7,8]
b = [0,2]*3             # [0,2,0,2,0,2]
b *= 2                  # [0,2,0,2,0,2,0,2,0,2,0,2]
print(a)
print(b)

```


## list 常用函數

### 運算

最大、最小、總和
```py
a = [5, 3, 4]
large = max(a)
small = min(a)
middle = sum(a) – large - small

```

排序
```py
a = [3, 1, 5, 7, 3, 4, 2, 5]
a.sort()
print(a) # [1,2,3,3,4,5,5,7]

```

如果要由大而小排序呢？可以這樣下指令
```py
a.sort(reverse=True) 
```



### 操作

.append(n) 插入 value n
.pop(index) 把位置 index 的數字刪掉
.index(n) 第一個 value n 的 index

```py
a = [6, 7, 8, 7]

a.append(9)         
print(a)            # [6, 7, 8, 7, 9]

a.pop(-2)           
print(a)            # [6, 7, 8, 9]
        
print(a.index(7))   # 1
```

> -2 可以想成往前會循環到尾巴，所以 -2 是倒數第二個。


## 切片

list slicing 是指將 list 切出其中連續的一段，留意幾件事：

- 編號由 0 開始。
- 區間定義都是左閉右開(不含右端)。
- 負的編號是倒數，最後一個是-1。
- 第一個編號不寫代表開頭，第二個編號不寫表示一直到結尾都包含。


```py
a = [0, 1, 2, 3, 4, 5]
b = a[1:3]
c = a[-3:-1]
d = a[:-2]
e = a[-4:]

print(a, b, c, d, e, sep="\n")

```
output:
```
[0, 1, 2, 3, 4, 5]
[1, 2]
[3, 4]
[0, 1, 2, 3]
[2, 3, 4, 5]
```


也可以對內容賦值， ==甚至改變 list 的大小== 。

```py
a = [0, 1, 2, 3, 4, 5]
a[1:2] = [2,1]

print(a) # [0, 2, 1, 2, 3, 4, 5]
```


三個冒號的切片

```py
a = [0,1,2,3,4,5]
a[ :4:2]            # [0,2]
a[ : :3]            # [0,3]
a[::-1]             # [5,4,3,2,1,0] 這個很好用
a[ 2: :-1]          # [2,1,0] 從 2 開始反向走到頭
```

list comprehension，以說明 List 內容的方式建構一個 list。相當於把 for 迴
圈內含在 list 建構中，可以雙迴圈，甚至可以加 if 條件式來過濾成員。

```py
# [<要放進 list 的值> for <變數> in <範圍>]
a = [i**2 for i in range(6)]  
print(a)  # [0, 1, 4, 9, 16, 25]

# [<要放進 list 的值> for x in A for y in B if 條件]
b = [(x, y) for x in [1, 2, 3] for y in [3, 1, 4] if x != y]  
print(b)  # [(1, 3), (1, 4), (2, 3), (2, 1), (2, 4), (3, 1), (3, 4)]

```


字串：與 list 操作類似，相加是串接，乘整數是重複。

```py
a = 'This is a Book.'
b = a + ' ' + 'I love Python.'
s = 'abc' * 3 # abcabcabc
s *= 2
for c in b[3: 8]: print(c)
d = '' # empty string
for x in b:
 if x>='A' and x<='Z': d += x # b 中大寫字母擷取出來的字串
e = [ x for x in b if x>='a' and x<='z'] # list consisting char
```


字串與 list 一樣可以做 slice，但字串內容不可更改。

```py
a = 'This is a Book.'
a[1] # h
a[1:6] # 'his i'
a[1] = 'x' # error
b = a[:4]+'PY'+a[6:]
c = a[::-1] # 反轉字串，記一下這用法
```

字串與 list 都可以用 in 檢查是否為元素的判斷式，但如果字串與串列很長時，可能
花費很多時間。注意字串可以檢查字元也可以檢查 ==子字串== 。

這樣找的時間複雜度是 O(n)

```py
a = [5, 4, 1, 7, 8]
if 3 in a: print('3 is in a')
else: print('3 is not in a')
4 in a # True
[5,4] in a # False
s = 'This is a book'
'T' in s # True
'b' in s # True
'S' in s # False
'is' in s # True
'The' in s # False
```
