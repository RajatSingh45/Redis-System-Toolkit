import { createSessionService, deleteSessionService } from "../services/session.services.js";

const createSession = async (req, res) => {
  try {
    const { userId, email, name } = req.body;

    if (!userId || !email || !name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const sessionId = await createSessionService({ userId, email, name });

    res.status(200).json({
      success: true,
      message: "Session created successfully",
      sessionId,
    });
  } catch (error) {
    console.log("Error during creating new session:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getSession = async (req, res) => {
  try {
    if (!req.session) {
      return res.status(401).json({
        success: false,
        message: "No active session",
      });
    }
    res.status(200).json({
      success: true,
      session: req.session,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteSession = async (req, res) => {
  try {
    await deleteSessionService(req.sessionId);
    res.status(200).json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export { createSession, getSession, deleteSession };
