import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { LevelData } from '../types';

interface ConsoleSimulatorProps {
  level: LevelData;
}

export const ConsoleSimulator: React.FC<ConsoleSimulatorProps> = ({ level }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLogs([]);
    setIsRunning(false);
  }, [level]);

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const runSimulation = () => {
    setIsRunning(true);
    setLogs(['> プログラムを実行中...']);

    // Small delay to simulate processing feel
    setTimeout(() => {
      const newLogs: string[] = [];
      
      if (level.simulationType === 'basic') {
        let count = 0;
        for (let i = 0; i < 100; i++) {
          const kekka = Math.floor(Math.random() * 100); // 0-99
          newLogs.push(String(kekka));
          if (kekka === 0) {
            count++;
          }
        }
        newLogs.push(`当たり回数： ${count}`);
      } 
      else if (level.simulationType === 'list') {
        const kiroku: number[] = [];
        let count = 0;
        for (let i = 0; i < 100; i++) {
          const kekka = Math.floor(Math.random() * 100);
          kiroku.push(kekka);
          if (kekka === 0) {
            count++;
          }
        }
        // Format array output to look somewhat like Python's print(list)
        newLogs.push(`[${kiroku.join(', ')}]`);
        newLogs.push(`当たり回数： ${count}`);
      }
      else if (level.simulationType === 'probability') {
        const kiroku: number[] = [];
        let count = 0;
        for (let i = 0; i < 100; i++) {
          const kekka = Math.floor(Math.random() * 1000); // 0-999
          kiroku.push(kekka);
          if (kekka === 0) {
            count++;
          }
        }
        newLogs.push(`[${kiroku.join(', ')}]`);
        newLogs.push(`当たり回数： ${count}`);
      }
      else if (level.simulationType === 'complex') {
        const kiroku: number[] = [];
        let countsr = 0;
        let countr = 0;
        let countn = 0;
        
        for (let i = 0; i < 100; i++) {
          const kekka = Math.floor(Math.random() * 1000); // 0-999
          kiroku.push(kekka);
          if (kekka === 0) {
            countsr++;
          } else if (kekka <= 99) {
            countr++;
          } else {
            countn++;
          }
        }
        newLogs.push(`[${kiroku.join(', ')}]`);
        newLogs.push(`SR当たり回数： ${countsr}`);
        newLogs.push(`R当たり回数： ${countr}`);
        newLogs.push(`N当たり回数： ${countn}`);
      }

      setLogs(prev => [...prev, ...newLogs, '> 終了']);
      setIsRunning(false);
    }, 500);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm mt-6 overflow-hidden">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <h3 className="font-semibold text-slate-700">実行結果シミュレーター</h3>
        <button
          onClick={runSimulation}
          disabled={isRunning}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? (
            '実行中...'
          ) : (
            <>
              <Play size={16} /> 実行する
            </>
          )}
        </button>
      </div>
      <div className="p-0 bg-slate-950 font-mono text-sm h-64 overflow-y-auto custom-scrollbar">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
            <RotateCcw size={24} />
            <p>「実行する」ボタンを押してシミュレーションを開始</p>
          </div>
        ) : (
          <div className="p-4 flex flex-col gap-1">
            {logs.map((log, index) => (
              <div key={index} className={`${log.startsWith('>') ? 'text-yellow-400' : 'text-slate-300'} break-all`}>
                {log}
              </div>
            ))}
            <div ref={consoleEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};