import { LEVELS } from './data.js';

// State
let state = {
  currentLevelId: 1,
  isSidebarOpen: false,
  medals: 5,
  secondsUntilNext: 120,
  unlockedHints: {}, // { "l1-h0": true, ... }
  expandedHints: {}, // { "l1-h0": true, ... }
  isRunning: false
};

// DOM Elements
const elements = {
  sidebar: document.getElementById('sidebar'),
  sidebarOverlay: document.getElementById('sidebar-overlay'),
  mobileMenuBtn: document.getElementById('mobile-menu-btn'),
  sidebarCloseBtn: document.getElementById('sidebar-close-btn'),
  
  mobileMedalCount: document.getElementById('mobile-medal-count'),
  mobileTimerDisplay: document.getElementById('mobile-timer-display'),
  desktopMedalCount: document.getElementById('desktop-medal-count'),
  desktopTimerDisplay: document.getElementById('desktop-timer-display'),
  
  levelList: document.getElementById('level-list'),
  
  levelBadge: document.getElementById('level-badge'),
  levelTitle: document.getElementById('level-title'),
  levelDescription: document.getElementById('level-description'),
  goalList: document.getElementById('goal-list'),
  
  hintList: document.getElementById('hint-list'),
  
  runSimulationBtn: document.getElementById('run-simulation-btn'),
  consoleOutput: document.getElementById('console-output'),
  consolePlaceholder: document.getElementById('console-placeholder'),
  consoleLogs: document.getElementById('console-logs'),
};

// Constants
const MEDAL_RECOVERY_TIME = 120; // seconds

// Initialize
function init() {
  renderSidebar();
  renderLevelContent();
  startTimer();
  setupEventListeners();
  // Initial Lucide render
  lucide.createIcons();
}

