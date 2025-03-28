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

  async retrieveCompanyProfile(public_identifier) {
    try {
      const response = await this.unipileApi.get(
        "/linkedin/company/" + public_identifier + "?account_id=" + ACCOUNT_ID
      );
      return response.data;
    } catch (error) {
      console.error("Error retrieving company profile:", error.status);
      throw error;
    }
  }

  async retrieveMonthlyPosts(provider_id, cursor) {
    try {
      let endpoint;
      if (cursor) {
        endpoint =
          "/linkedin/search?account_id=" +
          ACCOUNT_ID +
          "&limit=50&cursor=" +
          cursor;
      } else {
        endpoint = "/linkedin/search?account_id=" + ACCOUNT_ID + "&limit=50";
      }
      const response = await this.unipileApi.post(endpoint, {
        api: "classic",
        category: "posts",
        posted_by: {
          member: [provider_id],
        },
        sort_by: "date",
        date_posted: "past_month",
      });
      return response.data;
    } catch (error) {
      console.error("Error retrieving monthly posts:", error.status);
      throw error;
    }
  }

  async retrieveCompanyMonthlyPosts(provider_id, cursor) {
    try {
      let endpoint;
      if (cursor) {
        endpoint =
          "/linkedin/search?account_id=" +
          ACCOUNT_ID +
          "&limit=50&cursor=" +
          cursor;
      } else {
        endpoint = "/linkedin/search?account_id=" + ACCOUNT_ID + "&limit=50";
      }
      const response = await this.unipileApi.post(endpoint, {
        api: "classic",
        category: "posts",
        posted_by: {
          company: [provider_id],
        },
        sort_by: "date",
        date_posted: "past_month",
      });
      return response.data;
    } catch (error) {
      console.error("Error retrieving monthly posts:", error.status);
      throw error;
    }
  }

  async retrieveComments(postId, cursor) {
    try {
      let endpoint;
      if (cursor) {
        endpoint =
          "/posts/" +
          postId +
          "/comments?account_id=" +
          ACCOUNT_ID +
          "&limit=50&cursor=" +
          cursor;
      } else {
        endpoint =
          "/posts/" +
          postId +
          "/comments?account_id=" +
          ACCOUNT_ID +
          "&limit=50";
      }
      const response = await this.unipileApi.get(endpoint);
      return response.data;
    } catch (error) {
      console.error("Error retrieving comments:", error.status);
      throw error;
    }
  }
}

module.exports = new Services();
