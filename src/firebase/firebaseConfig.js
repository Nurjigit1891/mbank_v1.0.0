import { initializeApp } from "firebase/app";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";



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



 export const sendNewKeysToFirebase = async (key,path) => {
      try {
        const keyCollection = collection(db, path) ;
        await addDoc(keyCollection,key);
        console.log("key added successfully!")
      }catch (error) {
        console.log(error)
        console.log("Ошибка при отправке ключей в Firebase!"); 
      }
  }

  export const getAllKeys= async (path) => {
    try {
      const keyCollection = collection(db,path); // путь чтобы получить именно ту коллекцию
      const keySnapshot = await getDocs(keyCollection); // получает все документы 
      const keyList = keySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
      return keyList; // возварщает 
    }catch (error){
      console.log("Ошибка при получении ключей из Firebase!")
      console.log(error);
      throw error;
    }
  }
  
  export const getDefiniteNewKey = async (key,path) => {
    try {
      // Ссылка на коллекцию "new"
      const keyCollection = collection(db, path);
  
      // Создаем запрос с фильтром по полю "keyOriginal"
      const q = query(keyCollection, where("keyOriginal", "==", key));
  
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        console.log("Ключ не найден");
        return null;
      } else {
        // Получаем первый документ из результатов запроса
        const firstDocumentSnapshot = querySnapshot.docs[0];
        // Получаем данные этого документа
        const documentData = firstDocumentSnapshot.data();
        // Получаем id этого документа
        const documentId = firstDocumentSnapshot.id
  
        console.log(querySnapshot.docs[0]); //.doc.data.value.mapValue.fields
        console.log(documentData); //.doc.data.value.mapValue.fields
  
        console.log("Ключ найден! ID документа:", documentId);
  
        // Возвращаем id найденного документа
        return {id: documentId, ...documentData}
      }
    } catch (error) {
      console.log("Ошибка при поиске ключа:", error);
      throw error;
    }
  };
  
  export const deleteNewKey = async (key,dataCheck) => {
    try {
      // время в котором чек был использован
      const date = new Date();
      const formattedDate = {
        day: date.getDate(),
        month: date.getMonth() + 1, // месяцы начинаются с 0
        year: date.getFullYear(),
        hours: date.getHours(),
        minutes: date.getMinutes()
      };

      // форматируется дата
      const formattedDateString = `${formattedDate.day}/${formattedDate.month}/${formattedDate.year} ${formattedDate.hours}:${formattedDate.minutes}`;

      // новая ключ который хранит в себе новую дату использования
      const usedKey = {
        ...key,
        usedDate: formattedDateString
      }

      // Отправит в базу использованный чек вместе с использованным ключом
      const usedCheck = {
        ...dataCheck,
        usedKey
      }

      console.log(usedCheck)

      // Использованный чек отправляется в коллекцию "checks"
      await sendNewKeysToFirebase(usedCheck, "checks")

      // Использованный ключ отправляетяс в коллекцию "used"
      await sendNewKeysToFirebase(usedKey, "used")

      // находится ключ по id с коллекции "avaulable"
      const keyDocRef = doc(db, "available", key.id);

      //удаляется с базы найденный ключ
      await deleteDoc(keyDocRef);

      //отчет об успешном удалении
      console.log("Ключ успешно удален с базы!")
    } catch (error) {

      // отчет об провальном удалении
      console.log("Ошибка при удалении ключа!")
    }
  }



 /* 
 const addMatch = async (matchData) => {
  //we're trying to create a new data and send to FireBase
  try {
    const matchesCollection = collection(db, 'matches'); // the path to FIREBASE

    await addDoc(matchesCollection, matchData); // "addDoc" - a specific function add "matchData" from path "matchesCollection"
    
    console.log('Match added successfully!');
  } catch (error) { 

    // if there is an error we will print it out
    console.error('Error adding match: ', error);
  }
};

 */
