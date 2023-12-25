import  firebase  from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';



const firebaseConfig = {
  apiKey: "AIzaSyAQ5k6TNd6ZGRiePo1eg-mmuueTh6jnPv4",
  authDomain: "deekuway.firebaseapp.com",
  projectId: "deekuway",
  storageBucket: "deekuway.appspot.com",
  messagingSenderId: "468055294169",
  appId: "1:468055294169:web:86d4a272816a35b273fec8",
  measurementId: "G-JMNWLKV04Z"
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


export default firebase;

