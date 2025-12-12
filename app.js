import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Lightbulb, 
  ChevronDown, 
  ChevronRight,
  Code2, 
  CheckCircle2, 
  Menu,
  X,
  Medal,
  Timer,
  Lock,
  Unlock,
  Play,
  RotateCcw
} from 'lucide-react';

// --- Data Definition (Integrated to avoid import errors) ---
const LEVELS = [
  {
    id: 1,
    title: "レベル 1: 基本的なガチャ",
    shortLabel: "基本",
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
        content: "乱数（ランダムな数）を使うには、プログラムの１行目に `import random` と書く必要があります。これでPythonの乱数機能が使えるようになります。",
        cost: 1
      },
      {
        title: "ステップ2: 数える箱を用意",
        content: "当たりが出た回数を記録するための変数を用意します。ループが始まる前に `count = 0` と書いて、0で初期化しておきましょう。",
        cost: 1
      },
      {
        title: "ステップ3: 100回繰り返す",
        content: "`for` 文を使います。 `for i in range(0, 100, 1):` と書くことで、インデント（字下げ）されたブロック内の処理を100回繰り返せます。",
        cost: 1
      },
      {
        title: "ステップ4: 乱数を作る",
        content: "0から99までのランダムな整数を作るには `kekka = random.randint(0, 99)` を使います。これをループの中で毎回実行します。",
        cost: 1
      },
      {
        title: "ステップ5: 当たり判定",
        content: "もし結果が0なら当たりです。 `if kekka == 0:` という条件文を書きます。比較にはイコール2つ `==` を使う点に注意！",
        cost: 1
      },
      {
        title: "ステップ6: カウントする",
        content: "当たりの場合（if文の中）で、回数を1増やします。 `count = count + 1` と書きます。",
        cost: 1
      },
      {
        title: "ステップ7: 結果の表示",
        content: "最後に `print('当たり回数：', count)` で結果を表示します。これはループの外（インデントを戻した一番左）に書きましょう。",
        cost: 1
      },
      {
        title: "スペシャルヒント: 答えのコード",
        content: "どうしても分からない場合は、以下のコードを参考にしてください。\n\n```python\nimport random\nkekka = 0\ncount = 0\n# 100回繰り返す\nfor i in range(0, 100, 1):\n  # 0〜99の乱数を作る\n  kekka = random.randint(0, 99)\n  print(kekka)\n  # 0なら当たり\n  if kekka == 0:\n    count = count + 1\n\nprint('当たり回数：', count)\n```",
        cost: 3
      }
    ]
  },
  {
    id: 2,
    title: "レベル 2: 結果を記録する",
    shortLabel: "リスト",
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
        content: "結果を保存するための「リスト」を使います。ループの前に `kiroku = []` と書いて、空っぽのリストを作っておきます。",
        cost: 1
      },
      {
        title: "ステップ2: リストに追加する",
        content: "ガチャの結果が出たら、それをリストに追加します。ループの中で `kiroku.append(kekka)` と書きます。「append（アペンド）」は追加するという意味です。",
        cost: 1
      },
      {
        title: "ステップ3: リストを表示する",
        content: "ループが終わった後に `print(kiroku)` を実行すると、 `[34, 0, 99, ...]` のように、保存されたすべての結果が表示されます。",
        cost: 1
      }
    ]
  },
  {
    id: 3,
    title: "レベル 3: 確率を変える",
    shortLabel: "0.1%",
    description: "当たりの確率をもっと低くしてみましょう。0〜999の範囲で抽選を行い、確率を1/1000にします。",
    goals: [
      "乱数の範囲を0〜999に変更する",
      "それ以外はレベル2と同じ仕組み"
    ],
    simulationType: 'probability',
    hints: [
      {
        title: "確率の仕組み",
        content: "0〜99は100通りの数字があるので、当たり（0）の確率は1/100 (1%)です。確率を1/1000 (0.1%)にするには、くじの数を1000個に増やします。",
        cost: 1
      },
      {
        title: "コードの変更点",
        content: "`random.randint(0, 99)` の部分を `random.randint(0, 999)` に変更します。0〜999は全部で1000個の数字を含みます。",
        cost: 1
      },
      {
        title: "判定はそのまま",
        content: "乱数の範囲を変えるだけで、当たりの条件（`if kekka == 0:`）やリストへの追加処理は変える必要はありません。",
        cost: 1
      }
    ]
  },
  {
    id: 4,
    title: "レベル 4: 複数のレアリティ",
    shortLabel: "レアリティ",
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
        content: "SR、R、Nそれぞれの回数を数えたいので、箱も3つ必要です。ループの前に `countsr = 0`, `countr = 0`, `countn = 0` を用意しましょう。",
        cost: 1
      },
      {
        title: "ステップ2: 条件分岐の構造",
        content: "3つのパターンに分けるには、 `if ... elif ... else` 構文を使います。「もし〜なら」「そうでなくて、もし〜なら」「どっちでもないなら」という流れです。",
        cost: 1
      },
      {
        title: "ステップ3: Rの条件の書き方",
        content: "SR（0の時）は最初の `if` で判定します。次の `elif` でRを判定しますが、条件は `kekka <= 99` だけでOKです。ここに来る時点で0ではないことは確定しているからです。",
        cost: 1
      },
      {
        title: "ステップ4: Nの条件",
        content: "SR（0）でもR（99以下）でもない場合は、すべてN（ハズレ）です。 `else:` を使い、条件式は書かずに `countn` を増やします。",
        cost: 1
      },
      {
        title: "ステップ5: 結果表示",
        content: "最後に3つの変数をそれぞれ `print` して完了です。",
        cost: 1
      }
    ]
  }
];

