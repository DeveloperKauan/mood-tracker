import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Settings, Moon, Sun, ChevronLeft, ChevronRight, Share2, 
  Home, Calendar as CalIcon, Save, X, Quote, Activity, Hourglass, LayoutGrid, List, Edit3
} from 'lucide-react';

/**
 * =================================================================================
 * MÓDULO 1: BANCO DE DADOS E CONFIGURAÇÃO
 * (No seu projeto local, salve isso em: src/data/static.js)
 * =================================================================================
 */

const MOODS_DB = {
  'A+': { id: 'A+', label: 'Excelente', score: 5, color: 'bg-green-600', text: 'text-green-600', hex: '#16A34A' },
  'A':  { id: 'A',  label: 'Muito Bom', score: 4, color: 'bg-green-500', text: 'text-green-500', hex: '#22C55E' },
  'B':  { id: 'B',  label: 'Bom',       score: 3, color: 'bg-green-300', text: 'text-green-300', hex: '#86EFAC' },
  'C':  { id: 'C',  label: 'Neutro',    score: 2, color: 'bg-yellow-400', text: 'text-yellow-400', hex: '#FACC15' },
  'D':  { id: 'D',  label: 'Ruim',      score: 1, color: 'bg-orange-400', text: 'text-orange-400', hex: '#FB923C' },
  'F':  { id: 'F',  label: 'Terrível',  score: 0, color: 'bg-red-500',    text: 'text-red-500',    hex: '#EF4444' },
};

const QUOTES_DB = [
  { text: "A disciplina é a ponte entre metas e realizações.", author: "Jim Rohn" },
  { text: "Foco é dizer não para centenas de boas ideias.", author: "Steve Jobs" },
  { text: "Sem autodisciplina, o sucesso é impossível, ponto final.", author: "Lou Holtz" },
  { text: "A única diferença entre sucesso e fracasso é a capacidade de agir.", author: "Alexander Graham Bell" },
  { text: "Tudo posso naquele que me fortalece.", author: "Filipenses 4:13" },
  { text: "Sê forte e corajoso; não temas.", author: "Josué 1:9" },
  { text: "A constância no esforço vence o talento sem dedicação.", author: "Desconhecido" },
  { text: "Não é a motivação que te faz continuar, é a disciplina.", author: "Desconhecido" },
  { text: "O futuro é moldado pelas decisões que você faz hoje.", author: "Desconhecido" },
  { text: "A excelência não é um ato, mas um hábito.", author: "Aristóteles" },
  { text: "Disciplina é lembrar-se do que você quer.", author: "David Campbell" },
  { text: "O Senhor é a minha força e o meu escudo.", author: "Salmos 28:7" },
  { text: "Persistência é o veículo do êxito.", author: "Charles Chaplin" }
];

const FULL_MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

/**
 * =================================================================================
 * MÓDULO 2: SERVIÇOS E UTILITÁRIOS
 * (No seu projeto local, salve isso em: src/utils/services.js)
 * =================================================================================
 */

// Data Helpers
const formatDateKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getTodayFormatted = () => {
  return new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
};

// Quote Logic
const getQuoteOfTheDay = () => {
  const today = new Date();
  const dateString = `${today.getFullYear()}${today.getMonth()}${today.getDate()}`;
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
    hash |= 0;
  }
  return QUOTES_DB[Math.abs(hash) % QUOTES_DB.length];
};

// Storage Service
const StorageService = {
  getData: () => JSON.parse(localStorage.getItem('moodTrackerData') || '{}'),
  saveData: (data) => localStorage.setItem('moodTrackerData', JSON.stringify(data)),
  
  getSettings: () => ({
    theme: localStorage.getItem('theme') || 'light',
    birthDate: localStorage.getItem('birthDate') || '',
  }),
  saveSetting: (key, value) => localStorage.setItem(key, value)
};

