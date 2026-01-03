import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Calendar, ChevronLeft, ChevronRight, Moon, Sun, Share2, 
  Bell, X, BarChart3, Edit3, Save, LayoutGrid, List, 
  Quote, Hourglass, Settings, Info
} from 'lucide-react';

/**
 * --- DATABASE DE FRASES & VERSÍCULOS ---
 */
const QUOTES = [
  "A disciplina é a ponte entre metas e realizações. – Jim Rohn",
  "Foco é dizer não para centenas de boas ideias. – Steve Jobs",
  "Sem autodisciplina, o sucesso é impossível, ponto final. – Lou Holtz",
  "A única diferença entre sucesso e fracasso é a capacidade de agir. – Alexander Graham Bell",
  "Você nunca vai sempre estar motivado. Você tem que aprender a ser disciplinado.",
  "Foco, disciplina, trabalho árduo e sacrifício. Finalmente, não existe mágica. – Kobe Bryant",
  "A força não vem de vitórias. Seus esforços desenvolvem suas forças. – Arnold Schwarzenegger",
  "Persistência é o veículo do êxito. – Charles Chaplin",
  "Disciplina é lembrar-se do que você quer. – David Campbell",
  "Foco é fazer o que é preciso, disciplina é evitar o que não é necessário.",
  "Mantenha o foco em seu objetivo, não olhe em nenhuma outra direção, mas à frente.",
  "A disciplina é a parte mais importante do sucesso. – Truman Capote",
  "Não é o que fazemos de vez em quando que molda nossas vidas, mas o que fazemos consistentemente. – Tony Robbins",
  "Foco significa estar presente.",
  "Para ter sucesso, sua determinação deve ser maior que sua habilidade de desistir.",
  "A verdadeira liberdade é impossível sem uma mente liberta pela disciplina. – Mortimer J. Adler",
  "Foco é escolher conscientemente o que dizer não.",
  "Disciplina é a escolha entre o que você quer agora e o que você quer mais.",
  "A excelência não é um ato, mas um hábito. – Aristóteles",
  "Sucesso é a soma de pequenos esforços repetidos dia após dia. – Robert Collier",
  "A disciplina é o fogo que molda o aço do caráter.",
  "Foco é a arte de priorizar o essencial acima do urgente.",
  "Disciplina é o combustível que transforma sonhos em realidade.",
  "Você não pode ter sucesso se estiver distraído com o fracasso.",
  "A chave para o sucesso é manter a mente onde seus pés estão.",
  "O progresso só acontece quando você se recusa a desistir.",
  "Foco e disciplina são as asas que te levam ao topo.",
  "Não se distraia com os ruídos do mundo; mantenha sua visão clara.",
  "Disciplina é o diferencial entre a mediocridade e a excelência.",
  "Você cresce a cada vez que escolhe a disciplina sobre a facilidade.",
  "A constância no esforço vence o talento sem dedicação.",
  "Foco é colocar toda sua energia no que realmente importa.",
  "Disciplina é o que transforma intenção em ação.",
  "Não é a motivação que te faz continuar, é a disciplina.",
  "Se você não controla sua mente, alguém ou algo o fará.",
  "O maior teste de disciplina é manter o foco mesmo quando ninguém está olhando.",
  "Foco é a habilidade de ignorar o irrelevante.",
  "Os resultados vêm para aqueles que têm paciência e perseverança.",
  "Disciplina é fazer o que deve ser feito, mesmo quando você não quer.",
  "O sucesso é silencioso; o trabalho duro, nem sempre.",
  "Foco não é sobre mais, é sobre melhor.",
  "Com disciplina, até o impossível parece alcançável.",
  "O futuro é moldado pelas decisões que você faz hoje.",
  "Grandes conquistas exigem grandes doses de disciplina.",
  "Não confunda estar ocupado com estar focado.",
  "Cada pequeno esforço disciplinado constrói uma grande vitória.",
  "Quando você se mantém disciplinado, não há limites para o que pode alcançar.",
  "Foco é a bússola; disciplina é a força que te move.",
  "Os maiores sucessos vêm daqueles que aprendem a se disciplinar.",
  "Quando o foco é claro, as decisões ficam mais fáceis.",
  "Disciplina não é restrição; é liberdade para atingir o extraordinário.",
  "O caminho para a excelência é pavimentado com disciplina diária.",
  "Foco e disciplina são os alicerces de qualquer conquista.",
  "Sem disciplina, até o melhor plano é apenas uma intenção.",
  "Quanto mais você trabalha em si mesmo, mais longe você vai.",
  "É no silêncio da disciplina que o som do sucesso é construído.",
  "Foco é a diferença entre tentar e realizar.",
  "Disciplina é o preço que você paga para viver seus sonhos.",
  "Sucesso não é um evento; é uma rotina construída com disciplina.",
  "Ao dominar a disciplina, você domina o próprio destino.",
  "Foco é o que separa aqueles que sonham daqueles que realizam.",
  "A disciplina diária é o que transforma boas intenções em grandes resultados.",
  "Grandes sonhos exigem uma dose ainda maior de disciplina.",
  "Cada dia de esforço disciplinado é um passo mais próximo do sucesso.",
  "O segredo do sucesso está na consistência e na disciplina.",
  "A determinação te coloca no caminho; a disciplina te mantém nele.",
  "Foco é enxergar o objetivo mesmo no meio do caos.",
  "Disciplina é a arte de escolher seus sacrifícios.",
  "Se você dominar a disciplina, dominará qualquer desafio.",
  "O maior investimento que você pode fazer é na sua própria disciplina.",
  "Você é o que repete todos os dias; seja disciplinado.",
  "A disciplina transforma intenções vagas em ações concretas.",
  "Foco é quando sua energia encontra direção.",
  "A cada escolha disciplinada, você constrói o futuro que deseja.",
  "Disciplina é a prova de que você acredita no seu potencial.",
  "Quem não tem disciplina para começar, nunca chegará ao fim.",
  "Foco é a lâmpada; disciplina é a energia que a mantém acesa.",
  "Os frutos mais doces vêm dos esforços mais disciplinados.",
  "Disciplina não é sobre perfeição, é sobre consistência.",
  "A chave do progresso é manter o foco no que importa.",
  "Sem disciplina, o talento é apenas potencial desperdiçado.",
  "O sucesso é o destino, mas a disciplina é o motor que te leva até lá.",
  "Não espere por motivação; ela é passageira. A disciplina é constante.",
  "Com disciplina, cada pequeno passo se torna uma vitória.",
  "Foco é o superpoder de quem deseja conquistar grandes coisas.",
  "Disciplina é escolher o que você quer mais em vez do que você quer agora.",
  "Quem vive distraído jamais alcança seus maiores objetivos.",
  "Disciplina é a linguagem dos que transformam sonhos em realidade.",
  "Foco é saber para onde ir; disciplina é nunca parar.",
  "Você é o arquiteto da sua vida; a disciplina é sua melhor ferramenta.",
  "A paciência só é útil quando acompanhada da disciplina.",
  "A cada escolha focada, você escreve uma nova página da sua história.",
  "Disciplina é o compromisso com sua própria evolução.",
  "Foco transforma obstáculos em degraus para o sucesso.",
  "Sem disciplina, até as melhores oportunidades passam despercebidas.",
  "Os melhores resultados nascem do trabalho disciplinado e constante.",
  "Foco e disciplina são como músculos: quanto mais você os treina, mais fortes eles ficam.",
  "Disciplina não é um castigo; é um presente que você se dá.",
  "Se você não está disposto a ser disciplinado, esteja preparado para desistir dos seus sonhos.",
  "Tudo posso naquele que me fortalece. – Filipenses 4:13",
  "Sê forte e corajoso; não temas, nem te espantes. – Josué 1:9",
  "O Senhor é a minha força e o meu escudo. – Salmos 28:7",
  "Pois Deus não nos deu espírito de covardia, mas de poder, de amor e de equilíbrio. – 2 Timóteo 1:7",
  "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento. – Provérbios 3:5"
];