// --- Components ---

const ConsoleSimulator = ({ level }) => {
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const consoleEndRef = useRef(null);

  const addLog = (text, isSystem = false) => {
    setLogs(prev => [...prev, { text, isSystem, id: Date.now() + Math.random() }]);
  };

  const scrollToBottom = () => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  // レベルが変わったらログをクリア
  useEffect(() => {
    setLogs([]);
    setIsRunning(false);
  }, [level.id]);

  const runSimulation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogs([]);
    addLog('> プログラムを実行中...', true);

    // 非同期処理風に見せるための遅延
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      if (level.simulationType === 'basic') {
        let count = 0;
        for (let i = 0; i < 100; i++) {
          const kekka = Math.floor(Math.random() * 100);
          addLog(String(kekka));
          if (kekka === 0) count++;
          // 少しずつ表示するための遅延（処理落ちしない程度に）
          if (i % 20 === 0) await new Promise(r => setTimeout(r, 10));
        }
        addLog(`当たり回数： ${count}`);
      } 
      else if (level.simulationType === 'list') {
        const kiroku = [];
        let count = 0;
        for (let i = 0; i < 100; i++) {
          const kekka = Math.floor(Math.random() * 100);
          kiroku.push(kekka);
          if (kekka === 0) count++;
        }
        // リスト表示は見やすく整形
        addLog(`[${kiroku.join(', ')}]`);
        addLog(`当たり回数： ${count}`);
      }
      else if (level.simulationType === 'probability') {
        const kiroku = [];
        let count = 0;
        for (let i = 0; i < 100; i++) {
          const kekka = Math.floor(Math.random() * 1000);
          kiroku.push(kekka);
          if (kekka === 0) count++;
        }
        addLog(`[${kiroku.join(', ')}]`);
        addLog(`当たり回数： ${count}`);
      }
      else if (level.simulationType === 'complex') {
        const kiroku = [];
        let countsr = 0, countr = 0, countn = 0;
        for (let i = 0; i < 100; i++) {
          const kekka = Math.floor(Math.random() * 1000);
          kiroku.push(kekka);
          if (kekka === 0) countsr++;
          else if (kekka <= 99) countr++;
          else countn++;
        }
        addLog(`[${kiroku.join(', ')}]`);
        addLog(`SR当たり回数： ${countsr}`);
        addLog(`R当たり回数： ${countr}`);
        addLog(`N当たり回数： ${countn}`);
      }
      
      addLog('> 終了', true);
    } catch (e) {
      addLog(`Error: ${e.message}`, true);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm mt-6 overflow-hidden flex flex-col">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <h3 className="font-semibold text-slate-700">実行結果シミュレーター</h3>
        <button 
          onClick={runSimulation}
          disabled={isRunning}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? '実行中...' : <><Play size={16} /> 実行する</>}
        </button>
      </div>
      <div className="p-0 bg-slate-950 font-mono text-sm h-64 overflow-y-auto custom-scrollbar relative">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
            <RotateCcw size={24} />
            <p>「実行する」ボタンを押してシミュレーションを開始</p>
          </div>
        ) : (
          <div className="p-4 flex flex-col gap-1">
            {logs.map((log) => (
              <div key={log.id} className={`break-all ${log.isSystem ? 'text-yellow-400' : 'text-slate-300'}`}>
                {log.text}
              </div>
            ))}
            <div ref={consoleEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [medals, setMedals] = useState(3); // Changed from 5 to 3
  const [secondsUntilNext, setSecondsUntilNext] = useState(120);
  const [unlockedHints, setUnlockedHints] = useState({});
  const [expandedHints, setExpandedHints] = useState({});

  const currentLevel = LEVELS.find(l => l.id === currentLevelId) || LEVELS[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsUntilNext((prev) => {
        if (prev <= 1) {
          setMedals((m) => m + 1);
          return 120;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleLevelChange = (id) => {
    setCurrentLevelId(id);
    setIsSidebarOpen(false);
    setExpandedHints({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHintClick = (hintId, cost = 1) => {
    const isUnlocked = unlockedHints[hintId];

    if (isUnlocked) {
      setExpandedHints(prev => ({ ...prev, [hintId]: !prev[hintId] }));
    } else {
      if (medals >= cost) {
        const confirmUse = window.confirm(
          `ヒントメダルを${cost}枚消費してヒントを開きますか？\n(残りメダル: ${medals}枚)`
        );
        if (confirmUse) {
          setMedals(prev => prev - cost);
          setUnlockedHints(prev => ({ ...prev, [hintId]: true }));
          setExpandedHints(prev => ({ ...prev, [hintId]: true }));
        }
      } else {
        alert(`ヒントメダルが足りません！\nあと ${formatTime(secondsUntilNext)} で回復します。`);
      }
    }
  };

  const formatMarkdown = (text) => {
    // 簡易的なMarkdownフォーマッタ
    const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const code = part.replace(/```(python)?\n?/, '').replace(/```$/, '');
        return (
          <div key={index} className="my-2 bg-slate-800 text-slate-100 p-3 rounded-md font-mono text-xs overflow-x-auto whitespace-pre">
            {code}
          </div>
        );
      } else if (part.startsWith('`')) {
        return (
          <code key={index} className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono text-xs">
            {part.slice(1, -1)}
          </code>
        );
      }
      return <span key={index} className="whitespace-pre-wrap">{part}</span>;
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans text-slate-900">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-bold text-slate-800 flex items-center gap-2">
            <Code2 className="text-blue-600" />
            ガチャ演習
          </h1>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-md"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <div className="flex items-center justify-between bg-slate-100 rounded-lg p-2 text-sm">
          <div className="flex items-center gap-2 text-amber-600 font-bold">
            <Medal size={18} />
            <span>× {medals}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Timer size={16} />
            <span>回復まで {formatTime(secondsUntilNext)}</span>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-slate-100 z-30 transition-transform duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          md:h-screen md:top-0
        `}
      >
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Code2 className="text-blue-400" />
            ガチャ演習
          </h1>
          <p className="text-xs text-slate-400 mt-2">Pythonプログラミング</p>
        </div>

        <div className="p-4 bg-slate-800 border-b border-slate-700">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-amber-400 font-bold">
              <div className="flex items-center gap-2">
                <Medal size={20} />
                <span>ヒントメダル</span>
              </div>
              <span className="text-xl">{medals}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/50 p-2 rounded">
              <span className="flex items-center gap-1">
                <Timer size={12} /> 次のメダル
              </span>
              <span className="font-mono">{formatTime(secondsUntilNext)}</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => handleLevelChange(level.id)}
              className={`
                w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group
                ${currentLevelId === level.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <span>Lv.{level.id} {level.shortLabel}</span>
              {currentLevelId === level.id && <ChevronRight size={16} />}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
          プログラミング演習教材
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 p-6 md:p-10 overflow-y-auto h-auto min-h-screen">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
              Level {currentLevel.id}
            </div>
            <h2 className="text-3xl font-bold text-slate-900">{currentLevel.title}</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              {currentLevel.description}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-emerald-500" size={20} />
              達成目標
            </h3>
            <ul className="space-y-3">
              {currentLevel.goals.map((goal, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-600">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-300 mt-2.5" />
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          <ConsoleSimulator level={currentLevel} />

          <div className="space-y-4 pb-12">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Lightbulb className="text-amber-500" size={20} />
              ヒント（メダルを使って解放）
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {currentLevel.hints.map((hint, idx) => {
                const hintId = `l${currentLevel.id}-h${idx}`;
                const isUnlocked = unlockedHints[hintId];
                const isExpanded = expandedHints[hintId];
                const cost = hint.cost || 1;
                
                return (
                  <div 
                    key={idx} 
                    className={`
                      border rounded-lg transition-all duration-300 overflow-hidden relative
                      ${isExpanded ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}
                      ${!isUnlocked && 'hover:border-blue-300'}
                    `}
                  >
                    <button
                      onClick={() => handleHintClick(hintId, cost)}
                      className="w-full text-left px-5 py-4 flex items-center justify-between font-medium text-slate-700"
                    >
                      <span className="flex items-center gap-2">
                        {isUnlocked ? (
                          <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                            <Unlock size={14} />
                          </span>
                        ) : (
                          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                            <Lock size={14} />
                          </span>
                        )}
                        <span className={!isUnlocked ? 'text-slate-500' : 'text-slate-800'}>
                          {hint.title}
                        </span>
                      </span>
                      
                      {isUnlocked ? (
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-amber-500' : 'text-slate-400'}`} 
                        />
                      ) : (
                        <div className="flex items-center gap-1 text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-600">
                          <Medal size={12} className="text-amber-500" />
                          <span>-{cost}</span>
                        </div>
                      )}
                    </button>
                    
                    <div 
                      className={`
                        px-5 overflow-hidden transition-all duration-300 ease-in-out
                        ${isExpanded ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'}
                      `}
                    >
                      <div className="text-sm text-slate-600 leading-relaxed pl-8 border-l-2 border-amber-200 ml-3">
                        {formatMarkdown(hint.content)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);