import {
  MemoryRouter as Router,
  Routes,
  Route,
  HashRouter,
} from 'react-router-dom';
import Home from './pages/Home';
import './App.css';

const App = () => {
  return (
    <div>
      <HashRouter>
        {/* <Router> */}
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/test" element={<Test />} /> */}
        </Routes>
        {/* </Router> */}
      </HashRouter>
    </div>
  );
};

export default App;
