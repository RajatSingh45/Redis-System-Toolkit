import express from 'express'
import testRouter from "./src/routes/test.routes.js"
import clientsRouter from './src/routes/clients.routes.js';
import updateRourceRouter from './src/routes/updateCounter.route.js';
import sessionRouter from './src/routes/session.routes.js';
import leaderBoardRouter from './src/routes/leaderBoard.routes.js';
import jobRouter from './src/routes/jobQueue.routes.js';

const app=express()

app.use(express.json());

app.get('/health',async(req,res)=>{
    res.json({status:'ok'})
});

app.use("/test",testRouter)

// await redis.set('week0:test', 'connected');
// const value = await redis.get('week0:test');
// console.log(value);

app.use("/clients",clientsRouter)

app.use("/resource",updateRourceRouter)

app.use("/session",sessionRouter)

app.use("/leaderboard",leaderBoardRouter)

app.use("/job",jobRouter)

export default app