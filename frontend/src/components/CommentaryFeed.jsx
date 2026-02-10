import React from 'react';

export function CommentaryFeed({ commentaries }) {
  if (!commentaries || commentaries.length === 0) {
    return (
        <div className="flex-1 flex items-center justify-center text-slate-400 p-8 text-center italic">
            Waiting for match events...
        </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
      {commentaries.map((comment, index) => (
        <div key={comment.id || index} className="relative pl-6 pb-6 border-l-2 border-slate-200 last:border-0 last:pb-0">
          <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-yellow-400 border-2 border-black"></div>
           {/* Header: Time, Minute, EventType */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-mono text-slate-400 text-xs">
                 {comment.createdAt ? new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'}) : ''}
            </span>
            {comment.minute && <span className="font-bold text-sm">{comment.minute}'</span>}
            {comment.eventType && (
                 <span className="bg-yellow-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-black uppercase tracking-wide">
                     {comment.eventType}
                 </span>
            )}
          </div>
          
           {/* Actor/Team info if available */}
          {(comment.actor || comment.team) && (
              <div className="text-sm font-medium text-slate-600 mb-2">
                 {[comment.actor, comment.team].filter(Boolean).join(' · ')}
              </div>
          )}

          {/* Message */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm font-medium shadow-sm">
            {comment.message}
          </div>
        </div>
      ))}
    </div>
  );
}
