import {
  addOrUpdateUser,
  getTopScoreUser,
  getUserRank,
  getUserScore,
  leaderboardPage,
  removeUser,
  resetLeaderBoard,
} from "../services/leaderBoard.services.js";

const postScore = async (req, res) => {
  try {
    const { userId, score } = req.body;

    if (!userId || !score) {
      return res.status(400).json({
        success: false,
        message: "Provide all details",
      });
    }

    const newScore = await addOrUpdateUser(userId, score);

    if (!newScore) {
      return res.status(400).json({
        success: false,
        message: "New score is not added or updated",
      });
    }

    res.status(200).json({
      success: true,
      message: "New score is added or updated",
      newScore:score,
    });
  } catch (error) {
    console.log("Error during adding or updating new score:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getScore = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Provide all details",
      });
    }

    const score = await getUserScore(userId);

    if (!score) {
      return res.status(400).json({
        success: false,
        message: "Score not available",
      });
    }

    res.status(200).json({
      success: true,
      score,
    });
  } catch (error) {
    console.log("Error during fetching score:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getRank = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Provide all details",
      });
    }

    const rank = await getUserRank(userId);

    if (!rank) {
      return res.status(400).json({
        success: false,
        message: "Rank is not available",
      });
    }

    res.status(200).json({
      success: true,
      UserRank: rank,
    });
  } catch (error) {
    console.log("Error during fetching rank:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const topScore = async (req, res) => {
  try {
    const limit = Number(req.query.limit || 10);

    const rawTopScores = await getTopScoreUser(limit);

    if (!rawTopScores || rawTopScores.length === 0) {
      return res.status(200).json({
        success: true,
        topScores: [],
      });
    }

    let topScores = [];
    for (let i = 0; i < rawTopScores.length; i += 2) {
      topScores.push({ userId: rawTopScores[i], score: Number(rawTopScores[i + 1]) });
    }

    res.status(200).json({
      success: true,
      topScores,
    });
  } catch (error) {
    console.log("Error during fetching top scores:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const paginatedLeaderboard = async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const size = Number(req.query.size || 10);

    const rawData = await leaderboardPage(page, size);

    if (!rawData || rawData.length === 0) {
      return res.status(200).json({
        success: true,
        page,
        size,
        data: [],
      });
    }

    let data = [];
    for (let i = 0; i < rawData.length; i += 2) {
      data.push({ userId: rawData[i], score: Number(rawData[i + 1]) });
    }

    res.status(200).json({
      success: true,
      page,
      size,
      data,
    });
  } catch (error) {
    console.log("Error during fetching paginated leaderboard:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    await removeUser(req.params.userId);

    res.status(200).json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    console.log("Error during deleting user:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const resetBoard = async (req, res) => {
  try {
    await resetLeaderBoard();

    res.status(200).json({
      message: "Leaderboard reset successful",
    });
  } catch (error) {
    console.log("Error during reset leaderboard:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export {postScore,getScore,getRank,topScore,paginatedLeaderboard,deleteUser,resetBoard}