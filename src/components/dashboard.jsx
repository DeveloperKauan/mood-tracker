import React from 'react';

import { Quote, Activity, Hourglass, Calendar } from 'lucide-react';

import { MOODS_DB } from '../data/static';



export default function Dashboard({ 

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

        <Calendar size={18} />

        Ver Calendário Completo

      </button>



    </div>

  );

}



// Ícone auxiliar

function Edit3({size}) {

  return (

    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>

  )

}
