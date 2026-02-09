import express from "express";
import { matchRoutes } from "./routes/matchroutes.js";
import http from 'http' ; 
import { attachWebSocketServer } from "./ws/server.js";
import { securityMiddleware } from "./arcjet.js";
import { commentaryRouter } from "./routes/commentaryRoutes.js";

const app = express() ; 

const PORT = Number(process.env.PORT || 8000)

const HOST = process.env.HOST || '0.0.0.0'


const server = http.createServer(app) ; 

app.use(express.json()) ; 

app.get('/' , (req , res)=>{
    res.send("Hello from the server") ; 
})

app.use(securityMiddleware())

app.use('/matches' , matchRoutes) ; 

app.use('/matches/:id/commentary' ,commentaryRouter)

const {broadCastMatchCreated , broadcastCommentary} = attachWebSocketServer(server)

app.locals.broadCastMatchCreated = broadCastMatchCreated

app.locals.broadcastCommentary = broadcastCommentary
 
server.listen(PORT ,HOST ,  ()=>{

  const baseURL =
    HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;


  console.log(`Server is running at ${baseURL}`);

  console.log(
    `WebSocket server is running on ${baseURL.replace("http", "ws")}/ws`,
  );
    
})