const MOODS = {
  'A+': { label: 'Excelente', score: 5, color: 'bg-green-600', hex: '#16A34A', text: 'text-green-600' },
  'A':  { label: 'Muito Bom', score: 4, color: 'bg-green-500', hex: '#22C55E', text: 'text-green-500' },
  'B':  { label: 'Bom',       score: 3, color: 'bg-green-300', hex: '#86EFAC', text: 'text-green-300' },
  'C':  { label: 'Neutro',    score: 2, color: 'bg-yellow-400', hex: '#FACC15', text: 'text-yellow-400' },
  'D':  { label: 'Ruim',      score: 1, color: 'bg-orange-400', hex: '#FB923C', text: 'text-orange-400' },
  'F':  { label: 'Terrível',  score: 0, color: 'bg-red-500',    hex: '#EF4444', text: 'text-red-500' },
};

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const FULL_MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

// Helper: Formata data local YYYY-MM-DD
const formatDateKey = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper: Gera um índice "aleatório" mas fixo para o dia
const getQuoteOfTheDay = () => {
  const today = new Date();
  const dateString = `${today.getFullYear()}${today.getMonth()}${today.getDate()}`;
  // Simples hash numérico da data
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);
  return QUOTES[positiveHash % QUOTES.length];
};

// Hook: html2canvas (carregamento dinâmico)
const useHtml2Canvas = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.html2canvas) { setReady(true); return; }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onload = () => setReady(true);
    document.body.appendChild(script);
  }, []);
  return ready;
};