// Timer Logic
function startTimer() {
  setInterval(() => {
    if (state.secondsUntilNext <= 1) {
      state.medals += 1;
      state.secondsUntilNext = MEDAL_RECOVERY_TIME;
      updateMedalDisplay();
    } else {
      state.secondsUntilNext -= 1;
      updateTimerDisplay();
    }
  }, 1000);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// UI Updates
function updateMedalDisplay() {
  elements.mobileMedalCount.textContent = state.medals;
  elements.desktopMedalCount.textContent = state.medals;
}

function updateTimerDisplay() {
  const timeStr = formatTime(state.secondsUntilNext);
  elements.mobileTimerDisplay.textContent = timeStr;
  elements.desktopTimerDisplay.textContent = timeStr;
}

function renderSidebar() {
  elements.levelList.innerHTML = '';
  LEVELS.forEach(level => {
    const btn = document.createElement('button');
    const isCurrent = state.currentLevelId === level.id;
    
    btn.className = `
      w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group
      ${isCurrent 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
    `;
    
    btn.innerHTML = `
      <span>Lv.${level.id} ${level.simulationType === 'complex' ? 'レアリティ' : '基本'}</span>
      ${isCurrent ? '<i data-lucide="chevron-right" class="w-4 h-4"></i>' : ''}
    `;
    
    btn.onclick = () => handleLevelChange(level.id);
    elements.levelList.appendChild(btn);
  });
  lucide.createIcons();
}

function renderLevelContent() {
  const currentLevel = LEVELS.find(l => l.id === state.currentLevelId) || LEVELS[0];
  
  // Update Header
  elements.levelBadge.textContent = currentLevel.id;
  elements.levelTitle.textContent = currentLevel.title;
  elements.levelDescription.textContent = currentLevel.description;
  
  // Update Goals
  elements.goalList.innerHTML = '';
  currentLevel.goals.forEach(goal => {
    const li = document.createElement('li');
    li.className = "flex items-start gap-3 text-slate-600";
    li.innerHTML = `
      <span class="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-300 mt-2.5"></span>
      <span>${goal}</span>
    `;
    elements.goalList.appendChild(li);
  });
  
  // Clear Console
  clearConsole();
  
  // Render Hints
  renderHints(currentLevel);
}

function renderHints(level) {
  elements.hintList.innerHTML = '';
  
  level.hints.forEach((hint, idx) => {
    const hintId = `l${level.id}-h${idx}`;
    const isUnlocked = state.unlockedHints[hintId];
    const isExpanded = state.expandedHints[hintId];
    
    const container = document.createElement('div');
    container.className = `
      border rounded-lg transition-all duration-300 overflow-hidden relative
      ${isExpanded ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}
      ${!isUnlocked ? 'hover:border-blue-300' : ''}
    `;
    
    const headerBtn = document.createElement('button');
    headerBtn.className = "w-full text-left px-5 py-4 flex items-center justify-between font-medium text-slate-700";
    headerBtn.onclick = () => handleHintClick(hintId);
    
    const iconClass = isUnlocked 
      ? "w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center"
      : "w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center";
      
    const iconName = isUnlocked ? "unlock" : "lock";
    
    const rightSide = isUnlocked
      ? `<i data-lucide="chevron-down" class="w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-amber-500' : 'text-slate-400'}"></i>`
      : `<div class="flex items-center gap-1 text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-600">
           <i data-lucide="medal" class="w-3 h-3 text-amber-500"></i>
           <span>-1</span>
         </div>`;

    headerBtn.innerHTML = `
      <span class="flex items-center gap-2">
        <span class="${iconClass}">
          <i data-lucide="${iconName}" class="w-3.5 h-3.5"></i>
        </span>
        <span class="${!isUnlocked ? 'text-slate-500' : 'text-slate-800'}">
          ${hint.title}
        </span>
      </span>
      ${rightSide}
    `;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = `
      accordion-content px-5 overflow-hidden
      ${isExpanded ? 'max-h-60 pb-4 opacity-100' : 'max-h-0 opacity-0'}
    `;
    contentDiv.innerHTML = `
      <p class="text-sm text-slate-600 leading-relaxed pl-8 border-l-2 border-amber-200 ml-3">
        ${formatMarkdown(hint.content)}
      </p>
    `;
    
    container.appendChild(headerBtn);
    container.appendChild(contentDiv);
    elements.hintList.appendChild(container);
  });
  
  lucide.createIcons();
}

// Simple markdown formatter for hints (handling code ticks)
function formatMarkdown(text) {
  return text.replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono text-xs">$1</code>');
}

// Actions
function handleLevelChange(id) {
  state.currentLevelId = id;
  // レベル変更時はヒントの開閉状態のみリセット、解放状態は維持
  state.expandedHints = {};
  
  closeSidebar();
  renderSidebar(); // Update active state
  renderLevelContent();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleHintClick(hintId) {
  if (state.unlockedHints[hintId]) {
    // Toggle expand
    state.expandedHints[hintId] = !state.expandedHints[hintId];
  } else {
    // Try unlock
    if (state.medals > 0) {
      if (confirm(`ヒントメダルを1枚消費してヒントを開きますか？\n(残りメダル: ${state.medals}枚)`)) {
        state.medals--;
        state.unlockedHints[hintId] = true;
        state.expandedHints[hintId] = true;
        updateMedalDisplay();
      }
    } else {
      alert(`ヒントメダルが足りません！\nあと ${formatTime(state.secondsUntilNext)} で回復します。`);
    }
  }
  const currentLevel = LEVELS.find(l => l.id === state.currentLevelId);
  renderHints(currentLevel);
}

function toggleSidebar() {
  state.isSidebarOpen = !state.isSidebarOpen;
  if (state.isSidebarOpen) {
    elements.sidebar.classList.remove('-translate-x-full');
    elements.sidebarOverlay.classList.remove('hidden');
  } else {
    elements.sidebar.classList.add('-translate-x-full');
    elements.sidebarOverlay.classList.add('hidden');
  }
}

function closeSidebar() {
  state.isSidebarOpen = false;
  elements.sidebar.classList.add('-translate-x-full');
  elements.sidebarOverlay.classList.add('hidden');
}

// Simulator Logic
function clearConsole() {
  elements.consolePlaceholder.classList.remove('hidden');
  elements.consoleLogs.classList.add('hidden');
  elements.consoleLogs.innerHTML = '';
}

function runSimulation() {
  if (state.isRunning) return;
  state.isRunning = true;
  updateRunButton();
  
  // Init Console UI
  elements.consolePlaceholder.classList.add('hidden');
  elements.consoleLogs.classList.remove('hidden');
  elements.consoleLogs.innerHTML = '';
  addLog('> プログラムを実行中...', true);
  
  const level = LEVELS.find(l => l.id === state.currentLevelId);
  
  setTimeout(() => {
    try {
      if (level.simulationType === 'basic') {
        let count = 0;
        for (let i = 0; i < 100; i++) {
          const kekka = Math.floor(Math.random() * 100);
          addLog(String(kekka));
          if (kekka === 0) count++;
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
      state.isRunning = false;
      updateRunButton();
      elements.consoleOutput.scrollTop = elements.consoleOutput.scrollHeight;
    }
  }, 500);
}

function addLog(text, isSystem = false) {
  const div = document.createElement('div');
  div.className = `break-all ${isSystem ? 'text-yellow-400' : 'text-slate-300'}`;
  div.textContent = text;
  elements.consoleLogs.appendChild(div);
}

function updateRunButton() {
  if (state.isRunning) {
    elements.runSimulationBtn.textContent = '実行中...';
    elements.runSimulationBtn.disabled = true;
  } else {
    elements.runSimulationBtn.innerHTML = '<i data-lucide="play" class="w-4 h-4"></i> 実行する';
    elements.runSimulationBtn.disabled = false;
    lucide.createIcons();
  }
}

// Event Listeners
function setupEventListeners() {
  elements.mobileMenuBtn.onclick = toggleSidebar;
  elements.sidebarCloseBtn.onclick = closeSidebar;
  elements.sidebarOverlay.onclick = closeSidebar;
  elements.runSimulationBtn.onclick = runSimulation;
}

// Start App
init();
