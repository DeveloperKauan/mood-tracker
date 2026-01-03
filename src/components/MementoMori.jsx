import React from 'react';
import { X, Hourglass } from 'lucide-react';

export default function MementoMori({ birthDate, onClose }) {
  // Lógica recalculada aqui caso o componente seja usado isoladamente
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
