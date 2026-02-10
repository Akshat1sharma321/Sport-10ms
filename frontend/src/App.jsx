import { useState, useEffect, useRef } from 'react'
import { fetchMatches, fetchMatchDetails } from './api'
import { useWebSocket } from './hooks/useWebSocket'
import { MatchCard } from './components/MatchCard'
import { CommentaryFeed } from './components/CommentaryFeed'
import FooterI from './components/footer'

function App() {
  const [matches, setMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [commentary, setCommentary] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { isConnected, lastMessage, subscribeToMatch, unsubscribeFromMatch } = useWebSocket();
  const messagesEndRef = useRef(null);
  const POLL_INTERVAL = 10000; // 10 seconds

  // Fetch matches initially and polling
  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await fetchMatches();
        // data structure from API: { matches: [...] } or array?
        // Let's assume response.json() returns array or object with data property
        // Based on typical Express response `res.json(matches)` or `res.json({data: matches})`
        // I need to check `matchRoutes.js`. Assuming array for now, will debug if needed.
        // Actually `matchRoutes.js` usually returns `res.json(matches)`.
        const matchesList = Array.isArray(data) ? data : data.data || [];
        setMatches(matchesList);
        setLoading(false);

        // Auto-select first live match if none selected
        if (!selectedMatchId && matchesList.length > 0) {
          const liveMatch = matchesList.find((m) => m.status === "live");
          if (liveMatch) setSelectedMatchId(liveMatch.id);
          else setSelectedMatchId(matchesList[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch matches", err);
        setLoading(false);
      }
    };

    loadMatches();
    const interval = setInterval(loadMatches, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [selectedMatchId, POLL_INTERVAL]);

//   -  }, []);
// +  }, [selectedMatchId, POLL_INTERVAL]);

  // Handle Match Selection & Subscription
  useEffect(() => {
    if (!selectedMatchId) return;

    // Load historical commentary
    const loadCommentary = async () => {
        try {
            const response = await fetch(`http://localhost:8000/matches/${selectedMatchId}/commentary`);
             if (response.ok) {
                 const data = await response.json();
                 // API routes returned `res.json({ data: results })`
                 setCommentary(data.data || []);
             }
        } catch (e) {
            console.error("Failed to load commentary", e);
        }
    };
    loadCommentary();

    // Subscribe to WS
    subscribeToMatch(selectedMatchId);

    return () => {
        unsubscribeFromMatch(selectedMatchId);
    };
  }, [selectedMatchId, subscribeToMatch, unsubscribeFromMatch]);

  // Handle Incoming WebSocket Messages
  useEffect(() => {
    if (!lastMessage) return;

    if (lastMessage.type === 'commentary') {
        const newComment = lastMessage.data;
        // Only add if it belongs to selected match (double check, though filtered by server subscription usually)
        if (selectedMatchId && newComment.matchId === selectedMatchId) {
            setCommentary(prev => [newComment, ...prev]);
        }
    } else if (lastMessage.type === 'match_created') {
        // Refresh matches immediately
        fetchMatches().then(data => {
            const matchesList = Array.isArray(data) ? data : (data.data || []);
            setMatches(matchesList);
        });
    }
  }, [lastMessage, selectedMatchId]);


  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-yellow-400 border-b-4 border-black p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black italic tracking-tighter">Sport-10ms</h1>
            <span className="text-xs font-bold uppercase tracking-widest mt-2">Real-time match data demo</span>
        </div>
        <div className={`flex items-center gap-2 bg-white px-3 py-1 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isConnected ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-xs font-bold uppercase">{isConnected ? 'Live Connected' : 'Connecting...'}</span>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2 border-l-4 border-blue-400 pl-3">Current Matches</h2>
                <div className="bg-black text-white text-xs font-mono px-2 py-1 rounded">
                    {matches.filter(m => m.status === 'live').length} LIVE
                </div>
            </div>
            
            {loading ? (
                <div className="text-center p-10 font-bold text-slate-400">Loading matches...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {matches.map(match => (
                        <MatchCard 
                            key={match.id} 
                            match={match} 
                            isLive={match.status === 'live'}
                            onWatch={(id) => setSelectedMatchId(id)} 
                        />
                    ))}
                    {matches.length === 0 && (
                        <div className="col-span-2 text-center p-10 border-2 border-dashed border-slate-300 rounded-xl">
                            No matches found. Run seeding to populate.
                        </div>
                    )}
                </div>
            )}
        </section>

        <section className="bg-sky-100 border-4 border-black rounded-xl overflow-hidden flex flex-col h-[calc(100vh-140px)] sticky top-24 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="bg-sky-300 p-4 border-b-4 border-black flex justify-between items-center">
                <h3 className="font-bold text-xl">Live Commentary</h3>
                {selectedMatchId && (
                     <span className="bg-white text-xs font-bold px-2 py-1 rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        Match #{selectedMatchId}
                     </span>
                )}
            </div>
            
            <CommentaryFeed commentaries={commentary} />
        </section>
      </main>
<footer>
     <FooterI/>
</footer>
   
     
    </div>
  )
}

export default App
