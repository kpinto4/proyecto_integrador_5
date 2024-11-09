import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Inicio from './pages/inicio';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
      </Routes>
    </Router>
  );
}

export default App;

