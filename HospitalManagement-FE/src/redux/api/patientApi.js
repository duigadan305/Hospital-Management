import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
const PAT_URL = "/patient";

export const patientApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPatient: build.query({
      query: (email) => ({
        url: `http://localhost:4000/patient/getPatientByEmail/${email}`,
        method: "GET",
      }),
      providesTags: [tagTypes.patient],
    }),
    updatePatient: build.mutation({
      query: ({ data }) => ({
        url: `http://localhost:4000/patient/updatePatientInfo`,
        method: "PATCH",
        body: data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: [tagTypes.patient],
    }),
  }),
});

export const { useGetPatientQuery, useUpdatePatientMutation } = patientApi;
