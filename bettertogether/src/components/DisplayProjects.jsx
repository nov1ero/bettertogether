import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FundCard from './FundCard';
import { loader } from '../assets';
import { useStateContext } from '../context';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const DisplayProjects = ({ title, projects, isLoading, isSearch }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { user } = useStateContext();

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

  // Filter projects based on the user's role
  const filteredProjects = isAdmin
    ? projects // Admins see all projects
    : projects.filter(project => project.approved); // Non-admins see only approved projects

  const handleProjectClick = (project) => {
    navigate(`/project-details/${encodeURIComponent(project.title)}`, { state: { pId: project.pId } });
    projects = [];
  };

  return (
    <div>
      {isSearch && (
        <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        {title} ({filteredProjects.length})
      </h1>
      )}
      {!isSearch && filteredProjects.length > 0 && (
        <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
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
    </div>
  );
};

export default DisplayProjects;
