import axios from "axios";

export default class CategoryApiService {
  static BASE_URL = process.env.REACT_APP_API_URL;

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

  static async getDoctorById(doctorRequest) {
    const response = await axios.post(
      `${this.BASE_URL}/general/getDoctorById`,
      doctorRequest
    );
    return response.data;
  }

  static async getAllReviewDoctor(doctorRequest) {
    const response = await axios.post(
      `${this.BASE_URL}/general/getAllReviewDoctor`,
      doctorRequest
    );
    return response.data;
  }

  static async getAllServices() {
    const response = await axios.get(`${this.BASE_URL}/general/allService`);
    return response.data;
  }

  static async getAllReviewContact() {
    const response = await axios.get(
      `${this.BASE_URL}/general/getAllReviewContact`
    );
    return response.data;
  }
}

// export default new ApiService();
