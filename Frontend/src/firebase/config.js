
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyBzfAp7pjK91rQOI_4skB8PdC9FZ1i_hNA",
  authDomain: "mr-fashions.firebaseapp.com",
  projectId: "mr-fashions",
  storageBucket: "mr-fashions.firebasestorage.app",
  messagingSenderId: "708925349743",
  appId: "1:708925349743:web:ea299342acb8a4e45cd29a",
  measurementId: "G-SKJ0P4RM7G"
};

const app = initializeApp(firebaseConfig);

export default app;