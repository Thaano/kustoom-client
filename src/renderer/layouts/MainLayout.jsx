import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Header from './Header';
import Footer from './Footer';

import 'react-toastify/dist/ReactToastify.css';

const MainLayout = ({ children }) => {
  return (
    <div className="h-full flex flex-col justify-between">
      <div className="h-full overflow-hidden">
        <Header />
        <main className="h-full px-3 py-5 md:p-5 lg:container mx-auto overflow-auto">
          {children}
        </main>
      </div>
      <ToastContainer limit={3} />
      <Footer />
    </div>
  );
};

export default MainLayout;
