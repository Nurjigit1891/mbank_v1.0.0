import { initializeApp } from "firebase/app";
import { getFirestore, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCyQDG8Y6jDtcb0tBESHceD8VG2DqmC4ns",
  authDomain: "key-store-01.firebaseapp.com",
  projectId: "key-store-01",
  storageBucket: "key-store-01.appspot.com",
  messagingSenderId: "399274375844",
  appId: "1:399274375844:web:97c453664ef88f0d7a4431"
};

 const app = initializeApp(firebaseConfig);
 const db = getFirestore(app)

 const sendKeysToFirebase = async (collectionName, documentId, data) => {

    // try {
    //     await setDoc
    // }
 }
