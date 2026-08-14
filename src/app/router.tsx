import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "../components/Layout";
import { HomePage } from "../pages/HomePage";
import { MedicalHubPage } from "../pages/MedicalHubPage";
import { AutismHubPage } from "../pages/AutismHubPage";
import { DoctorsPage } from "../pages/DoctorsPage";
import { DoctorDetailPage } from "../pages/DoctorDetailPage";
import { DepartmentsPage } from "../pages/DepartmentsPage";
import { DepartmentDetailPage } from "../pages/DepartmentDetailPage";
import { AppointmentPage } from "../pages/AppointmentPage";
import { AmbulancePage } from "../pages/AmbulancePage";
import { PackagesPage } from "../pages/PackagesPage";
import { DiagnosticsPage } from "../pages/DiagnosticsPage";
import { TherapyPage } from "../pages/TherapyPage";
import { TherapyDetailPage } from "../pages/TherapyDetailPage";
import { ProgramsPage } from "../pages/ProgramsPage";
import { ProgramDetailPage } from "../pages/ProgramDetailPage";
import { AdmissionsPage } from "../pages/AdmissionsPage";
import { AssessmentPage } from "../pages/AssessmentPage";
import { ActivitiesPage } from "../pages/ActivitiesPage";
import { AboutPage } from "../pages/AboutPage";
import { ContactPage } from "../pages/ContactPage";
import { FaqPage } from "../pages/FaqPage";
import { TeamPage } from "../pages/TeamPage";
import { GalleryPage } from "../pages/GalleryPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { AdminLayout } from "../admin/AdminLayout";
import { AdminLoginPage } from "../admin/AdminLoginPage";
import { RequireAdmin } from "../admin/RequireAdmin";
import { AdminDashboardPage } from "../admin/AdminDashboardPage";
import { AdminRequestsPage } from "../admin/AdminRequestsPage";
import { AdminDoctorsPage } from "../admin/AdminDoctorsPage";
import { AdminDepartmentsPage } from "../admin/AdminDepartmentsPage";
import { AdminTherapiesPage } from "../admin/AdminTherapiesPage";
import { AdminProgramsPage } from "../admin/AdminProgramsPage";
import { AdminFaqsPage } from "../admin/AdminFaqsPage";
import { AdminSettingsPage } from "../admin/AdminSettingsPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="requests" element={<AdminRequestsPage />} />
          <Route path="doctors" element={<AdminDoctorsPage />} />
          <Route path="departments" element={<AdminDepartmentsPage />} />
          <Route path="therapies" element={<AdminTherapiesPage />} />
          <Route path="programs" element={<AdminProgramsPage />} />
          <Route path="faqs" element={<AdminFaqsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="*" element={<p className="admin-page">Admin page not found.</p>} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/en" replace />} />
      <Route path="/:lang" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="medical" element={<MedicalHubPage />} />
        <Route path="autism" element={<AutismHubPage />} />
        <Route path="doctors" element={<DoctorsPage />} />
        <Route path="doctors/:slug" element={<DoctorDetailPage />} />
        <Route path="departments" element={<DepartmentsPage />} />
        <Route path="departments/:slug" element={<DepartmentDetailPage />} />
        <Route path="appointment" element={<AppointmentPage />} />
        <Route path="ambulance" element={<AmbulancePage />} />
        <Route path="packages" element={<PackagesPage />} />
        <Route path="diagnostics" element={<DiagnosticsPage />} />
        <Route path="therapy" element={<TherapyPage />} />
        <Route path="therapy/:slug" element={<TherapyDetailPage />} />
        <Route path="programs" element={<ProgramsPage />} />
        <Route path="programs/:slug" element={<ProgramDetailPage />} />
        <Route path="admissions" element={<AdmissionsPage />} />
        <Route path="assessment" element={<AssessmentPage />} />
        <Route path="activities" element={<ActivitiesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/en" replace />} />
    </Routes>
  );
}
