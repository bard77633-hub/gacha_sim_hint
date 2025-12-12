export const LEVELS = [
  {
    id: 1,
    title: "レベル 1: 基本的なガチャ",
    description: "100回ガチャを回して、当たりの回数を数えるプログラムを作りましょう。",
    goals: [
      "for文を使って100回繰り返す",
      "ランダムな数（0〜99）を生成する",
      "0が出たら「当たり」としてカウントする",
      "最後に当たりの回数を表示する"
    ],
    simulationType: 'basic',
    hints: [
      {
        title: "ステップ1: ライブラリの準備",
        content: "乱数（ランダムな数）を使うには、プログラムの１行目に `import random` と書く必要があります。これでPythonの乱数機能が使えるようになります。"
      },
      {
        title: "ステップ2: 数える箱を用意",
        content: "当たりが出た回数を記録するための変数を用意します。ループが始まる前に `count = 0` と書いて、0で初期化しておきましょう。"
      },
      {
        title: "ステップ3: 100回繰り返す",
        content: "`for` 文を使います。 `for i in range(0, 100, 1):` と書くことで、インデント（字下げ）されたブロック内の処理を100回繰り返せます。"
      },
      {
        title: "ステップ4: 乱数を作る",
        content: "0から99までのランダムな整数を作るには `kekka = random.randint(0, 99)` を使います。これをループの中で毎回実行します。"
      },
      {
        title: "ステップ5: 当たり判定",
        content: "もし結果が0なら当たりです。 `if kekka == 0:` という条件文を書きます。比較にはイコール2つ `==` を使う点に注意！"
      },
      {
        title: "ステップ6: カウントする",
        content: "当たりの場合（if文の中）で、回数を1増やします。 `count = count + 1` と書きます。"
      },
      {
        title: "ステップ7: 結果の表示",
        content: "最後に `print('当たり回数：', count)` で結果を表示します。これはループの外（インデントを戻した一番左）に書きましょう。"
      }
    ],
    pythonCode: `import random
kekka = 0
count = 0
for i in range(0,100,1):
  kekka = random.randint(0,99)
  print(kekka)
  if kekka == 0:
    count = count + 1
print('当たり回数：',count)`
  },
  {
    id: 2,
    title: "レベル 2: 結果を記録する",
    description: "ガチャの結果をすべてリスト（配列）に保存してから、最後に一覧表示してみましょう。",
    goals: [
      "空のリストを用意する",
      "ガチャの結果をリストに追加（append）する",
      "最後にリストの中身を表示する"
    ],
    simulationType: 'list',
    hints: [
      {
        title: "ステップ1: リストを作る",
        content: "結果を保存するための「リスト」を使います。ループの前に `kiroku = []` と書いて、空っぽのリストを作っておきます。"
      },
      {
        title: "ステップ2: リストに追加する",
        content: "ガチャの結果が出たら、それをリストに追加します。ループの中で `kiroku.append(kekka)` と書きます。「append（アペンド）」は追加するという意味です。"
      },
      {
        title: "ステップ3: リストを表示する",
        content: "ループが終わった後に `print(kiroku)` を実行すると、 `[34, 0, 99, ...]` のように、保存されたすべての結果が表示されます。"
      }
    ],
    pythonCode: `import random
kiroku = []
count = 0
for i in range(0,100,1):
  kekka = random.randint(0,99)
  kiroku.append(kekka)
  if kekka == 0:
    count = count + 1
print(kiroku)
print('当たり回数：',count)`
  },
  {
    id: 3,
    title: "レベル 3: 確率を変える",
    description: "当たりの確率をもっと低くしてみましょう。0〜999の範囲で抽選を行い、確率を1/1000にします。",
    goals: [
      "乱数の範囲を0〜999に変更する",
      "それ以外はレベル2と同じ仕組み"
    ],
    simulationType: 'probability',
    hints: [
      {
        title: "確率の仕組み",
        content: "0〜99は100通りの数字があるので、当たり（0）の確率は1/100 (1%)です。確率を1/1000 (0.1%)にするには、くじの数を1000個に増やします。"
      },
      {
        title: "コードの変更点",
        content: "`random.randint(0, 99)` の部分を `random.randint(0, 999)` に変更します。0〜999は全部で1000個の数字を含みます。"
      },
      {
        title: "判定はそのまま",
        content: "乱数の範囲を変えるだけで、当たりの条件（`if kekka == 0:`）やリストへの追加処理は変える必要はありません。"
      }
    ],
    pythonCode: `import random
kiroku = []
count = 0
for i in range(0,100,1):
  kekka = random.randint(0,999)
  kiroku.append(kekka)
  if kekka == 0:
    count = count + 1
print(kiroku)
print('当たり回数：',count)`
  },
  {
    id: 4,
    title: "レベル 4: 複数のレアリティ",
    description: "SR、R、Nの3つのレアリティを作り分けましょう。それぞれの回数をカウントします。",
    goals: [
      "SR: 0 (確率 1/1000)",
      "R: 1〜99 (確率 99/1000)",
      "N: 100〜999 (残り全部)",
      "elif や else を使って条件分岐する"
    ],
    simulationType: 'complex',
    hints: [
      {
        title: "ステップ1: 複数のカウンター",
        content: "SR、R、Nそれぞれの回数を数えたいので、箱も3つ必要です。ループの前に `countsr = 0`, `countr = 0`, `countn = 0` を用意しましょう。"
      },
      {
        title: "ステップ2: 条件分岐の構造",
        content: "3つのパターンに分けるには、 `if ... elif ... else` 構文を使います。「もし〜なら」「そうでなくて、もし〜なら」「どっちでもないなら」という流れです。"
      },
      {
        title: "ステップ3: Rの条件の書き方",
        content: "SR（0の時）は最初の `if` で判定します。次の `elif` でRを判定しますが、条件は `kekka <= 99` だけでOKです。ここに来る時点で0ではないことは確定しているからです。"
      },
      {
        title: "ステップ4: Nの条件",
        content: "SR（0）でもR（99以下）でもない場合は、すべてN（ハズレ）です。 `else:` を使い、条件式は書かずに `countn` を増やします。"
      },
      {
        title: "ステップ5: 結果表示",
        content: "最後に3つの変数をそれぞれ `print` して完了です。"
      }
    ],
    pythonCode: `import random
kiroku = []
countsr = 0
countr = 0
countn = 0  
for i in range(0,100,1):
  kekka = random.randint(0,999)
  kiroku.append(kekka)
  if kekka == 0:
    countsr = countsr + 1
  elif kekka <= 99:
    countr = countr + 1
  else:
    countn = countn + 1
print(kiroku)
print('SR当たり回数：',countsr)
print('R当たり回数：',countr)
print('N当たり回数：',countn)`
  }
];
