import dotenv from 'dotenv'
dotenv.config()

import app from './app.js'
import http from 'http'

const PORT=process.env.PORT||3000;

const server=http.createServer(app)

server.listen(PORT,()=>{
    console.log(`App is running on port ${PORT}`)
})