/**
 * COMPONENTE PRINCIPAL (APP)
 */
export default function App() {
  const [data, setData] = useState(() => JSON.parse(localStorage.getItem('moodTrackerData') || '{}'));
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [birthDate, setBirthDate] = useState(() => localStorage.getItem('birthDate') || '');
  
  const [viewMode, setViewMode] = useState('year');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMemento, setShowMemento] = useState(false);

  // Notifications
  const [notificationTime, setNotificationTime] = useState(() => localStorage.getItem('notificationTime') || '');
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => localStorage.getItem('notificationsEnabled') === 'true');

  const canvasReady = useHtml2Canvas();
  const exportRef = useRef(null);
  const dailyQuote = useMemo(() => getQuoteOfTheDay(), []);

  // --- Efeitos ---
  useEffect(() => localStorage.setItem('moodTrackerData', JSON.stringify(data)), [data]);
  useEffect(() => localStorage.setItem('birthDate', birthDate), [birthDate]);
  
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('notificationTime', notificationTime);
    localStorage.setItem('notificationsEnabled', notificationsEnabled);
    let interval;
    if (notificationsEnabled && notificationTime) {
      if (Notification.permission !== 'granted') Notification.requestPermission();
      interval = setInterval(() => {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        if (currentTime === notificationTime && now.getSeconds() < 2) {
           new Notification("Hora de registrar seu humor!", { body: "Como foi o seu dia? Registre agora.", icon: "/icon.png" });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [notificationsEnabled, notificationTime]);

  const handleSaveEntry = (dateKey, mood, note) => {
    setData(prev => ({ ...prev, [dateKey]: { mood, note } }));
    setSelectedDate(null);
  };

  const exportToImage = async () => {
    if (!window.html2canvas || !exportRef.current) return;
    try {
      const canvas = await window.html2canvas(exportRef.current, {
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        scale: 2
      });
      canvas.toBlob(blob => {
        if (navigator.share) {
          navigator.share({ title: 'Meu Mood Tracker', text: `Progresso ${currentYear}`, files: [new File([blob], 'mood.png', { type: 'image/png' })] }).catch(console.error);
        } else {
          const link = document.createElement('a');
          link.download = `mood-${currentYear}.png`;
          link.href = canvas.toDataURL();
          link.click();
        }
      });
    } catch (err) { console.error(err); alert("Erro ao gerar imagem."); }
  };

  // --- Cálculos Stats ---
  const stats = useMemo(() => {
    const yearKeys = Object.keys(data).filter(k => k.startsWith(`${currentYear}-`));
    const totalDays = yearKeys.length;
    if (totalDays === 0) return null;
    
    const counts = {};
    Object.keys(MOODS).forEach(m => counts[m] = 0);
    let totalScore = 0;
    
    yearKeys.forEach(k => {
      const mood = data[k].mood;
      if (counts[mood] !== undefined) {
        counts[mood]++;
        totalScore += MOODS[mood].score;
      }
    });

    // Média Mensal
    const currentMonthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    const monthKeys = yearKeys.filter(k => k.startsWith(currentMonthPrefix));
    let monthScore = 0;
    monthKeys.forEach(k => monthScore += MOODS[data[k].mood].score);
    const avgScore = monthKeys.length ? (monthScore / monthKeys.length) : 0;
    
    // Calcula letra da média
    let avgMood = 'F';
    if (avgScore >= 4.5) avgMood = 'A+';
    else if (avgScore >= 3.5) avgMood = 'A';
    else if (avgScore >= 2.5) avgMood = 'B';
    else if (avgScore >= 1.5) avgMood = 'C';
    else if (avgScore >= 0.5) avgMood = 'D';

    return { counts, totalDays, avgScore, avgMood, monthCount: monthKeys.length };
  }, [data, currentYear, currentMonth]);

  // --- Memento Mori Calc ---
  const lifeWeeks = useMemo(() => {
    if (!birthDate) return null;
    const start = new Date(birthDate);
    const now = new Date();
    const diff = now - start;
    const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    return weeks > 0 ? weeks : 0;
  }, [birthDate]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark:bg-gray-900 dark:text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      
      {/* HEADER */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-md">M</div>
          <h1 className="text-xl font-bold tracking-tight hidden sm:block">Mood Tracker</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-1">
             <button onClick={() => setCurrentYear(y => y - 1)} className="p-1 hover:text-green-600"><ChevronLeft size={16} /></button>
             <span className="font-semibold px-2 text-sm">{currentYear}</span>
             <button onClick={() => setCurrentYear(y => y + 1)} className="p-1 hover:text-green-600"><ChevronRight size={16} /></button>
          </div>
          <button onClick={() => setViewMode(v => v === 'year' ? 'month' : 'year')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
            {viewMode === 'year' ? <LayoutGrid size={20} /> : <List size={20} />}
          </button>
          <button onClick={() => setShowStats(true)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors md:hidden">
            <BarChart3 size={20} />
          </button>
          <button onClick={() => setShowSettings(true)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
            <Settings size={20} />
          </button>
          <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4 max-w-6xl flex gap-6 relative flex-col md:flex-row">
        
        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col gap-6 w-full overflow-hidden">
          
          {/* DAILY QUOTE */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800/50 p-6 rounded-2xl border border-blue-100 dark:border-gray-700 relative overflow-hidden">
             <Quote className="absolute top-4 left-4 text-blue-200 dark:text-gray-700 w-12 h-12 -z-0" />
             <p className="relative z-10 text-lg font-serif italic text-gray-700 dark:text-gray-200 text-center leading-relaxed">
               "{dailyQuote.split('–')[0].trim()}"
             </p>
             {dailyQuote.split('–')[1] && (
               <p className="relative z-10 text-right text-sm font-bold text-gray-500 dark:text-gray-400 mt-2 uppercase tracking-wide">
                 — {dailyQuote.split('–')[1].trim()}
               </p>
             )}
          </div>

          <div className="flex justify-between items-center">
             <h2 className="text-2xl font-bold">
               {viewMode === 'year' ? `Visão Geral de ${currentYear}` : FULL_MONTHS[currentMonth]}
             </h2>
             {viewMode === 'month' && (
                <div className="flex items-center gap-2">
                   <button onClick={() => setCurrentMonth(p => p === 0 ? 11 : p - 1)} className="p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"><ChevronLeft size={18}/></button>
                   <button onClick={() => setCurrentMonth(p => p === 11 ? 0 : p + 1)} className="p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"><ChevronRight size={18}/></button>
                </div>
             )}
             {viewMode === 'year' && (
               <button onClick={exportToImage} disabled={!canvasReady} className="flex items-center gap-2 text-sm font-medium bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow-sm transition-colors">
                  <Share2 size={16} /><span className="hidden sm:inline">Compartilhar</span>
               </button>
             )}
          </div>

          {/* GRID */}
          <div ref={exportRef} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 overflow-x-auto">
            {viewMode === 'year' ? 
              <YearGrid year={currentYear} data={data} onSelectDate={setSelectedDate} /> : 
              <MonthView year={currentYear} month={currentMonth} data={data} onSelectDate={setSelectedDate} />
            }
          </div>
        </div>

        {/* SIDEBAR (Desktop) */}
        <div className="hidden md:block w-80 shrink-0 space-y-6">
           <StatsCard stats={stats} year={currentYear} currentMonthName={FULL_MONTHS[currentMonth]} />
           
           {/* Memento Mori Widget */}
           <div 
             onClick={() => setShowMemento(true)}
             className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-gray-400 transition-colors group"
           >
              <div className="flex items-center gap-2 mb-3 text-gray-900 dark:text-white">
                <Hourglass className="text-gray-400 group-hover:text-green-500 transition-colors" size={20} />
                <h3 className="font-bold">Tempo de Vida</h3>
              </div>
              
              {birthDate ? (
                <>
                  <p className="text-4xl font-bold text-gray-800 dark:text-gray-100">{lifeWeeks}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-1">Semanas Vividas</p>
                  <div className="mt-4 text-xs text-gray-400 italic">Clique para ver o quadro "Memento Mori"</div>
                </>
              ) : (
                <div className="text-sm text-gray-500 text-center py-4">
                   Configure sua data de nascimento para ver seu progresso de vida.
                </div>
              )}
           </div>
        </div>
      </main>

      {/* MODALS */}
      {selectedDate && <MoodEntryModal date={selectedDate} initialData={data[formatDateKey(selectedDate)]} onClose={() => setSelectedDate(null)} onSave={handleSaveEntry} />}
      
      {showStats && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
           <div className="bg-white dark:bg-gray-900 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 relative animate-slide-up">
              <button onClick={() => setShowStats(false)} className="absolute top-4 right-4 p-2 text-gray-400"><X size={20}/></button>
              <h2 className="text-xl font-bold mb-6">Estatísticas</h2>
              <StatsCard stats={stats} year={currentYear} currentMonthName={FULL_MONTHS[currentMonth]} embedded />
              
              {/* Mobile Memento Mori Link */}
              <button 
                onClick={() => { setShowStats(false); setShowMemento(true); }}
                className="w-full mt-4 p-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2"
              >
                <Hourglass size={16} /> Ver Memento Mori
              </button>
           </div>
        </div>
      )}

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold">Configurações</h3>
               <button onClick={() => setShowSettings(false)} className="text-gray-400"><X size={20}/></button>
             </div>
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-sm font-bold text-gray-500 uppercase">Data de Nascimento</label>
                   <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-2" />
                   <p className="text-xs text-gray-400">Usado para calcular o Memento Mori.</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <label className="font-medium text-gray-700 dark:text-gray-200">Lembrete Diário</label>
                  <button onClick={() => { if(!notificationsEnabled) Notification.requestPermission(); setNotificationsEnabled(!notificationsEnabled); }} className={`w-12 h-6 rounded-full p-1 transition-colors ${notificationsEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
                {notificationsEnabled && (
                  <input type="time" value={notificationTime} onChange={e => setNotificationTime(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-2" />
                )}
             </div>
          </div>
        </div>
      )}

      {/* MEMENTO MORI FULL MODAL */}
      {showMemento && (
        <MementoMoriModal birthDate={birthDate} onClose={() => setShowMemento(false)} />
      )}

    </div>
  );
}

/**
 * COMPONENTES AUXILIARES
 */

function MementoMoriModal({ birthDate, onClose }) {
  const weeksLived = useMemo(() => {
    if (!birthDate) return 0;
    const diff = new Date() - new Date(birthDate);
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
  }, [birthDate]);

  // 80 anos * 52 semanas = 4160
  const TOTAL_WEEKS = 4160; 

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-4xl h-[90vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center shrink-0">
          <div>
             <h2 className="text-2xl font-bold font-serif">Memento Mori</h2>
             <p className="text-sm text-gray-500">Cada quadrado representa uma semana de uma vida de 80 anos.</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><X size={24}/></button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center">
           {!birthDate ? (
             <div className="text-center mt-20">
               <p className="text-xl font-bold text-gray-400">Configure sua data de nascimento nas configurações.</p>
             </div>
           ) : (
             <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(52, minmax(4px, 1fr))', width: 'fit-content' }}>
                {Array.from({ length: TOTAL_WEEKS }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-[1px] ${i < weeksLived ? 'bg-gray-800 dark:bg-gray-200' : 'border border-gray-300 dark:border-gray-700'}`}
                    title={i < weeksLived ? `Semana ${i+1}: Vivida` : `Semana ${i+1}: Futuro`}
                  />
                ))}
             </div>
           )}
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 shrink-0 flex justify-between items-center text-xs sm:text-sm text-gray-500">
           <span>{weeksLived} semanas vividas</span>
           <span>{(TOTAL_WEEKS - weeksLived).toLocaleString()} semanas restantes (estimativa)</span>
        </div>
      </div>
    </div>
  )
}

function YearGrid({ year, data, onSelectDate }) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  return (
    <div className="min-w-[600px]">
      <div className="grid grid-cols-[auto_repeat(12,_1fr)] gap-1 mb-2">
        <div className="w-6"></div>
        {MONTHS.map(m => <div key={m} className="text-center text-xs font-bold text-gray-400 uppercase">{m}</div>)}
      </div>
      <div className="grid gap-1">
        {days.map(day => (
          <div key={day} className="grid grid-cols-[auto_repeat(12,_1fr)] gap-1 items-center h-8">
             <div className="w-6 text-[10px] text-gray-400 text-center font-mono">{day}</div>
             {MONTHS.map((_, mi) => {
               const date = new Date(year, mi, day);
               const isValid = date.getMonth() === mi;
               const key = isValid ? formatDateKey(date) : null;
               const entry = key ? data[key] : null;
               if (!isValid) return <div key={mi} />;
               return (
                 <button key={mi} onClick={() => onSelectDate(date)} 
                   className={`h-full w-full rounded-sm transition-transform hover:scale-110 border border-black/5 dark:border-white/5 ${entry ? MOODS[entry.mood].color : 'bg-gray-100 dark:bg-gray-700'}`}
                   title={key + (entry ? `: ${MOODS[entry.mood].label}` : '')}
                 />
               );
             })}
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthView({ year, month, data, onSelectDate }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const entries = days.map(d => ({ d, date: new Date(year, month, d), entry: data[formatDateKey(new Date(year, month, d))] })).filter(e => e.entry);

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
       <div className="max-w-lg mx-auto w-full">
         <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-gray-400 uppercase">
            {['D','S','T','Q','Q','S','S'].map((d, i) => <div key={i}>{d}</div>)}
         </div>
         <div className="grid grid-cols-7 gap-2">
            {blanks.map(b => <div key={`b-${b}`} />)}
            {days.map(d => {
               const date = new Date(year, month, d);
               const entry = data[formatDateKey(date)];
               const isToday = formatDateKey(new Date()) === formatDateKey(date);
               return (
                 <button key={d} onClick={() => onSelectDate(date)} className={`aspect-square rounded-xl flex items-center justify-center relative border transition-all ${entry ? `${MOODS[entry.mood].color} text-white border-transparent` : 'bg-gray-50 dark:bg-gray-700/50 hover:border-green-400'} ${isToday && !entry ? 'ring-2 ring-green-500' : ''}`}>
                    <span className="font-bold text-sm">{d}</span>
                 </button>
               );
            })}
         </div>
       </div>
       <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Edit3 size={18} /> Diário</h3>
          <div className="space-y-3">
             {entries.length === 0 ? <p className="text-gray-400 text-sm italic">Nada registrado.</p> : entries.map(({d, date, entry}) => (
                 <div key={d} onClick={() => onSelectDate(date)} className="cursor-pointer bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl flex gap-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${MOODS[entry.mood].color}`}>{entry.mood}</div>
                    <div>
                       <div className="flex items-center gap-2 mb-1"><span className="font-bold text-sm">Dia {d}</span></div>
                       <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{entry.note || '-'}</p>
                    </div>
                 </div>
             ))}
          </div>
       </div>
    </div>
  );
}

function MoodEntryModal({ date, initialData, onClose, onSave }) {
  const [mood, setMood] = useState(initialData?.mood || null);
  const [note, setNote] = useState(initialData?.note || '');
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm animate-fade-in" onClick={onClose}>
       <div className="w-full max-w-md bg-white dark:bg-gray-900 h-full shadow-2xl p-6 flex flex-col" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-bold">{date.getDate()} de {FULL_MONTHS[date.getMonth()]}</h2>
             <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full"><X size={20} /></button>
          </div>
          <div className="flex-1 space-y-6 overflow-y-auto">
             <div className="grid grid-cols-3 gap-3">
               {Object.entries(MOODS).map(([k, v]) => (
                 <button key={k} onClick={() => setMood(k)} className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 ${mood === k ? `border-${v.color.replace('bg-', '')} bg-${v.color.replace('bg-', '')}/10` : 'border-transparent bg-gray-50 dark:bg-gray-800'}`}>
                    <div className={`w-6 h-6 rounded-full ${v.color}`}></div><span className="font-bold text-sm">{v.label}</span>
                 </button>
               ))}
             </div>
             <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Como foi o dia?" className="w-full h-40 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-green-500 resize-none" />
          </div>
          <button onClick={() => { if(mood) onSave(formatDateKey(date), mood, note); }} disabled={!mood} className="w-full py-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"><Save size={20}/> Salvar</button>
       </div>
    </div>
  );
}

function StatsCard({ stats, year, currentMonthName, embedded }) {
  if (!stats) return <div className="p-4 text-center text-gray-400">Sem dados.</div>;
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${!embedded && 'sticky top-6'}`}>
       <h3 className="font-bold text-lg mb-4">Resumo {year}</h3>
       <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl"><p className="text-xs text-gray-500 font-bold uppercase">Total Dias</p><p className="text-2xl font-bold">{stats.totalDays}</p></div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl"><p className="text-xs text-gray-500 font-bold uppercase">Média ({currentMonthName})</p><p className="text-2xl font-bold flex items-baseline gap-1">{stats.avgMood}<span className="text-xs text-gray-400 font-normal">({stats.avgScore.toFixed(1)})</span></p></div>
       </div>
       <div className="space-y-2">
          {Object.entries(MOODS).map(([k, v]) => {
             const c = stats.counts[k] || 0;
             if (c === 0 && !embedded) return null;
             return <div key={k} className="flex items-center gap-2 text-xs"><div className={`w-4 h-4 rounded ${v.color} text-white flex items-center justify-center`}>{k}</div><div className="flex-1 bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full"><div style={{width: `${stats.totalDays ? (c/stats.totalDays)*100 : 0}%`}} className={`h-full rounded-full ${v.color}`} /></div><span className="w-6 text-right">{c}</span></div>
          })}
       </div>
    </div>
  );
}
