import axios from "axios";

export default class AdminApiService {
  static BASE_URL = "http://localhost:4000";

  static getHeader() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  static async getAllPatient() {
    const response = await axios.get(`${this.BASE_URL}/admin/getAllPatient`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getAllBill() {
    const response = await axios.get(`${this.BASE_URL}/admin/getAllBill`, {
      headers: this.getHeader(),
    });
    return response.data;
  }
}

// export default new ApiService();
