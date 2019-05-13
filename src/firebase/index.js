import firebase from "firebase";
import firebaseConfig from "./firebase.config";

firebase.initializeApp(firebaseConfig);

const database = firebase.firestore();
const authentication = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();
//export default firebase;
export { database, authentication, firestore, storage };