// Stats Logic
const calculateStats = (data, year, month) => {
  const yearPrefix = `${year}-`;
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  
  // Filtra chaves do mês atual
  const keys = Object.keys(data).filter(k => k.startsWith(monthPrefix));
  const totalDays = keys.length;
  
  let totalScore = 0;
  keys.forEach(k => {
    const mood = data[k].mood;
    if (MOODS_DB[mood]) totalScore += MOODS_DB[mood].score;
  });

  const avgScore = totalDays > 0 ? (totalScore / totalDays) : 0;
  
  // Define rótulo da média
  let avgLabel = '-';
  if (totalDays > 0) {
    if (avgScore >= 4.5) avgLabel = 'A+';
    else if (avgScore >= 3.5) avgLabel = 'A';
    else if (avgScore >= 2.5) avgLabel = 'B';
    else if (avgScore >= 1.5) avgLabel = 'C';
    else if (avgScore >= 0.5) avgLabel = 'D';
    else avgLabel = 'F';
  }

  return { totalDays, avgScore, avgLabel };
};

// Memento Mori Logic
const calculateLifeWeeks = (birthDate) => {
  if (!birthDate) return { lived: 0, total: 4160, percent: 0 };
  const diff = new Date() - new Date(birthDate);
  const lived = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24 * 7)));
  const total = 80 * 52; // 80 Anos
  const percent = Math.min(100, (lived / total) * 100);
  return { lived, total, percent };
};

/**
 * =================================================================================
 * MÓDULO 3: COMPONENTES REUTILIZÁVEIS
 * (No seu projeto local, salve em: src/components/)
 * =================================================================================
 */

// Componente: Dashboard (Home)
function Dashboard({ 
  quote, 
  todayFormatted, 
  stats, 
  lifeProgress, 
  onOpenMemento, 
  onOpenCalendar,
  onOpenEntry
}) {
  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-20">
      
      {/* 1. DATA E FRASE DO DIA */}
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mb-1">
            Hoje é
          </p>
          <h2 className="text-2xl font-bold capitalize text-gray-900 dark:text-white">
            {todayFormatted}
          </h2>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800/60 p-5 rounded-2xl border border-blue-100 dark:border-gray-700 relative shadow-sm mx-1">
           <Quote className="absolute top-3 left-3 text-blue-200 dark:text-gray-600 w-6 h-6 -z-0" />
           <p className="relative z-10 text-base font-serif italic text-gray-700 dark:text-gray-200 text-center leading-relaxed">
             "{quote.text}"
           </p>
           <p className="relative z-10 text-right text-[10px] font-bold text-gray-500 dark:text-gray-400 mt-2 uppercase">
             — {quote.author}
           </p>
        </div>
      </div>

      {/* 2. CARDS DE MÉDIA E RETROSPECTIVA */}
      <div className="grid grid-cols-2 gap-3 mx-1">
        {/* Card Média Mensal */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-2">
           <div className="flex items-center gap-2 text-gray-400 mb-1">
             <Activity size={16} />
             <span className="text-[10px] font-bold uppercase">Média Mês</span>
           </div>
           <div className="flex items-baseline gap-1">
             <span className={`text-4xl font-bold ${MOODS_DB[stats.avgLabel]?.text || 'text-gray-400'}`}>
               {stats.avgLabel}
             </span>
             <span className="text-xs text-gray-400 font-medium">
               ({stats.avgScore.toFixed(1)})
             </span>
           </div>
           <p className="text-[10px] text-gray-400">{stats.totalDays} dias registrados</p>
        </div>

        {/* Card Memento Mori (Miniatura) */}
        <div 
          onClick={onOpenMemento}
          className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-green-500 transition-colors"
        >
           <div className="flex items-center gap-2 text-gray-400 mb-1">
             <Hourglass size={16} />
             <span className="text-[10px] font-bold uppercase">Vida Vivida</span>
           </div>
           <span className="text-3xl font-bold text-gray-800 dark:text-white">
             {lifeProgress.percent.toFixed(0)}%
           </span>
           <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-1 overflow-hidden">
             <div className="bg-gray-800 dark:bg-gray-200 h-full" style={{ width: `${lifeProgress.percent}%` }}></div>
           </div>
           <p className="text-[10px] text-gray-400 mt-1">Toque para ver</p>
        </div>
      </div>

      {/* 3. BOTÃO DE AÇÃO RÁPIDA */}
      <button 
        onClick={onOpenEntry}
        className="mx-1 py-4 bg-green-600 hover:bg-green-700 active:scale-95 transition-all text-white rounded-2xl font-bold shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
      >
        <Edit3 size={20} />
        Registrar Humor de Hoje
      </button>

      {/* 4. ATALHO PARA CALENDÁRIO COMPLETO */}
      <button 
        onClick={onOpenCalendar}
        className="mx-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
      >
        <CalIcon size={18} />
        Ver Calendário Completo
      </button>

    </div>
  );
}

