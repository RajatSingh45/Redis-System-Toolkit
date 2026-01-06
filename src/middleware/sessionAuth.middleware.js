import { getSessionServices } from "../services/session.services.js";

const sessionAuth=async(req,res,next)=>{
    try {
        const sessionId=req.headers["x-session-id"]

        if(!sessionId){
            return res.status(401).json({ message: "Session ID missing" });
        }

        const session=await getSessionServices(sessionId)

        if (!session) {
            return res.status(401).json({ message: "Invalid or expired session" });
        }

        req.sessionId=sessionId;
        req.session=session

        next()
    } catch (error) {
        console.error("Error in session authentication:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export default sessionAuth