import axios from "axios";

export default class StaffApiService {
  static BASE_URL = "http://localhost:4000";

  static getHeader() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  static async getStaffByEmail(email) {
    const response = await axios.get(
      `${this.BASE_URL}/staff/getStaffByEmail/${email}`,
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

  static async getAllAppointment() {
    const response = await axios.get(
      `${this.BASE_URL}/staff/getAllAppointment`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async handleAppointmentPayment(AppointmentDTO) {
    const response = await axios.post(
      `${this.BASE_URL}/staff/handleAppointmentPayment`,
      AppointmentDTO,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }
}

// export default new ApiService();
