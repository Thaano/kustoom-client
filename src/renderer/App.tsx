import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Hello from './pages/Hello';
import Test from './pages/Test';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
};

export default App;
