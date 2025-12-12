import React, { useState, useEffect } from 'react';
import { LEVELS } from './data';
import { ConsoleSimulator } from './components/ConsoleSimulator';
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
  Unlock
} from 'lucide-react';

const App: React.FC = () => {
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  
  // Medal System State
  const [medals, setMedals] = useState<number>(5);
  const [secondsUntilNext, setSecondsUntilNext] = useState<number>(120);
  
  // Hint State
  // unlockedHints: ヒントのIDをキーに、解放済みかどうかを管理
  const [unlockedHints, setUnlockedHints] = useState<Record<string, boolean>>({});
  // expandedHints: ヒントのIDをキーに、アコーディオンが開いているかを管理
  const [expandedHints, setExpandedHints] = useState<Record<string, boolean>>({});

  const currentLevel = LEVELS.find(l => l.id === currentLevelId) || LEVELS[0];

  // Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsUntilNext((prev) => {
        if (prev <= 1) {
          setMedals((m) => m + 1);
          return 120; // Reset to 2 minutes
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleLevelChange = (id: number) => {
    setCurrentLevelId(id);
    setIsSidebarOpen(false);
    // ヒントの開閉状態のみリセットし、解放状態(unlockedHints)は保持する
    setExpandedHints({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHintClick = (hintId: string) => {
    const isUnlocked = unlockedHints[hintId];

    if (isUnlocked) {
      // 既に解放済みの場合は開閉のみトグル
      setExpandedHints(prev => ({
        ...prev,
        [hintId]: !prev[hintId]
      }));
    } else {
      // 未解放の場合
      if (medals > 0) {
        const confirmUse = window.confirm(
          `ヒントメダルを1枚消費してヒントを開きますか？\n(残りメダル: ${medals}枚)`
        );
        if (confirmUse) {
          setMedals(prev => prev - 1);
          setUnlockedHints(prev => ({ ...prev, [hintId]: true }));
          setExpandedHints(prev => ({ ...prev, [hintId]: true }));
        }
      } else {
        alert(`ヒントメダルが足りません！\nあと ${formatTime(secondsUntilNext)} で回復します。`);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
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
        {/* Mobile Medal Display */}
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

      {/* Sidebar Navigation */}
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

        {/* Desktop Medal Display */}
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
              <span>Lv.{level.id} {level.simulationType === 'complex' ? 'レアリティ' : '基本'}</span>
              {currentLevelId === level.id && <ChevronRight size={16} />}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
          プログラミング演習教材
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 p-6 md:p-10 overflow-y-auto h-auto min-h-screen">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
              Level {currentLevel.id}
            </div>
            <h2 className="text-3xl font-bold text-slate-900">{currentLevel.title}</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              {currentLevel.description}
            </p>
          </div>

          {/* Goals Section */}
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

          {/* Simulator Section */}
          <ConsoleSimulator level={currentLevel} />

          {/* Hints Section */}
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
                      onClick={() => handleHintClick(hintId)}
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
                          <span>-1</span>
                        </div>
                      )}
                    </button>
                    
                    <div 
                      className={`
                        px-5 overflow-hidden transition-all duration-300 ease-in-out
                        ${isExpanded ? 'max-h-60 pb-4 opacity-100' : 'max-h-0 opacity-0'}
                      `}
                    >
                      <p className="text-sm text-slate-600 leading-relaxed pl-8 border-l-2 border-amber-200 ml-3">
                        {hint.content}
                      </p>
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

export default App;