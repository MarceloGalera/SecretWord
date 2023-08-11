import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBYgZfQ0ioKe9skIJjUMSlDvqkucx8eejA",
  authDomain: "blog-143a7.firebaseapp.com",
  projectId: "blog-143a7",
  storageBucket: "blog-143a7.appspot.com",
  messagingSenderId: "535669199980",
  appId: "1:535669199980:web:d366b30a16a62ba993b449",
  measurementId: "G-BBR454SPSQ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export { db };
