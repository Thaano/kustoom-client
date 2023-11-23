import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Header from './Header';
import Footer from './Footer';

import 'react-toastify/dist/ReactToastify.css';

const MainLayout = ({ children }) => {
  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <Header />
        <main className="h-full px-3 py-5 md:p-5 lg:container mx-auto">
          {children}
        </main>
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default MainLayout;
