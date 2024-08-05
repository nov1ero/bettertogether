import React, { useState, useEffect } from 'react';
import { useLocation, Route, Routes } from 'react-router-dom';
import { ProjectDetail, SuggestProject, Home, Profile, AboutUs, Welcome } from './pages';
import { DisplayProjects, SideBar, NavBar } from './components';
import { StateContextProvider } from './context';

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearched, setIsSearched] = useState(false); // Add isSearched state
  const location = useLocation();

  const handleSearch = () => {
    setIsSearched(true);
  };

  useEffect(() => {
    setSearchResults([]);
    setIsSearched(false); // Reset isSearched when location changes
  }, [location.pathname]);

  return (
    <StateContextProvider>
      <div className="relative sm:-8 p-4 min-h-screen flex flex-row bg-bg-color text-text-color">
        <div className="sm:flex hidden mr-10 relative">
          <SideBar />
        </div>

        <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
          <NavBar setSearchResults={setSearchResults} onSearch={handleSearch} />
          <div className="mb-8">
            <DisplayProjects
              title="Результаты поиска"
              projects={searchResults}
              isLoading={false}
              isSearch={false}
              isSearched={isSearched} // Pass isSearched to DisplayProjects
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
    </StateContextProvider>
  );
};

export default App;
