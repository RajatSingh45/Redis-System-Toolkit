import { enqueue, getJobStatus } from "../services/jobQueue.services.js";

const createJob = async (req, res) => {
  try {
    const payload = req.body;

    if (!payload) {
      return res.status(400).json({
        success: false,
        message: "Provide all details",
      });
    }

    const id = await enqueue(payload);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id not generated",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job created successfully",
      jobId: id,
    });
  } catch (error) {
    console.log("Error during creating job");
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

const jobStatus = async (req, res) => {
  try {
    const id = req.params.id;

    const status = await getJobStatus(id);

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status not fetched",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Status fetched successfully",
      job: status,
    });
  } catch (error) {
    console.log("Error during fetching job status");
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

export {createJob,jobStatus}
