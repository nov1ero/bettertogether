import React, { useContext, createContext, useState, useEffect } from 'react';
import { doc, collection, getDocs, addDoc, query, updateDoc, getDoc, setDoc, where, deleteDoc } from 'firebase/firestore';
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
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
  
    try {
      console.log("Initiating sign-in...");
      const result = await signInWithPopup(auth, provider);
      console.log("Sign-in result:", result);
  
      const user = result.user;
      const userData = {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        roles: ['user'],
      };
  
      // Reference to the user document
      const userDocRef = doc(db, 'users', user.uid);
  
      // Check if user document exists
      const userDoc = await getDoc(userDocRef);
  
      if (!userDoc.exists()) {
        // If the document does not exist, create it
        await setDoc(userDocRef, userData);
        console.log("User data saved:", userData);
      } else {
        console.log("User already exists in the database.");
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
      // Create a reference to the user document
      const userRef = doc(db, 'users', user.uid);
  
      // Add the project with the user reference
      const docRef = await addDoc(collection(db, 'projects'), {
        owner: userRef, // Store the reference instead of the user ID
        title: form.title,
        description: form.description,
        phoneNumber: form.phoneNumber,
        email: form.email,
        image: form.image,
        approved: false,
        category: form.category,
      });
  
      console.log('Project added with ID:', docRef.id);
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
      // Reference to the current user's document
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
  
      // If user document exists, proceed with fetching projects
      if (userDoc.exists()) {
        // Query projects where the 'owner' field references the current user's document
        const userProjectQuery = query(
          collection(db, 'projects'),
          where('owner', '==', userDocRef)
        );
        
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
      // Reference to the project document
      const projectDocRef = doc(db, 'projects', pId);
      
      // Delete the project document
      await deleteDoc(projectDocRef);
      
      alert(`Проект с ID ${pId} успешно удален.`);
    } catch (error) {
      alert('Ошибка при удалении проекта:', error);
    }
  };

  const searchProjects = async (searchTerm) => {
    if (!searchTerm) return [];
  
    try {
      // Define your query to search across different fields
      const q = query(collection(db, 'projects'), where('title', '>=', searchTerm), where('title', '<=', searchTerm + '\uf8ff'));
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({ ...doc.data(), pId: doc.id }));
      return results;
    } catch (error) {
      console.error('Error searching projects:', error);
      return [];
    }
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
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
