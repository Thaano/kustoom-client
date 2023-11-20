const Header = () => {
  return (
    <div className="bg-[#13151B]">
      <header className="flex flex-row align-middle px-3 py-1 md:px-5 lg:container mx-auto">
        <div className="flex items-center justify-center uppercase font-extrabold text-xl">
          KUSTOOM
          <span className="uppercase font-bold text-[10px] rounded-lg bg-gray-800 px-1 ml-1">
            when
          </span>
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
  );
};

export default Header;
