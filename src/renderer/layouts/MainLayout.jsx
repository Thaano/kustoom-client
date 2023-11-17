import { Link } from 'react-router-dom';

const MainLayout = ({ children }) => {
  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <div className="bg-[#13151B]">
          <header className="flex flex-row align-middle px-3 py-5 md:p-5 lg:container mx-auto">
            <div className="flex items-center justify-center uppercase font-extrabold text-xl">
              KUSTOOM
              <span className="uppercase font-thin text-xs">when</span>
            </div>
            <nav className="p-5">
              {/* <ul className="flex flex-row">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul> */}
            </nav>
          </header>
        </div>
        <main className="h-full px-3 py-5 md:p-5 lg:container mx-auto">
          {children}
        </main>
      </div>
      <div>
        <footer className="lg:container mx-auto">
          {/* <p className="p-5">Footer</p> */}
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
