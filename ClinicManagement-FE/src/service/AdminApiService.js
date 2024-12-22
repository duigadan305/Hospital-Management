import axios from "axios";

export default class AdminApiService {
  static BASE_URL = process.env.REACT_APP_API_URL;

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

  static async addSpecialty(specialtyDTO) {
    const response = await axios.post(
      `${this.BASE_URL}/admin/addSpecialty`,
      specialtyDTO,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async updateSpecialty(specialtyDTO) {
    const response = await axios.put(
      `${this.BASE_URL}/admin/updateSpecialty`,
      specialtyDTO,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async deleteSpecialty(id) {
    const response = await axios.delete(
      `${this.BASE_URL}/admin/deleteSpecialty/${id}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async addService(examServiceDTO) {
    const response = await axios.post(
      `${this.BASE_URL}/admin/addService`,
      examServiceDTO,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async updateService(examServiceDTO) {
    const response = await axios.put(
      `${this.BASE_URL}/admin/updateService`,
      examServiceDTO,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async deleteService(id) {
    const response = await axios.delete(
      `${this.BASE_URL}/admin/deleteService/${id}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getAllUser() {
    const response = await axios.get(`${this.BASE_URL}/admin/getAllUser`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async addUser(userDTO) {
    const response = await axios.post(
      `${this.BASE_URL}/admin/addUser`,
      userDTO,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async deleteUser(id) {
    const response = await axios.delete(
      `${this.BASE_URL}/admin/deleteUser/${id}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async updateDoctorInfor(doctorDTO) {
    const response = await axios.put(
      `${this.BASE_URL}/admin/updateDoctorInfor`,
      doctorDTO,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async updateEmployeeInfor(EmployeeDTO) {
    const response = await axios.put(
      `${this.BASE_URL}/admin/updateEmployeeInfor`,
      EmployeeDTO,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getPatientsByCondition(patientDTO) {
    const response = await axios.post(
      `${this.BASE_URL}/admin/getPatientsByCondition`,
      patientDTO,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getEmployeeByCondition(EmployeeDTO) {
    const response = await axios.post(
      `${this.BASE_URL}/admin/getEmployeeByCondition`,
      EmployeeDTO,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getAllReviewContact() {
    const response = await axios.get(
      `${this.BASE_URL}/admin/getAllReviewContact`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getAllDoctorReview(doctorDTO) {
    const response = await axios.post(
      `${this.BASE_URL}/admin/getAllDoctorReview`,
      doctorDTO,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async deleteComment(id) {
    const response = await axios.delete(
      `${this.BASE_URL}/admin/deleteComment/${id}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }
}

// export default new ApiService();
