import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layout';
import Home from './page';
import About from './about/page';
import Services from './services/page';
import Gallery from './gallery/page';
import Pricing from './pricing/page';
import Contact from './contact/page';
import Consultation from './consultation/page';
import Quote from './quote/page';
import Admin from './admin/page';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/quote" element={<Quote />} />
        </Route>
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
