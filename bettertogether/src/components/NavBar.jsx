import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStateContext } from '../context';
import { CustomButton } from './';
import { logo, menu, search } from '../assets';
import { navlinks } from '../constants';

const Navbar = ({ setSearchResults, onSearch }) => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setDarkMode] = useState(false);
  const [results, setResults] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const { signIn, user, searchProjects, logOut, theme } = useStateContext();

  const handleSearch = async () => {
    if (searchTerm.trim() === '') return;

    const { results: searchResults, newLastDoc } = await searchProjects(searchTerm);
    setResults(searchResults);
    setLastDoc(newLastDoc);
    setSearchResults(searchResults);
    onSearch(); // Call the onSearch function
  };

  const handleLoadMore = async () => {
    if (searchTerm.trim() === '') return; // Prevent load more if input is empty

    const { results: moreResults, newLastDoc } = await searchProjects(searchTerm, lastDoc);
    setResults((prevResults) => [...prevResults, ...moreResults]);
    setLastDoc(newLastDoc);
    setSearchResults((prevResults) => [...prevResults, ...moreResults]);
  };

  const handleLogout = async () => {
    if (user) {
      try {
        await logOut();
      } catch (error) {
        console.error('Error logging out:', error);
      }
    } else {
      signIn();
    }
  };

  useEffect(() => {
    setDarkMode(theme === 'dark');
  }, [theme]);

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
      <div className={`lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] ${isDarkMode ? 'bg-[#1c1c24]' : 'bg-[#e6e6e6]'} rounded-[100px]`}>
        <input
          type="text"
          id="search"
          name="search"
          placeholder="Поиск проектов"
          className={`flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] ${isDarkMode ? 'text-white' : 'text-black'} bg-transparent outline-none`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div
          className={`w-[72px] h-full rounded-[20px] ${searchTerm.trim() === '' ? 'bg-[#b0b0b0]' : 'bg-[#4acd8d]'} flex justify-center items-center cursor-pointer ${searchTerm.trim() === '' ? 'pointer-events-none' : ''}`}
          onClick={handleSearch}
        >
          <img src={search} alt="search" className="w-[15px] h-[15px] object-contain" />
        </div>
      </div>

      <div className="sm:flex hidden flex-row justify-end gap-4">
        <CustomButton
          btnType="button"
          title={user ? 'Предложить проект' : 'войти'}
          styles={user ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
          handleClick={() => user ? navigate('suggest-project') : signIn()}
        />

        {user && user.photoURL ? (
          <Link to="/profile">
            <div className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
              <img src={user.photoURL} alt="user" className="w-[100%] h-[100%] rounded-full object-contain" />
            </div>
          </Link>
        ) : (
          <div className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
            <img src={logo} alt="default" className="w-[60%] h-[60%] object-contain" />
          </div>
        )}
      </div>

      {/* Small screen navigation */}
      <div className="sm:hidden flex justify-between items-center relative">
        <Link to="/home">
          <div className={`w-[40px] h-[40px] rounded-[10px] ${isDarkMode ? 'bg-[#2c2f32]' : 'bg-[#e6e6e6]'} flex justify-center items-center cursor-pointer`}>
            <img src={logo} alt="user" className="w-[60%] h-[60%] object-contain" />
          </div>
        </Link>

        <img
          src={menu}
          alt="menu"
          className="w-[34px] h-[34px] object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div className={`absolute top-[60px] right-0 left-0 ${isDarkMode ? 'bg-[#1c1c24]' : 'bg-[#e6e6e6]'} z-10 shadow-secondary py-4 ${!toggleDrawer ? '-translate-y-[100vh]' : 'translate-y-0'} transition-all duration-700`}>
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${isActive === link.name && 'bg-[#3a3a43]'}`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  navigate(link.link);
                  if (link.name === "Выйти") {
                    handleLogout();
                    navigate("/home");
                  }
                }}
              >
                <img
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-[24px] h-[24px] object-contain ${isActive === link.name ? 'grayscale-0' : 'grayscale'}`}
                />
                <p className={`ml-[20px] font-epilogue font-semibold text-[14px] ${isActive === link.name ? 'text-[#1dc071]' : 'text-[#808191]'}`}>
                  {link.name}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex mx-4">
            <CustomButton
              btnType="button"
              title={user ? 'Предложить проект' : 'Войти'}
              styles={user ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
              handleClick={() => user ? navigate('suggest-project') : signIn()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
