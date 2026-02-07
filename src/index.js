import express from "express";
import { matchRoutes } from "./routes/matchroutes.js";

const app = express() ; 

const port = 8000 ; 

app.use(express.json()) ; 

app.get('/' , (req , res)=>{
    res.send("Hello from the server") ; 
})

app.use('/matches' , matchRoutes) ; 
 
app.listen(port , ()=>{
    console.log(`Server is running at http://localhost:${port}`);
    
})