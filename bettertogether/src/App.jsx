import React, { useState, useEffect } from 'react';
import { useLocation, Route, Routes } from 'react-router-dom';
import { ProjectDetail, SuggestProject, Home, Profile, AboutUs, Welcome } from './pages';
import { DisplayProjects, SideBar, NavBar } from './components';

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();

  // Clear search results on path change
  useEffect(() => {
    setSearchResults([]);
  }, [location.pathname]);

  return (
    <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
      <div className="sm:flex hidden mr-10 relative">
        <SideBar />
      </div>

      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        <NavBar setSearchResults={setSearchResults} />
        <div className="mb-8">
          <DisplayProjects
            title="Результаты поиска"
            projects={searchResults}
            isLoading={false}
            isSearch={false}
          />
        </div>

        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/bettertogether" element={<Welcome />} />
          <Route path="/about_us" element={<AboutUs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/suggest-project" element={<SuggestProject />} />
          <Route path="/project-details/:title" element={<ProjectDetail />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
