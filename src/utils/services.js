import { MOODS_DB, QUOTES_DB } from '../data/static';

// --- DATA HELPERS ---
export const formatDateKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const getTodayFormatted = () => {
  return new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
};

// --- QUOTE LOGIC ---
export const getQuoteOfTheDay = () => {
  const today = new Date();
  const dateString = `${today.getFullYear()}${today.getMonth()}${today.getDate()}`;
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
    hash |= 0;
  }
  return QUOTES_DB[Math.abs(hash) % QUOTES_DB.length];
};

// --- STORAGE SERVICE ---
export const StorageService = {
  getData: () => JSON.parse(localStorage.getItem('moodTrackerData') || '{}'),
  saveData: (data) => localStorage.setItem('moodTrackerData', JSON.stringify(data)),
  
  getSettings: () => ({
    theme: localStorage.getItem('theme') || 'light',
    birthDate: localStorage.getItem('birthDate') || '',
  }),
  saveSetting: (key, value) => localStorage.setItem(key, value)
};

// --- STATS LOGIC ---
export const calculateStats = (data, year, month) => {
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

// --- MEMENTO MORI LOGIC ---
export const calculateLifeWeeks = (birthDate) => {
  if (!birthDate) return { lived: 0, total: 4160, percent: 0 };
  const diff = new Date() - new Date(birthDate);
  const lived = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24 * 7)));
  const total = 80 * 52; // 80 Anos
  const percent = Math.min(100, (lived / total) * 100);
  return { lived, total, percent };
};
