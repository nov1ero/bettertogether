import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

import { logo, sun } from '../assets';
import { navlinks } from '../constants';
import { useStateContext } from '../context';

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick, isDarkMode }) => {
  const iconStyles = `w-[48px] h-[48px] rounded-[10px] ${isActive && isActive === name ? (isDarkMode ? 'bg-[#2c2f32]' : 'bg-[#dcdcdc]') : 'bg-transparent'} flex justify-center items-center ${!disabled && 'cursor-pointer'} ${styles}`;
  const imgStyles = `w-1/2 h-1/2 ${isActive !== name ? 'grayscale' : ''}`;

  return (
    <div className={iconStyles} onClick={handleClick}>
      <img src={imgUrl} alt={name} className={imgStyles} />
    </div>
  );
};


const Sidebar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');
  const [isDarkMode, setDarkMode] = useState(false);
  const { user, logOut, signIn, toggleTheme, theme } = useStateContext();

  useEffect(() => {
    setDarkMode(theme === 'dark');
  }, [theme]);

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

  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      <div className={`flex justify-between items-center flex-col rounded-[7px] sticky  h-[7.5vh] ${isDarkMode ? 'bg-[#1c1c24]' : 'bg-[#e6e6e6]'}`}>
      <Link to="/home">
        <Icon styles="w-[52px] h-[52px] bg-[#2c2f32]" imgUrl={logo} />
      </Link>
      </div>
      

      <div className={`flex-1 flex flex-col justify-between items-center ${isDarkMode ? 'bg-[#1c1c24]' : 'bg-[#e6e6e6]'} rounded-[20px] w-[76px] py-4 mt-12`}>
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map((link) => (
            <Icon 
              key={link.name}
              {...link}
              isActive={isActive}
              isDarkMode={isDarkMode}
              handleClick={() => {
                if (!link.disabled) {
                  setIsActive(link.name);
                  navigate(link.link);
                }
                if (link.name === "Выйти") {
                  handleLogout();
                  navigate("/home");
                }
              }}
            />
          ))}
        </div>

        <Icon 
          styles={`bg-[#1c1c24] shadow-secondary ${isDarkMode ? '' : 'bg-[#e6e6e6]'}`} 
          imgUrl={sun} 
          handleClick={toggleTheme} 
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

export default Sidebar;