// Componente: Memento Mori Full
function MementoMori({ birthDate, onClose }) {
  const getWeeks = () => {
    if (!birthDate) return { lived: 0 };
    const diff = new Date() - new Date(birthDate);
    const lived = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24 * 7)));
    return { lived };
  };

  const { lived } = getWeeks();
  const TOTAL_YEARS = 80;
  const TOTAL_WEEKS = TOTAL_YEARS * 52; 

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col animate-slide-up">
        {/* Header Fixo */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
             <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
               <Hourglass size={20} className="text-gray-700 dark:text-gray-300"/>
             </div>
             <div>
               <h2 className="text-lg font-bold font-serif leading-tight">Memento Mori</h2>
               <p className="text-xs text-gray-500">Sua vida em semanas (80 anos)</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <X size={20}/>
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4">
           {!birthDate ? (
             <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
               <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                 <Hourglass size={32} className="text-gray-400"/>
               </div>
               <h3 className="text-xl font-bold">Data não definida</h3>
               <p className="text-gray-500 max-w-xs">Configure sua data de nascimento nas configurações (ícone de engrenagem) para visualizar seu progresso de vida.</p>
             </div>
           ) : (
             <div className="flex flex-col items-center">
               {/* Grid Responsivo */}
               <div className="flex flex-wrap content-start gap-[2px] justify-center max-w-md mx-auto">
                  {Array.from({ length: TOTAL_WEEKS }).map((_, i) => {
                    const isLived = i < lived;
                    return (
                      <div 
                        key={i} 
                        className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full flex-shrink-0 transition-all duration-500
                          ${isLived ? 'bg-gray-900 dark:bg-white' : 'bg-gray-200 dark:bg-gray-800'}
                        `}
                      />
                    )
                  })}
               </div>
               
               <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl text-center max-w-sm w-full mb-8">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{lived}</p>
                  <p className="text-xs uppercase font-bold text-gray-500 tracking-widest mb-4">Semanas Vividas</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                    "Você não tem pouco tempo, mas perde muito dele. A vida é longa o suficiente se você souber usá-la."
                    <br/><span className="text-xs not-italic font-bold mt-2 block">— Sêneca</span>
                  </p>
               </div>
             </div>
           )}
        </div>
    </div>
  )
}

/**
 * =================================================================================
 * MÓDULO 4: APLICAÇÃO PRINCIPAL (src/App.jsx)
 * =================================================================================
 */

export default function App() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'calendar'
  const [data, setData] = useState(() => StorageService.getData());
  const [settings, setSettings] = useState(() => StorageService.getSettings());
  
  // Navigation State
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  
  // Modals State
  const [selectedDate, setSelectedDate] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showMementoFull, setShowMementoFull] = useState(false);

  // Derived Data
  const dailyQuote = useMemo(() => getQuoteOfTheDay(), []);
  const todayFormatted = useMemo(() => getTodayFormatted(), []);
  const stats = useMemo(() => calculateStats(data, currentYear, currentMonth), [data, currentYear, currentMonth]);
  const lifeProgress = useMemo(() => calculateLifeWeeks(settings.birthDate), [settings.birthDate]);

  // --- EFFECTS ---
  useEffect(() => StorageService.saveData(data), [data]);
  
  useEffect(() => {
    StorageService.saveSetting('theme', settings.theme);
    StorageService.saveSetting('birthDate', settings.birthDate);
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings]);

  // --- HANDLERS ---
  const handleSaveEntry = (dateKey, mood, note) => {
    setData(prev => ({ ...prev, [dateKey]: { mood, note } }));
    setSelectedDate(null);
  };

  const toggleTheme = () => {
    setSettings(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${settings.theme === 'dark' ? 'dark:bg-gray-900 dark:text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      
      {/* HEADER FIXO */}
      <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold shadow-md">M</div>
          <span className="font-bold text-lg tracking-tight">Mood.Pro</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowSettings(true)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Settings size={20}/>
          </button>
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            {settings.theme === 'light' ? <Moon size={20}/> : <Sun size={20}/>}
          </button>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="container mx-auto p-4 max-w-xl min-h-[calc(100vh-140px)]">
        
        {activeTab === 'dashboard' && (
          <Dashboard 
            quote={dailyQuote}
            todayFormatted={todayFormatted}
            stats={stats}
            lifeProgress={lifeProgress}
            onOpenMemento={() => setShowMementoFull(true)}
            onOpenCalendar={() => setActiveTab('calendar')}
            onOpenEntry={() => setSelectedDate(new Date())}
          />
        )}

        {activeTab === 'calendar' && (
          <div className="animate-fade-in pb-20">
             {/* Navegação de Mês */}
             <div className="flex items-center justify-between mb-4 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm">
                <button onClick={() => setCurrentMonth(p => p === 0 ? 11 : p - 1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><ChevronLeft size={20}/></button>
                <span className="font-bold text-lg">{FULL_MONTHS[currentMonth]} {currentYear}</span>
                <button onClick={() => setCurrentMonth(p => p === 11 ? 0 : p + 1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><ChevronRight size={20}/></button>
             </div>
             
             {/* Componente de Grid Mensal */}
             <MonthGrid 
               year={currentYear} 
               month={currentMonth} 
               data={data} 
               onSelectDate={setSelectedDate} 
             />
          </div>
        )}
      </main>

      {/* BOTTOM NAVIGATION (TAB BAR) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-2 pb-safe flex justify-around items-center z-40">
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'dashboard' ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-gray-400'}`}
        >
          <Home size={24} strokeWidth={activeTab === 'dashboard' ? 2.5 : 2}/>
          <span className="text-[10px] font-bold">Início</span>
        </button>

        <button 
          onClick={() => setSelectedDate(new Date())} 
          className="bg-green-600 text-white p-4 rounded-full -mt-8 shadow-lg shadow-green-600/30 border-4 border-gray-50 dark:border-gray-900 hover:scale-105 transition-transform"
        >
          <div className="relative">
             <div className="absolute inset-0 bg-white rounded-sm opacity-20 rotate-90 w-0.5 h-full left-1/2 -translate-x-1/2"></div>
             <div className="absolute inset-0 bg-white rounded-sm opacity-20 w-full h-0.5 top-1/2 -translate-y-1/2"></div>
             <Settings size={0} className="opacity-0"/>
             <span className="text-2xl font-bold">+</span>
          </div>
        </button>

        <button 
          onClick={() => setActiveTab('calendar')} 
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'calendar' ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-gray-400'}`}
        >
          <CalIcon size={24} strokeWidth={activeTab === 'calendar' ? 2.5 : 2}/>
          <span className="text-[10px] font-bold">Diário</span>
        </button>
      </nav>

      {/* MODAL MEMENTO MORI FULL */}
      {showMementoFull && (
        <MementoMori 
          birthDate={settings.birthDate} 
          onClose={() => setShowMementoFull(false)} 
        />
      )}

      {/* MODAL DE SETTINGS */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold">Configurações</h3>
               <button onClick={() => setShowSettings(false)}><X size={20} className="text-gray-400"/></button>
             </div>
             <div className="space-y-4">
                <div>
                   <label className="text-sm font-bold text-gray-500 uppercase">Data de Nascimento</label>
                   <input 
                     type="date" 
                     value={settings.birthDate} 
                     onChange={e => setSettings(prev => ({...prev, birthDate: e.target.value}))} 
                     className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 mt-1 outline-none focus:ring-2 focus:ring-green-500" 
                   />
                   <p className="text-xs text-gray-400 mt-2">Necessário para o gráfico de vida.</p>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* MODAL DE INPUT (MoodEntry) */}
      {selectedDate && (
        <MoodEntryModal 
          date={selectedDate} 
          initialData={data[formatDateKey(selectedDate)]}
          onClose={() => setSelectedDate(null)}
          onSave={handleSaveEntry}
        />
      )}

    </div>
  );
}

// --- SUB-COMPONENTES INTERNOS (MonthGrid & MoodEntryModal) ---

function MonthGrid({ year, month, data, onSelectDate }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const entries = days.map(d => ({ d, date: new Date(year, month, d), entry: data[formatDateKey(new Date(year, month, d))] })).filter(e => e.entry);

  return (
    <div className="space-y-6">
       <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
         <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-bold text-gray-400 uppercase">
            {['D','S','T','Q','Q','S','S'].map((d,i) => <div key={i}>{d}</div>)}
         </div>
         <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {blanks.map(b => <div key={`b-${b}`} />)}
            {days.map(d => {
               const date = new Date(year, month, d);
               const entry = data[formatDateKey(date)];
               const isToday = formatDateKey(new Date()) === formatDateKey(date);
               return (
                 <button key={d} onClick={() => onSelectDate(date)} className={`aspect-square rounded-lg flex items-center justify-center relative border transition-all ${entry ? `${MOODS_DB[entry.mood].color} text-white border-transparent` : 'bg-gray-50 dark:bg-gray-700/50 hover:border-green-400'} ${isToday && !entry ? 'ring-2 ring-green-500' : ''}`}>
                    <span className="font-bold text-sm">{d}</span>
                 </button>
               );
            })}
         </div>
       </div>

       {/* Lista de Registros */}
       <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-gray-400 pl-2">Registros do Mês</h3>
          {entries.length === 0 ? <p className="text-gray-400 text-sm italic text-center py-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">Nenhum registro ainda.</p> : entries.map(({d, date, entry}) => (
               <div key={d} onClick={() => onSelectDate(date)} className="cursor-pointer bg-white dark:bg-gray-800 p-4 rounded-xl flex gap-4 border border-gray-100 dark:border-gray-700 hover:border-green-500 transition-colors shadow-sm">
                  <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-white font-bold text-sm ${MOODS_DB[entry.mood].color}`}>{entry.mood}</div>
                  <div className="overflow-hidden">
                     <div className="flex items-center gap-2 mb-0.5"><span className="font-bold text-sm text-gray-900 dark:text-gray-100">Dia {d}</span></div>
                     <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{entry.note || 'Sem nota...'}</p>
                  </div>
               </div>
           ))}
       </div>
    </div>
  )
}

function MoodEntryModal({ date, initialData, onClose, onSave }) {
  const [mood, setMood] = useState(initialData?.mood || null);
  const [note, setNote] = useState(initialData?.note || '');
  
  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
       <div className="w-full sm:max-w-md bg-white dark:bg-gray-900 h-full shadow-2xl p-6 flex flex-col animate-slide-left" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold">{date.getDate()} de {FULL_MONTHS[date.getMonth()]}</h2>
             <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full"><X size={20} /></button>
          </div>
          <div className="flex-1 space-y-6 overflow-y-auto">
             <div>
               <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Como você está?</label>
               <div className="grid grid-cols-3 gap-2">
                 {Object.entries(MOODS_DB).map(([k, v]) => (
                   <button key={k} onClick={() => setMood(k)} className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${mood === k ? `border-${v.color.replace('bg-', '')} bg-${v.color.replace('bg-', '')}/10` : 'border-transparent bg-gray-50 dark:bg-gray-800'}`}>
                      <div className={`w-6 h-6 rounded-full ${v.color}`}></div><span className="font-bold text-xs text-gray-700 dark:text-gray-300">{v.label}</span>
                   </button>
                 ))}
               </div>
             </div>
             <div>
               <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Diário</label>
               <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Escreva sobre seu dia..." className="w-full h-40 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-green-500 resize-none text-sm text-gray-800 dark:text-gray-200" />
             </div>
          </div>
          <button onClick={() => { if(mood) onSave(formatDateKey(date), mood, note); }} disabled={!mood} className="w-full py-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"><Save size={20}/> Salvar Registro</button>
       </div>
    </div>
  );
}
