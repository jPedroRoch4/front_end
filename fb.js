/**
 * Integração com o Firebase.com
 * By Luferat
 * MIT License
 **/

// Configuração do Firebase para o site do prof. Luferat.
// NÃO USE ESTE CÓDIGO NO SEU APLICATIVO.
const firebaseConfig = {
    apiKey: "AIzaSyDk2880c2er1Y3j1uq1IFrPln_YSJo18fs",
    authDomain: "frontendeiros.firebaseapp.com",
    projectId: "frontman-69420a",
    storageBucket: "frontendeiros.appspot.com",
    messagingSenderId: "197552479848",
    appId: "1:514970139608:web:c8d8dfc239f6e030d510ad"
};

// Importa o "core" do Firebase.
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";

// Importa o Authentication do Firebase.
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";

// Initializa o Firebase.
const fbapp = initializeApp(firebaseConfig);

// Especifica o provedor de autenticação.
const provider = new GoogleAuthProvider();

//
const auth = getAuth();

// signInWithPopup(auth, provider)

onAuthStateChanged(auth, (user) => {
    if (user) {
        sessionStorage.userData = JSON.stringify({
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            uid: user.uid
        })
    } else {
        delete sessionStorage.userData
    }
});

