import express from "express";
import { matchRoutes } from "./routes/matchroutes.js";
import http from 'http' ; 
import { attachWebSocketServer } from "./ws/server.js";

const app = express() ; 

const PORT = Number(process.env.PORT || 8000)

const HOST = process.env.HOST || '0.0.0.0'


const server = http.createServer(app) ; 

app.use(express.json()) ; 

app.get('/' , (req , res)=>{
    res.send("Hello from the server") ; 
})

app.use('/matches' , matchRoutes) ; 

const {broadCastMatchCreated} = attachWebSocketServer(server)

app.locals.broadCastMatchCreated = broadCastMatchCreated
 
server.listen(PORT ,HOST ,  ()=>{

    const baseURL  = HOST === '0.0.0.0' ? `http://localhost${PORT}`: `http://${HOST}:${PORT}`


    console.log(`Server is running at http://localhost:${baseURL}`);

    console.log(`WEbSocket server is  runnning on ${baseURL.replace('http' , 'ws')}/ws`);
    


    
})