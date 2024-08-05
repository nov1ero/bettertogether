import React, { useState, useEffect } from 'react';
import { useLocation, Route, Routes } from 'react-router-dom';
import { ProjectDetail, SuggestProject, Home, Profile, AboutUs, Welcome } from './pages';
import { DisplayProjects, SideBar, NavBar } from './components';
import { StateContextProvider, useStateContext } from './context';

const App = () => {
  const { searchProjects } = useStateContext();
  const [searchResults, setSearchResults] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const location = useLocation();

  const handleSearch = () => {
    setIsSearched(true);
  };

  const handleLoadMore = async () => {
    if (!searchResults.length || searchTerm.trim() === '') return; // Prevent load more if no search results or searchTerm is empty

    const { results: moreResults, newLastDoc } = await searchProjects(searchTerm, selectedCategories, lastDoc);
    setSearchResults((prevResults) => [...prevResults, ...moreResults]);
    setLastDoc(newLastDoc);
  };

  useEffect(() => {
    setSearchResults([]);
    setIsSearched(false);
  }, [location.pathname]);

  return (
    <StateContextProvider>
      <div className="relative sm:-8 p-4 min-h-screen flex flex-row bg-bg-color text-text-color">
        <div className="sm:flex hidden mr-10 relative">
          <SideBar />
        </div>

        <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
          <NavBar
            setSearchResults={setSearchResults}
            setSearchTerm={setSearchTerm}
            onSearch={handleSearch}
            setLastDoc={setLastDoc}
            setSelectedCategories={setSelectedCategories} // Pass setSelectedCategories to NavBar
          />
          <div className="mb-8">
            <DisplayProjects
              title="Результаты поиска"
              projects={searchResults}
              isLoading={false}
              isSearch={false}
              isSearched={isSearched}
              searchTerm={searchTerm}
              handleLoadMore={handleLoadMore}
              lastDoc={lastDoc}
            />
          </div>

          <Routes>
            <Route path="/bettertogether/home" element={<Home />} />
            <Route path="/bettertogether" element={<Welcome />} />
            <Route path="/bettertogether/about_us" element={<AboutUs />} />
            <Route path="/bettertogether/profile" element={<Profile />} />
            <Route path="/bettertogether/suggest-project" element={<SuggestProject />} />
            <Route path="/bettertogether/project-details/:title" element={<ProjectDetail />} />
          </Routes>
        </div>
      </div>
    </StateContextProvider>
  );
};

export default App;
  