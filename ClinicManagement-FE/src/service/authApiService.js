import axios from "axios";

export default class authApiService {
  static BASE_URL = process.env.REACT_APP_API_URL;

  static getHeader() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  /**AUTH */

  /* This  register a new user */
  static async registerUser(registration) {
    const response = await axios.post(
      `${this.BASE_URL}/auth/register-confirm`,
      registration
    );
    return response.data;
  }

  /* TQ F321RZZ44444444444444his  login a registered user */
  static async loginUser(loginDetails) {
    const response = await axios.post(
      `${this.BASE_URL}/auth/login`,
      loginDetails
    );
    return response.data;
  }

  static async forgotPassword(loginDetails) {
    const response = await axios.post(
      `${this.BASE_URL}/auth/forgotPassword`,
      loginDetails
    );
    return response.data;
  }

  /* This  login a registered user */
  static async resetPassword(loginDetails) {
    const response = await axios.post(
      `${this.BASE_URL}/auth/resetPassword`,
      loginDetails
    );
    return response.data;
  }

  /**AUTHENTICATION CHECKER */
  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }

  static isAuthenticated() {
    const token = localStorage.getItem("token");
    return !!token;
  }

  static isAdmin() {
    const role = localStorage.getItem("role");
    return role === "ADMIN";
  }

  static isUser() {
    const role = localStorage.getItem("role");
    return role === "USER";
  }

  static async getAllUsers() {
    const response = await axios.get(`${this.BASE_URL}/users/all`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getUserProfile() {
    const response = await axios.get(
      `${this.BASE_URL}/users/getLoggedInProfileInfo`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  /* This is the  to get a single user */
  static async getUser(userId) {
    const response = await axios.get(
      `${this.BASE_URL}/users/getById/${userId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getUserByEmail(email) {
    const response = await axios.post(
      `${this.BASE_URL}/auth/findUserByEmail/${email}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }
}

// export default new ApiService();
