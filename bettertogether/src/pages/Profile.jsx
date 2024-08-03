import React, { useState, useEffect } from 'react';

import { DisplayProjects } from '../components';
import { useStateContext } from '../context';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  const { user, getUserProjects } = useStateContext();

  const fetchProjects = async () => {
    setIsLoading(true);
    const data = await getUserProjects();
    setProjects(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

  return (
    <DisplayProjects 
      title="Ваши проекты"
      isLoading={isLoading}
      projects={projects}
      isSearch={true}
    />
  );
};

export default Profile;
