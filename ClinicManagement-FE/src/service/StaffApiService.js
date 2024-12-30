import axios from "axios";

export default class StaffApiService {
  static BASE_URL = process.env.REACT_APP_API_URL;

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

  static async addAppointmentBill(AppointmentBillDTO) {
    const response = await axios.post(
      `${this.BASE_URL}/staff/addAppointmentBill`,
      AppointmentBillDTO,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async addAppointment(AppointmentDTO) {
    const response = await axios.post(
      `${this.BASE_URL}/staff/addAppointment`,
      AppointmentDTO,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }
}

// export default new ApiService();
