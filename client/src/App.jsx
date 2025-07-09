import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './Utils/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import Layout from './components/Layout';
import Home from './Pages/Home';
import About from './Pages/About';
import Donate from './Pages/Donate';
import Volunteer from './Pages/Volunteer';
import Projects from './pages/Projects';
import Blog from './Pages/Blog';
import Contact from './Pages/Contact';



// Admin pages
import AdminLogin from './Pages/AdminLogin';
import AdminDashboard from './Pages/AdminDashboard';
import AdminRoute from './Utils/AdminRoute';
import AdminHome from './Pages/admin/AdminHome';
import AdminAbout from './Pages/admin/AdminAbout';
import AdminDonate from './Pages/admin/AdminDonate';
import AdminVolunteer from './Pages/admin/AdminVolunteer';
import AdminProjects from './Pages/admin/AdminProjects';
import AdminBlog from './Pages/admin/AdminBlog';
import AdminContact from './Pages/admin/AdminContact';

function App() {
  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
      <ScrollToTop />
      <Routes>
        {/* Public layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="donate" element={<Donate />} />
          <Route path="volunteer" element={<Volunteer />} />
          <Route path="projects" element={<Projects />} />
          <Route path="blog" element={<Blog />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>}/>
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/about" element={<AdminRoute><AdminAbout /></AdminRoute>} />
        <Route path="/admin/donate" element={<AdminRoute><AdminDonate /></AdminRoute>} />
        <Route path="/admin/volunteer" element={<AdminRoute><AdminVolunteer /></AdminRoute>} />
        <Route path="/admin/Projects" element={<AdminRoute><AdminProjects /></AdminRoute>} />
        <Route path="/admin/blog" element={<AdminBlog />} />
        <Route path="/admin/contact" element={<AdminRoute><AdminContact /></AdminRoute>} />

      </Routes>
    </>
  );
}

export default App;