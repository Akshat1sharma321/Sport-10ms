import React from 'react';

export function MatchCard({ match, isLive, onWatch }) {
  const isMatchLive = match.status === 'live';

  return (
    <div 
        className={`bg-white border-2 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group ${isLive ? 'ring-4 ring-yellow-400' : ''}`}
        onClick={() => onWatch(match.id)}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="bg-white border boundary-black text-xs font-bold px-2 py-0.5 rounded-full border border-black uppercase">{match.sport || 'Unknown'}</span>
        {isMatchLive && (
          <div className="flex items-center gap-1 text-red-600 font-bold text-xs uppercase">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span> Live
          </div>
        )}
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">{match.homeTeam}</span>
          <span className="bg-slate-100 px-3 py-1 rounded-lg font-mono font-bold text-xl border border-slate-300">{match.homeScore}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">{match.awayTeam}</span>
          <span className="bg-slate-100 px-3 py-1 rounded-lg font-mono font-bold text-xl border border-slate-300">{match.awayScore}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
        <span className="text-slate-500 text-sm font-medium">
            {new Date(match.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </span>
        <button 
            className={`${isLive ? 'bg-sky-400' : 'bg-yellow-400'} hover:opacity-90 text-black font-bold text-sm px-4 py-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all`}
        >
          {isLive ? 'Watching Live' : 'Watch Live'}
        </button>
      </div>
    </div>
  );
}
