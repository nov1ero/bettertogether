  // Import the functions you need from the SDKs you need
  import { initializeApp } from "firebase/app";
  import { getAnalytics } from "firebase/analytics";
  import {getAuth,GoogleAuthProvider} from "firebase/auth";
  import { getFirestore } from 'firebase/firestore';

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBnnGKuKPkrGhgpPXAzbM8_FCVvqR4DEZU",
    authDomain: "bettertogether-ce2fe.firebaseapp.com",
    databaseURL: "https://bettertogether-ce2fe-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bettertogether-ce2fe",
    storageBucket: "bettertogether-ce2fe.appspot.com",
    messagingSenderId: "330549507627",
    appId: "1:330549507627:web:9199da2de6a29a67261c6e",
    measurementId: "G-8FBG84R179"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth(app)
  const provider = new GoogleAuthProvider();
  const db = getFirestore(app);
  export {app,auth,provider,db};