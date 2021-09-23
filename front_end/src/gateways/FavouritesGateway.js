import axios from "axios";
import userTokenExists, { getUserToken } from "../utils/AuthChecker";

export default class FavouritesGateway {
  /**
   * Sends a GET request for the user's favourited locations.
   */
  async get() {
    const loggedIn = userTokenExists();
    if (!loggedIn) {
      throw new Error("User should be logged in to use favourites!");
    }
  }

  async add(nodeId) {
    const loggedIn = userTokenExists();
    if (!loggedIn) {
      throw new Error("User should be logged in to use favourites!");
    }

    const response = await axios.post(
      "favourites/add_favourite",
      {
        node_id: nodeId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getUserToken()}`,
        },
      }
    );
    console.log("POST favourites/add_favourite success");

    return response.data;
  }

  /**
   * Sends a POST request to remove a location from the user's favourites.
   *
   * @param {number} nodeId
   */
  async remove(nodeId) {
    const loggedIn = userTokenExists();
    if (!loggedIn) {
      throw new Error("User should be logged in to use favourites!");
    }

    const response = await axios.post(
      "favourites/remove_favourite",
      {
        node_id: nodeId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getUserToken()}`,
        },
      }
    );

    console.log("POST favourites/remove_favourite success");
    return response.data;
  }
}
