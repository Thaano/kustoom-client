import { Link } from 'react-router-dom';

const MainLayout = ({ children }) => {
  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <div className="bg-[#13151B]">
          <header className="flex flex-row align-middle p-5 container mx-auto">
            <div className="flex items-center justify-center uppercase font-bold">
              lol teammaker
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
        <main className="h-full p-5 container mx-auto">{children}</main>
      </div>
      <div>
        <footer className="container mx-auto">
          {/* <p className="p-5">Footer</p> */}
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
