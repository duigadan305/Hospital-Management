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

  static async getTreatmentDetail(id) {
    const response = await axios.get(
      `${this.BASE_URL}/doctor/getTreatmentDetail/${id}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async treatAppointmentStep1(TreatmentDetailDTO) {
    const response = await axios.post(
      `${this.BASE_URL}/doctor/treatAppointmentStep1`,
      TreatmentDetailDTO,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async treatAppointmentStep2(TreatmentDetailDTO) {
    const response = await axios.post(
      `${this.BASE_URL}/doctor/treatAppointmentStep2`,
      TreatmentDetailDTO,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async treatAppointmentServiceStep1(TreatmentServiceDTO) {
    const response = await axios.post(
      `${this.BASE_URL}/doctor/treatAppointmentServiceStep1`,
      TreatmentServiceDTO,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async treatAppointmentServiceStep2(formData) {
    const response = await axios.post(
      `${this.BASE_URL}/doctor/treatAppointmentServiceStep2`,
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

  static async getTreatmentService(id) {
    const response = await axios.get(
      `${this.BASE_URL}/doctor/getTreatmentService/${id}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async treatAppointmentPresciption(PrescriptionDTO) {
    const response = await axios.post(
      `${this.BASE_URL}/doctor/treatAppointmentPrescription`,
      PrescriptionDTO,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getAppointmentById(id) {
    const response = await axios.get(
      `${this.BASE_URL}/doctor/getAppointmentById/${id}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getAllTreatedPatient() {
    const response = await axios.get(
      `${this.BASE_URL}/doctor/getAllTreatedPatient`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getAppointmentByPatientAndStatus(AppointmentDTO) {
    const response = await axios.post(
      `${this.BASE_URL}/doctor/getAppointmentByPatientAndStatus`,
      AppointmentDTO,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getMedicalRecord(id) {
    const response = await axios.get(
      `${this.BASE_URL}/doctor/getMedicalRecord/${id}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getDrugAllergyByPatientId(id) {
    const response = await axios.get(
      `${this.BASE_URL}/doctor/getDrugAllergyByPatientId/${id}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }
}

// export default new ApiService();
