import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FundCard from './FundCard';
import { loader } from '../assets';
import { useStateContext } from '../context';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const DisplayProjects = ({ title, projects, isLoading, isSearch, isSearched, handleLoadMore, searchTerm, lastDoc }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDarkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const { user, theme } = useStateContext();

  useEffect(() => {
    if (theme === 'light') {
      setDarkMode(false);
    } else if (theme === 'dark') {
      setDarkMode(true);
    }
  }, [theme]);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setIsAdmin(userData.roles && userData.roles.includes('admin'));
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const filteredProjects = isAdmin
    ? projects 
    : projects.filter(project => project.approved); 

  const handleProjectClick = (project) => {
    navigate(`/project-details/${encodeURIComponent(project.title)}`, { state: { pId: project.pId } });
    projects = [];
  };

  return (
    <div>
      {!isLoading && filteredProjects.length === 0 && !isSearch && isSearched && (
        <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
          Ничего не найдено.
        </p>
      )}
      {isSearch && (
        <h1 className={`font-epilogue font-semibold text-[18px]${isDarkMode ? 'text-white' : 'text-black  '}  text-left`}>
          {title} ({filteredProjects.length})
        </h1>
      )}
      {!isSearch && filteredProjects.length > 0 && (
        <h1 className={`font-epilogue font-semibold text-[18px]${isDarkMode ? 'text-white' : 'text-black  '}  text-left`}>
          {title} ({filteredProjects.length})
        </h1>
      )}

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        )}

        {!isLoading && filteredProjects.length === 0 && isSearch && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            Нет проектов.
          </p>
        )}

        {!isLoading && filteredProjects.length > 0 && filteredProjects.map((project) => (
          <FundCard 
            key={project.pId || project.id} 
            {...project} 
            handleClick={() => handleProjectClick(project)} 
          />
        ))}
      </div>
      {!isLoading && filteredProjects.length > 0 && !isSearch && isSearched && lastDoc && (
        <button 
          onClick={handleLoadMore}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded"
          disabled={!lastDoc} // Disable the button if lastDoc is null
        >
          Загрузить еще
        </button>
      )}
    </div>
  );
};

export default DisplayProjects;
