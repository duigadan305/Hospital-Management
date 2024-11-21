import axios from "axios";

export default class DoctorApiService {
  static BASE_URL = "http://localhost:4000";

  static getHeader() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  static async getAppointmentByDoctorID(AppointmentDTO) {
    const response = await axios.post(
      `${this.BASE_URL}/doctor/getAppointmentByDoctorID`,
      AppointmentDTO,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getDoctorByEmail(email) {
    const response = await axios.get(
      `${this.BASE_URL}/doctor/getDoctorByEmail/${email}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async handleAppointment(AppointmentDTO) {
    const response = await axios.post(
      `${this.BASE_URL}/doctor/handleAppointment`,
      AppointmentDTO,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }
}

// export default new ApiService();
