import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDot-qLrGIUWT128ISJ_6inz-PCPqWTRaQ",
    authDomain: "password-manager-c8777.firebaseapp.com",
    projectId: "password-manager-c8777",
    storageBucket: "password-manager-c8777.appspot.com",
    messagingSenderId: "861504170376",
    appId: "1:861504170376:web:0ecd9f00b853e28968323d",
    measurementId: "G-D8MC8MDQ6P"
};  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  
  export { app, db, auth };