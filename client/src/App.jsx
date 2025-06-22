import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './Utils/ScrollToTop';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Donate from './pages/Donate';
import Volunteer from './pages/Volunteer';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import Contact from './pages/Contact';



// Admin pages
import AdminLogin from './Pages/AdminLogin';
import AdminDashboard from './Pages/AdminDashboard';
import AdminRoute from './Utils/AdminRoute';
import AdminHome from './Pages/admin/AdminHome';
import AdminAbout from './Pages/admin/AdminAbout';
import AdminDonate from './Pages/admin/AdminDonate';

function App() {
  return (
    <>
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


      </Routes>
    </>
  );
}

export default App;
