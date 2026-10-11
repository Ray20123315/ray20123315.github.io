# 變數



## 變數引用

在C++中，我們可能會寫下種程式碼：

```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
    vector<int>a={1,2,3,4,5,6};
    vector<int>b;
    b=a;
    b[0]=0;
    cout<<"a:";
    for(int i:a){
        cout<<i;
    }
    cout<<"\nb:";
    for(int i:b){
        cout<<i;
    }
}
```
/// html | div.result
```
a:123456
b:023456
```
///

這段程式碼先宣告陣列a，然後將a複製到b，之後修改b。
輸出的結果跟想像的一樣，兩個陣列的內容相同。

但如果換成python呢?我們試試以下程式碼：



```python
a=[1,2,3,4,5,6]
b=a

b[0]=0

print(a)
print(b)
```
/// html | div.result
```
a: [0, 2, 3, 4, 5, 6]
b: [0, 2, 3, 4, 5, 6]
```
///

這時結果就和我們想像的不一樣，在更改b時，a也被改到了。
這是執行指令`b=a`，意思是「將a新增別名b」，這時a和b同時指向同一個物件。




當資料型態為

- 列表 (list)
- 字典 (dict)
- 集合 (set)

時，複製變數就是在新增別名，如下：

=== "列表 (list)"
    ```python
    a=[1,2,3,4,5,6]
    b=a

    b[0]=0

    print(a)
    print(b)
    ```
    /// html | div.result
    ```
    a: [0, 2, 3, 4, 5, 6]
    b: [0, 2, 3, 4, 5, 6]
    ```
    ///
=== "字典 (dict)"
    ```python
    a={'x': 1, 'y': 2}
    b=a
    b['x']=0

    print('a:',a)
    print('b:',b)
    ```
    /// html | div.result
    ```
    a: {'x': 0, 'y': 2}
    b: {'x': 0, 'y': 2}
    ```
    ///
=== "集合 (set)"
    ```python
    a=[1,2,3,4,5,6]
    b=a

    b[0]=0

    print(a)
    print(b)
    ```
    /// html | div.result
    ```
    a: {1, 2, 3, 4}
    b: {1, 2, 3, 4}
    ```
    ///


現在我們有一個結論：
>執行b=a時，若a是陣列，就會指向同一個陣列

那我們看看下面的程式碼：


```python
a = [1,2]
b = a
a[0]=0
print("a:",a)
print("b:",b)
a = [3,4]
print("a:",a)    
print("b:",b)  
```
/// html |  div.result
```python
a: [0, 2]
b: [0, 2]  //受影響
a: [3, 4]
b: [0, 2]  //不受影響
```
///

這段程式碼說明了如果變數重新賦值，就會指向不同內容。
可以看到以下影片，模擬程式碼運作。

<iframe width="1236" height="500" src="https://www.youtube.com/embed/iv4ZGNRpRo8" title="python變數" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

基於相同概念，其實所有變數都是相同原理：執行`b=a`時，b與a會指向相同物件

```python
a = 0
b = a
print(id(a))  # 顯示 a 的記憶體地址
print(id(b))  # 顯示 b 的記憶體地址
```
/// html |  div.result
```python
2517631631568
2517631631568
```
///

要解決複製的問題，使用`.copy()`


```python
a = [1,2]
b = a
c = a.copy()
a[0]=0
print("a:",a)
print("b:",b)
print("c:",c)
```
/// html |  div.result
```python
a: [0, 2]
b: [0, 2]   //受影響
c: [1, 2]   //不受影響
```
///

## 交換變數名稱 

在C++中若不使用函數，要交換變數會需要以下程式碼：


```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
    int a=1,b=2;
    int tmp;
    
    cout<<"a: "<<a<<"\n";
    cout<<"b: "<<b<<"\n";

    //交換
    tmp=a;
    a=b;
    b=tmp;

    cout<<"a: "<<a<<"\n";
    cout<<"b: "<<b;
}
```
/// html |  div.result
```cpp
a: 1
b: 2
a: 2       
b: 1
```
///

但是在python可以簡化：

```py
a = 1
b = 2
print("a:",a) 
print("b:",b) 

#交換
a, b = b, a

print("-----")
print("a:",a) 
print("b:",b)
```
/// html |  div.result
```py
a: 1
b: 2       
-----      
a: 2       
b: 1   
```
///

也可以多個同時交換：


```py
a = 1
b = 2
c = 3
print("a:",a) 
print("b:",b) 
print("c:",c) 

#交換
a, b, c = b, c, a

print("-----")
print("a:",a) 
print("b:",b) 
print("c:",c)
```
/// html |  div.result
```py
a: 1
b: 2       
c: 3       
-----      
a: 2       
b: 3       
c: 1
```
///
