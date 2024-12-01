import axios from "axios";

export default class PatientApiService {
  static BASE_URL = "http://localhost:4000";

  static getHeader() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
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

  static async getPatientByEmail(email) {
    const response = await axios.get(
      `${this.BASE_URL}/patient/getPatientByEmail/${email}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async updatePatientInfo(patientDTO) {
    const response = await axios.post(
      `${this.BASE_URL}/patient/updatePatientInfo`,
      patientDTO,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async sendComment(commentDTO) {
    const response = await axios.post(
      `${this.BASE_URL}/patient/sendComment`,
      commentDTO,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async bookAppointment(appointmentDTO) {
    const response = await axios.post(
      `${this.BASE_URL}/patient/bookAppointment`,
      appointmentDTO,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getAllAppointment(appointmentDTO) {
    const response = await axios.post(
      `${this.BASE_URL}/patient/getAllAppointment`,
      appointmentDTO,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getPatientById(id) {
    const response = await axios.get(
      `${this.BASE_URL}/patient/getPatientById/${id}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async changePassword(formData) {
    const response = await axios.post(
      `${this.BASE_URL}/users/changePassword`,
      formData,
      {
        headers: {
          ...this.getHeader(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }
}

// export default new ApiService();
