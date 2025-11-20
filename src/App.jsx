import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HeaderComponent from './components/templates/HeaderComponent';
import FooterComponent from './components/templates/FooterComponent';
import ListMahasiswa from './components/Mahasiswa/ListMahasiswa';
import AddMahasiswa from './components/Mahasiswa/AddMahasiswa';
import ListSpp from './components/Spp/ListSpp';
import AddSpp from './components/Spp/AddSpp';


function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <HeaderComponent />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/list-mahasiswa" element={<ListMahasiswa/>} />
            <Route path="/add-mahasiswa" element={<AddMahasiswa />} />
            <Route path="/" element={<ListSpp />} />
            <Route path="/add-spp" element={<AddSpp />} />
          </Routes>
        </div>
        <FooterComponent />
      </div>
    </Router>
  );
}

export default App;