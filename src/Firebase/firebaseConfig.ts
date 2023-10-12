import * as firebase from "firebase";
import "@firebase/auth";
import "@firebase/firestore";

const config = {
  apiKey: "AIzaSyCxwNaHERrZH9tTz1CkAG39UfSKR7dDru0",
  authDomain: "knowledgebase-af920.firebaseapp.com",
  databaseURL: "https://knowledgebase-af920.firebaseio.com",
  projectId: "knowledgebase-af920",
  storageBucket: "knowledgebase-af920.appspot.com",
  messagingSenderId: "150349898940",
  appId: "1:150349898940:web:7a0a18f549e58388539cb9",
  measurementId: "G-PHKZFVNLZ1"

  // apiKey: "AIzaSyDBmttVhkfN-AljyZYJ4SFNbDGmbt2jNw8",
  // authDomain: "react-nation-2.firebaseapp.com",
  // databaseURL: "https://react-nation-2.firebaseio.com",
  // projectId: "react-nation-2",
  // storageBucket: "react-nation-2.appspot.com",
  // messagingSenderId: "726194605923",
  // appId: "1:726194605923:web:6b9ac8a6af36c743ef4d56"
}

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export { firebase };
