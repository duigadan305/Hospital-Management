import axios from "axios";

export default class CategoryApiService {
  static BASE_URL = "http://localhost:4000";

  static getHeader() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  static async getAllSpecialty() {
    const response = await axios.get(
      `${this.BASE_URL}/general/allSpecialty`,
      {}
    );
    return response.data;
  }

  static async getAllDoctors(doctorRequest) {
    const response = await axios.post(
      `${this.BASE_URL}/general/allDoctors`,
      doctorRequest
    );
    return response.data;
  }
}

// export default new ApiService();
