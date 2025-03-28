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

  async retrieveProfile(public_identifier) {
    try {
      const response = await this.unipileApi.get(
        "/users/" + public_identifier + "?account_id=" + ACCOUNT_ID
      );
      return response.data;
    } catch (error) {
      console.error("Error retrieving profile:", error.status);
      throw error;
    }
  }

  async retrieveMonthlyPosts(provider_id, cursor) {
    try {
      if (cursor) {
        const response = await this.unipileApi.post(
          "/linkedin/search?account_id=" +
            ACCOUNT_ID +
            "&limit=50&cursor=" +
            cursor,
          {
            api: "classic",
            category: "posts",
            posted_by: {
              member: [provider_id],
            },
            sort_by: "date",
            date_posted: "past_month",
          }
        );
        return response.data;
      } else {
        const response = await this.unipileApi.post(
          "/linkedin/search?account_id=" + ACCOUNT_ID + "&limit=50",
          {
            api: "classic",
            category: "posts",
            posted_by: {
              member: [provider_id],
            },
            sort_by: "date",
            date_posted: "past_month",
          }
        );
        return response.data;
      }
    } catch (error) {
      console.error("Error retrieving monthly posts:", error.status);
      throw error;
    }
  }

  async retrieveComments(postId, cursor) {
    try {
      if (cursor) {
        const response = await this.unipileApi.get(
          "/posts/" +
            postId +
            "/comments?account_id=" +
            ACCOUNT_ID +
            "&limit=50&cursor=" +
            cursor
        );
        return response.data;
      } else {
        const response = await this.unipileApi.get(
          "/posts/" +
            postId +
            "/comments?account_id=" +
            ACCOUNT_ID +
            "&limit=50"
        );
        return response.data;
      }
    } catch (error) {
      console.error("Error retrieving comments:", error.status);
      throw error;
    }
  }
}

module.exports = new Services();
