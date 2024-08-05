import React, { useContext, createContext, useState, useEffect } from 'react';
import { 
  doc, 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  updateDoc, 
  getDoc, 
  setDoc, 
  where, 
  deleteDoc, 
  orderBy, 
  limit, 
  startAfter } from 'firebase/firestore';
import { provider, db } from '../../firebaseConfig';
import { 
  getAuth,
  signInWithPopup, 
  onAuthStateChanged, 
  signOut, 
  GoogleAuthProvider,
} from 'firebase/auth';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const signIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userData = {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        roles: ['user'],
      };
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, userData);
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const logOut = () => {
    signOut(auth);
  };

  const suggestProject = async (form) => {
    if (!user) {
      console.error("User is not authenticated.");
      return;
    }
    try {
      const userRef = doc(db, 'users', user.uid);
      const docRef = await addDoc(collection(db, 'projects'), {
        owner: userRef,
        title: form.title,
        description: form.description,
        phoneNumber: form.phoneNumber,
        email: form.email,
        image: form.image,
        approved: false,
        category: form.category,
      });
    } catch (error) {
      console.error("Error publishing project:", error);
    }
  };

  const getAllProjects = async () => {
    try {
      const projectQuery = query(collection(db, 'projects'));
      const querySnapshot = await getDocs(projectQuery);
      const fetchedProjects = querySnapshot.docs.map(doc => ({ ...doc.data(), pId: doc.id }));
      return fetchedProjects;
    } catch (error) {
      console.error("Error fetching all projects:", error);
      return [];
    }
  };

  const getUserProjects = async () => {
    if (!user) {
      console.error("User is not authenticated.");
      return [];
    }
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userProjectQuery = query(collection(db, 'projects'), where('owner', '==', userDocRef));
        const querySnapshot = await getDocs(userProjectQuery);
        const fetchedProjects = querySnapshot.docs.map(doc => ({ ...doc.data(), pId: doc.id }));
        return fetchedProjects;
      } else {
        console.error("User document does not exist.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching user projects:", error);
      return [];
    }
  };

  const getProjectDetails = async (pId) => {
    try {
      const docRef = doc(db, 'projects', pId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.error('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
      return null;
    }
  };

  const approveProject = async (pId) => {
    try {
      const projectDocRef = doc(db, 'projects', pId);
      await updateDoc(projectDocRef, {
        approved: true,
      });
    } catch (error) {
      console.error('Error approving project:', error);
    }
  };

  const deleteProject = async (pId) => {
    try {
      const projectDocRef = doc(db, 'projects', pId);
      await deleteDoc(projectDocRef);
      alert(`Проект с ID ${pId} успешно удален.`);
    } catch (error) {
      alert('Ошибка при удалении проекта:', error);
    }
  };

  const searchProjects = async (searchTerm, lastDoc = null, batchSize = 10) => {
    if (!searchTerm) return [];
  
    try {
      // Create the query to fetch projects
      const projectsRef = collection(db, 'projects');
      let q = query(projectsRef, orderBy('title'), limit(batchSize));
  
      // If there's a last document, start after it for pagination
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
  
      // Fetch all projects
      const querySnapshot = await getDocs(q);
  
      // Normalize search term to lowercase
      const lowerSearchTerm = searchTerm.toLowerCase();
  
      // Process results
      const results = querySnapshot.docs
        .map(doc => ({ ...doc.data(), pId: doc.id }))
        .filter(project => {
          // Normalize project title to lowercase
          const lowerTitle = project.title.toLowerCase();
          return lowerTitle.includes(lowerSearchTerm);
        });
  
      // Determine the last document for pagination
      const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
  
      return { results, newLastDoc };
    } catch (error) {
      console.error('Error searching projects:', error);
      return { results: [], newLastDoc: null };
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <StateContext.Provider
      value={{
        user,
        projects,
        searchProjects,
        deleteProject,
        approveProject,
        getProjectDetails,
        suggestProject,
        getAllProjects,
        getUserProjects,
        signIn,
        logOut,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
