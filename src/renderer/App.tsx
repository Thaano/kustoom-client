import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Test from './pages/Test';
import './App.css';
import Home from './pages/Home';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
};

export default App;
