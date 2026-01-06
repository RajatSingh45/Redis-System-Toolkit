import { validateApiKey } from "../services/clients.services.js";


const clientAuth = async (req, res, next) => {
  try {
    const token = req.headers["x-api-key"];

    if (!token) {
      return res.status(400).json({ message: "Not Authenticated" });
    }

    const client = await validateApiKey(token);
    // console.log("client in middleware:",client)

    if (!client) {
      return res.status(401).json({
        error: "Invalid API key",
      });
    }

    req.client = client;

    next();
  } catch (error) {
    console.log("Error during authentication:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default clientAuth;
