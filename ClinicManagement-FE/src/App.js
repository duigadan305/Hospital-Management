import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./component/Home/Home";
import PrivateOutlet from "./component/Common/PrivateOutlet";
import NotFound from "./component/Common/NotFound";
import SearchDoctor from "./component/Common/SearchDoctor/SearchDoctor";
import SignInForm from "./component/Login/SignInForm";
import DoctorProfile from "./component/Common/SearchDoctor/DoctorProfile";
import Contact from "./component/Common/Contact/Contact";
import AppointmentPage from "./component/Patient/BookAppointment/AppointmentPage";
import Dashboard from "./component/Common/Dashboard/Dashboard";
import PatientProfileSetting from "./component/Patient/Dashboard/PatientProfileSetting";
import Treatment from "./component/Doctor/Treatment/Treatment";
import MyPatients from "./component/Doctor/MyPatient/MyPatients";
import PatientDetail from "./component/Doctor/MyPatient/PatientDetail";
import MedicalRecord from "./component/Doctor/MyPatient/MedicalRecord";
import PatientInvoiceDetail from "./component/Staff/Invoices/PatientInvoiceDetail";
import Invoice from "./component/Staff/Invoices/Invoice";
import PatientInvoice from "./component/Staff/Invoices/PatientInvoice";
import ChangePassword from "./component/Common/Dashboard/ChangePassword";
import Reviews from "./component/Doctor/Review/Reviews";
import MedicalRecordGeneral from "./component/Doctor/MyPatient/MedicalGeneral/MedicalRecordGeneral";
import AdminDashboard from "./component/Admin/Dashboard/AdminDashboard";
import Specialites from "./component/Admin/Specialty/Specialites";
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PrivateOutlet />}>
          {/* <Route path='/dashboard/blogs' element={<Blogs />} /> */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/my-patients" element={<MyPatients />} />
          <Route path="/dashboard/reviews/:id" element={<Reviews />} />
          <Route
            path="/dashboard/record-general/:id"
            element={<MedicalRecordGeneral />}
          />
          {/* <Route path='/dashboard/appointments' element={<Appointments />} /> */}
          {/* <Route path='/dashboard/appointments/:id' element={<ViewAppointment />} /> */}
          {/* <Route path='/dashboard/prescription' element={<Prescription />} /> */}
          <Route path="/patient-detail/:id" element={<PatientDetail />} />
          <Route path="/medical-record/:id" element={<MedicalRecord />} />
          <Route
            path="/patient-invoice-detail/:id"
            element={<PatientInvoiceDetail />}
          />
          <Route path="/appointment-invoice/:id" element={<Invoice />} />
          <Route path="/treatment/:id" element={<Treatment />} />
          {/* <Route path='/dashboard/appointment/treatment/edit/:id' element={<TreatmentEdit />} /> */}
          <Route
            path="/dashboard/change-password"
            element={<ChangePassword />}
          />
          <Route
            path="/dashboard/patient-profile"
            element={<PatientProfileSetting />}
          />
          {/* <Route path='/dashboard/favourite' element={<PatientFavouriteDoctor />} /> */}
          <Route path="/dashboard/invoices" element={<PatientInvoice />} />

          <Route path="/appointment" element={<AppointmentPage />} />
          {/* <Route path='/track-appointment' element={<TrackAppointment />} /> */}
          <Route path="/booking/:doctorId" element={<AppointmentPage />} />

          {/* <Route path='/dashboard/blogs/:id' element={<BlogsEdit />} /> */}
          {/* <Route path='/dashboard/blogs/create' element={<AddBlog />} /> */}
          {/* <Route path='/booking/success/:id' element={<BookingSuccess />} /> */}
          {/* <Route path='/booking/invoice/:id' element={<BookingInvoice />} /> */}

          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* <Route path='/admin/appointments' element={<AdminAppointments />} /> */}
          {/* <Route path='/admin/doctors' element={<Doctors />} /> */}
          {/* <Route path='/admin/patients' element={<Patients />} /> */}
          {/* <Route path='/admin/profile' element={<Profile />} /> */}
          {/* <Route path='/admin/reviews' element={<AdminReviews />} /> */}
          {/* <Route path='/admin/transaction' element={<Transactions />} /> */}
          <Route path="/admin/specialites" element={<Specialites />} />
        </Route>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignInForm />} />
        {/* <Route path="/confirm-email" element={<ConfirmEmail />} />  */}
        {/* <Route path='/blog' element={<Blog />} /> */}
        {/* <Route path='/blog/:id' element={<BlogDetails />} /> */}
        <Route path="/contact" element={<Contact />} />
        {/* <Route path='/about' element={<About />} /> */}
        {/* <Route path='/service' element={<Service />} /> */}
        {/* <Route path="/reset-password/:id" element={<ForgotPassword />} /> */}

        <Route path="/doctors" element={<SearchDoctor />} />
        <Route path="/review/:id" element={<DoctorProfile />} />
        {/* <Route path='/doctors/profile/:id' element={<DoctorProfile />} /> */}

        {/* Admin Dashboard  */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
