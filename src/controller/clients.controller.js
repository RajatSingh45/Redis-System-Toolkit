import {
  createClientService,
  generateAndStoreApiKey,
  getClient,
  keyRotation,
} from "../services/clients.services.js";

const createClient = async (req, res) => {
  try {
    const { id, name } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Client id is required" });
    }

    const client = await createClientService({ name, id });

    const apiKey = await generateAndStoreApiKey(id);

    if (!apiKey) {
      return res
        .status(400)
        .json({ success: false, message: "Client not created" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Client created successfully",
        apiKey,
        id,
      });
  } catch (error) {
    console.log("Error during creating a new client:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const rotateKey = async (req, res) => {
  try {
    const {id} = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Client id is required" });
    }

    const newKey = await keyRotation(id);

    if (!newKey) {
      return res
        .status(400)
        .json({ success: false, message: "New key not created" });
    }

    res
      .status(200)
      .json({ success: true, message: "New key created successfully", newKey });
  } catch (error) {
    console.log("Error during rotating the key:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getClientInfo = async (req, res) => {
  try {
    const {id} = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Client id is required" });
    }

    const clientInfo = await getClient(id);

    if (!clientInfo) {
      return res
        .status(400)
        .json({ success: false, message: "Unable to fetch client info" });
    }

    res.status(200).json({ success: true, clientInfo });
  } catch (error) {
    console.log("Error during fetching client info:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export { createClient, rotateKey, getClientInfo };
