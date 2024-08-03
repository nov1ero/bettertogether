import React, { useState, useEffect } from 'react';
import { useStateContext } from '../context';
import { DisplayProjects } from '../components';

const Home = () => {
  const { getAllProjects } = useStateContext();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const fetchedProjects = await getAllProjects();
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
      setIsLoading(false);
    };

    fetchProjects();
  }, [getAllProjects]);


  return (
    <div>
      <DisplayProjects title="Все Проекты" isLoading={isLoading} projects={projects} isSearch={true} />
    </div>
  );
};

export default Home;
