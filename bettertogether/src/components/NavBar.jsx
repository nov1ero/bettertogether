import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStateContext } from '../context';
import { CustomButton } from './';
import { logo, menu, search, sun } from '../assets';
import { navlinks } from '../constants';

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick, isDarkMode }) => {
  const iconStyles = `w-[48px] h-[48px] rounded-[10px] ${isActive && isActive === name ? (isDarkMode ? 'bg-[#2c2f32]' : 'bg-[#dcdcdc]') : 'bg-transparent'} flex justify-center items-center ${!disabled && 'cursor-pointer'} ${styles}`;
  const imgStyles = `w-1/2 h-1/2 ${isActive !== name ? 'grayscale' : ''}`;

  return (
    <div className={iconStyles} onClick={handleClick}>
      <img src={imgUrl} alt={name} className={imgStyles} />
    </div>
  );
};

const Navbar = ({ setSearchResults, setSearchTerm, onSearch, setLastDoc }) => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [isDarkMode, setDarkMode] = useState(false);
  const [results, setResults] = useState([]);
  const [lastDoc, setLocalLastDoc] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState({});
  const [categoryNames, setCategoryNames] = useState([]);
  const { signIn, user, searchProjects, logOut, theme, getSingleCategory, toggleTheme } = useStateContext();

  const categoriesRef = useRef(null);

  const handleSearchButtonState = () => {
    const isSearchTermEmpty = localSearchTerm.trim() === '';
    const areCategoriesEmpty = categoryNames.length === 0;

    return isSearchTermEmpty && areCategoriesEmpty;
  };

  const handleSearch = async () => {
    if (localSearchTerm.trim() === '' && categoryNames.length === 0) return;

    const { results: searchResults, newLastDoc } = await searchProjects(localSearchTerm, categoryNames);
    setResults(searchResults);
    setLocalLastDoc(newLastDoc);
    setLastDoc(newLastDoc);
    setSearchResults(searchResults);
    setSearchTerm(localSearchTerm);
    onSearch();
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

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    setSelectedCategories(prev => {
      const newCategories = { ...prev };
      if (checked) {
        newCategories[name] = true;
      } else {
        delete newCategories[name];
      }
      return newCategories;
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && localSearchTerm.trim() !== '') {
      handleSearch();
    }
  };

  useEffect(() => {
    setDarkMode(theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setShowCategories(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      const categoryData = await getSingleCategory();

      if (categoryData) {
        const options = Object.keys(categoryData)
          .filter(key => key !== 'id')
          .map(key => ({
            value: key,
            label: categoryData[key]
          }))
          .sort((a, b) => (a.label === 'Другое' ? 1 : b.label === 'Другое' ? -1 : 0));
        setCategoryOptions(options);
      }
    };

    fetchCategory();
  }, [getSingleCategory]);

  useEffect(() => {
    setCategoryNames(Object.keys(selectedCategories).filter(key => selectedCategories[key]));
  }, [selectedCategories]);

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6 relative">
      <div className={`lg:flex-1 flex flex-col max-w-[458px] ${isDarkMode ? 'bg-[#1c1c24]' : 'bg-[#e6e6e6]'} rounded-[20px] p-4 relative`}>
        <div className={`flex flex-row py-2 pl-4 pr-2 h-[52px] ${isDarkMode ? 'bg-[#1c1c24]' : 'bg-[#e6e6e6]'} rounded-[100px]`}>
          <input
            type="text"
            id="search"
            name="search"
            placeholder="Поиск проектов"
            className={`flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] ${isDarkMode ? 'text-white' : 'text-black'} bg-transparent outline-none`}
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowCategories(true)}
          />
          <div
            className={`w-[72px] h-full rounded-[20px] ${handleSearchButtonState() ? 'bg-[#b0b0b0]' : 'bg-[#4acd8d]'} flex justify-center items-center cursor-pointer ${handleSearchButtonState() ? 'pointer-events-none' : ''}`}
            onClick={handleSearch}
          >
            <img src={search} alt="search" className="w-[15px] h-[15px] object-contain" />
          </div>
        </div>
        {showCategories && (
          <div ref={categoriesRef} className={`absolute top-full left-0 right-0 mt-2 ${isDarkMode ? 'bg-[#1c1c24]' : 'bg-[#e6e6e6]'} p-2 rounded-md shadow-md z-10`}>
            {categoryOptions.map((option) => (
              <label key={option.value} className="block">
                <input
                  type="checkbox"
                  name={option.value}
                  checked={selectedCategories[option.value] || false}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                {option.label}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="sm:flex hidden flex-row justify-end gap-4">
        <CustomButton
          btnType="button"
          title={user ? 'Предложить проект' : 'войти'}
          styles={user ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
          handleClick={() => user ? navigate('suggest-project') : signIn()}
        />

        {user && user.photoURL ? (
          <Link to="/bettertogether/profile">
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

      <div className="sm:hidden flex justify-between items-center relative">
        <Link to="/bettertogether/home">
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
                    navigate("/bettertogether/home");
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
            <Icon 
              styles={`ml-[100px] mr-[20px] bg-[#1c1c24] shadow-secondary ${isDarkMode ? '' : 'bg-[#e6e6e6]'}`} 
              imgUrl={sun} 
              handleClick={toggleTheme} 
              isDarkMode={isDarkMode}
            />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Navbar;
