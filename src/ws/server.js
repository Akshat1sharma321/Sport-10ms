import { WebSocket, WebSocketServer } from "ws"
import { wsArcjet } from "../arcjet.js";

function sendJson(socket,payload){
    if(socket.readyState !== WebSocket.OPEN) return  ; 
    socket.send(JSON.stringify(payload)) ; 
}

function broadcast(wss , payload){
    for(const client of wss.clients){
        if(client.readyState !== WebSocket.OPEN) continue ; 
        client.send(JSON.stringify(payload)) ; 
    }
}


 export function attachWebSocketServer(server){
     const wss = new WebSocketServer({
         server,path:'/ws',maxPayload : 1024 * 1024
     })

    const interval = setInterval(() => {
        for (const client of wss.clients) {
           if (client.isAlive === false) return client.terminate();
            client.isAlive = false;
            client.ping();
        }
    }, 30000);

    wss.on('close', () => clearInterval(interval));

     wss.on('connection' , async(socket , req)=>{
        if(wsArcjet){
            try {
                const decision = await wsArcjet.protect(req) ; 
                if(decision.isDenied()){
                    const code  = decision.reason.isRateLimit() ? 1013 : 1008 ; 
                    const reason = decision.reason.isRateLimit() ? 'Rate limit exceeded' : 'Access Denied' ; 
                    socket.close(code ,reason)
                }
            } catch (error) {
                console.error('WS connection error' ,error) ; 
                socket.close(1011, 'Ws error') ; 
                return  ; 
            }
        }



        socket.isAlive = true;
        socket.on('pong', () => { socket.isAlive = true; });
         sendJson(socket , {
             type : 'welcome'
         }) ; 
         socket.on('error' , console.error)
     }) ; 


       function broadCastMatchCreated(match) {
         broadcast(wss, { type: "match_created", data: match });
       }

       return { broadCastMatchCreated };
}