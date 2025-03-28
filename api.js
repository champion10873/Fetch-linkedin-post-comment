const axios = require("axios");
const { UNIPILE_API_URL, UNIPILE_API_KEY, ACCOUNT_ID } = require("./config.js");

class Services {
  constructor() {
    this.unipileApi = axios.create({
      baseURL: `${UNIPILE_API_URL}/api/v1`,
      headers: {
        "X-API-KEY": UNIPILE_API_KEY,
        accept: "application/json",
        "content-type": "application/json",
      },
    });
  }

  async searchPost(postId) {
    try {
      const response = await this.unipileApi.get(
        "/posts/" + postId + "?account_id=" + ACCOUNT_ID
      );
      return response.data;
    } catch (error) {
      console.error("Error searching posts:", error.status);
      throw error;
    }
  }
}

module.exports = new Services();
