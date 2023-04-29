/**
 * Configuração do Firebase
 * By João Pedro
 * MIT License 
 **/

/**
 * Configurações so Firebase
 * 
 * IMPORTANTE!
 * Troque os valores de 'firebaseConfig' pelos dados do SEU FIREBASE!
 **/
const firebaseConfig = {
    apiKey: "AIzaSyATqD01lDD2yu3kwrTQ7fYXRlNFlE6cc1g",
    authDomain: "frontman-69420a.firebaseapp.com",
    projectId: "frontman-69420a",
    storageBucket: "frontman-69420a.appspot.com",
    messagingSenderId: "514970139608",
    appId: "1:514970139608:web:c8d8dfc239f6e030d510ad"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//Inicializa o Firebase Authentication
const auth = firebase.auth();

// Define o provedor de autênticação
var provider = new firebase.auth.GoogleAuthProvider();