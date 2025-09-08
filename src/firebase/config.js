// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDX4FQzwDwpa7IZbkc-RHPp07v-1dy-DoU",
  authDomain: "filmarks-vue3.firebaseapp.com",
  projectId: "filmarks-vue3",
  storageBucket: "filmarks-vue3.firebasestorage.app",
  messagingSenderId: "1028988772411",
  appId: "1:1028988772411:web:5a4bbd0029acccbba4bc1e",
  measurementId: "G-TNV1RGDPCG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// 認証サービスをexport
export const auth = getAuth(app);
