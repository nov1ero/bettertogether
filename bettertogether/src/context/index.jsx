import React, { useContext, createContext, useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { provider, db } from '../../firebaseConfig'; // Import Firebase database instance
import { 
  getAuth,
  signInWithPopup, 
  onAuthStateChanged, 
  signInWithRedirect,
  signOut, 
  GoogleAuthProvider,
} from 'firebase/auth';



const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Track user state
  const [projects, setProjects] = useState([]); // Store retrieved projects
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []); // Update user state on authentication changes

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Handle successful sign-in   
  
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const publishProject = async (form) => {
    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        owner: user?.uid, // Use user ID as owner (check for null)
        title: form.title,
        description: form.description,
        contactInfo: form.contactInfo,
        image: form.image,
        approved: false,
        category: form.category,
      });
      console.log("Проект опубликован:", docRef.id);
    } catch (error) {
      console.error("Произошла ошибка:", error);
    }
  };

  const getProjects = async () => {
    const projectQuery = query(collection(db, 'projects'));
    const querySnapshot = await getDocs(projectQuery);
    const fetchedProjects = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      pId: doc.id, // Add unique ID for reference
    }));
    setProjects(fetchedProjects);
  };

  const getUserProjects = async () => {
    const userProjects = projects.filter((project) => project.owner === user?.uid);
    return userProjects;
  };

  useEffect(() => {
    getProjects(); // Fetch projects on component mount
  }, []);

  return (
    <StateContext.Provider
      value={{
        user,
        projects,
        publishProject,
        getProjects,
        getUserProjects,
        signIn, // Added signIn function
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
