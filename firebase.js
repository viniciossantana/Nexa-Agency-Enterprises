// =========================================
// NEXA ENTERPRISES
// Firebase v11.9.1
// =========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

import { getStorage } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-storage.js";

// =========================================
// CONFIGURAÇÃO DO FIREBASE
// =========================================

const firebaseConfig = {

    apiKey: "AIzaSyCaK6aDc36I7Ci-3o0Dh8XJhqi88xz30gs",
  authDomain: "nexa-agency-enterprises.firebaseapp.com",
  projectId: "nexa-agency-enterprises",
  storageBucket: "nexa-agency-enterprises.firebasestorage.app",
  messagingSenderId: "568246674059",
  appId: "1:568246674059:web:7d3d57c94f027be6efaa8e",
  measurementId: "G-7G5BYRFSLM"

};

// =========================================
// INICIALIZAÇÃO
// =========================================

const app = initializeApp(firebaseConfig);

// =========================================
// SERVIÇOS
// =========================================

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);

// =========================================
// EXPORTAÇÕES
// =========================================

export {
    app,
    auth,
    db,
    storage
};
