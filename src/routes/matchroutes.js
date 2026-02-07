import { Router } from "express";
import { createMatchSchem, listMatchesQuerySchema } from "../validation/matches.js";
import { matches } from "../db/schema.js";
import { db } from "../db/db.js";
import { getMatchStatus } from "../utils/match-status.js";
import { desc } from "drizzle-orm";


export const matchRoutes = Router() ; 

const MAX_LIMIT = 100 ; 

matchRoutes.get('/' , async(req , res)=>{

    const parsed = listMatchesQuerySchema.safeParse(req.query) ; 

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid Payload",
        details: JSON.stringify(parsed.error),
      });
    }

    const limit  = Math.min(parsed.data.limit ?? 50 , MAX_LIMIT) ;

    try {
        const data = await db.select().from(matches).orderBy(desc(matches.createdAt)).limit(limit) ; 
         res.status(200).json({ data }); 
    } catch (error) {
         return res.status(500).json({
           error: "Failed to get the matches",
           details: error.message,
         });
    }

   
})

matchRoutes.route('/').post(async (req , res)=>{
    const parsed  = createMatchSchem.safeParse(req.body) ; 
    if(!parsed.success){
        return res.status(400).json({
            error : 'Invalid Payload' , 
            details : JSON.stringify(parsed.error)
            
        })
    }

        try {
          const [event] = await db
            .insert(matches)
            .values({
              ...parsed.data,
              startTime: new Date(parsed.data.startTime),
              endTime: new Date(parsed.data.endTime),
              homeScore: parsed.data.homeScore ?? 0,
              awayScore: parsed.data.awayScore ?? 0,
              status: getMatchStatus(
                parsed.data.startTime,
                parsed.data.endTime,
              ),
            })
            .returning(); 
            
            if(res.app.locals.broadCastMatchCreated){
              res.app.locals.broadCastMatchCreated(event) ; 
            }
          res.status(201).json({data : event})
        } catch (error) {
            return res.status(500).json({
              error: "Failed to create the match",
              details: error.message,
            });
        }
    
})