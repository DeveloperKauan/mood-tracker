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
