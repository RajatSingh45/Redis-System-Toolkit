import express from 'express'
import { createSession, deleteSession, getSession } from '../controller/session.controller.js'
import sessionAuth from '../middleware/sessionAuth.middleware.js';
const sessionRouter=express.Router()

sessionRouter.post("/create",createSession)
sessionRouter.get("/get",sessionAuth,getSession)
sessionRouter.delete("/delete",sessionAuth,deleteSession)

export default sessionRouter