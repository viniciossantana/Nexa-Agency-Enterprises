// =========================================
// NEXA DASHBOARD DYNAMIC
// Firebase v11.9.1
// =========================================

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// =========================================
// ELEMENTOS DA UI
// =========================================

const userNameEl = document.getElementById("userName");
const projectsEl = document.getElementById("projectsCount");
const filesEl = document.getElementById("filesCount");
const messagesEl = document.getElementById("messagesCount");
const notificationsEl = document.getElementById("notificationsCount");
const planEl = document.getElementById("userPlan");

const loadingEl = document.getElementById("loading");

// =========================================
// FUNÇÃO PRINCIPAL
// =========================================

async function loadUserData(user){

    try{

        const ref = doc(db, "users", user.uid);

        const snap = await getDoc(ref);

        if(!snap.exists()) return;

        const data = snap.data();

        // =====================================
        // UPDATE UI
        // =====================================

        if(userNameEl)
            userNameEl.textContent = data.name || user.displayName || "Usuário";

        if(projectsEl)
            projectsEl.textContent = data.projects ?? 0;

        if(filesEl)
            filesEl.textContent = data.files ?? 0;

        if(messagesEl)
            messagesEl.textContent = data.messages ?? 0;

        if(notificationsEl)
            notificationsEl.textContent = data.notifications ?? 0;

        if(planEl)
            planEl.textContent = data.plan || "Free";

        if(loadingEl)
            loadingEl.style.display = "none";

    }catch(err){

        console.error("Erro ao carregar dados:", err);

    }

}

// =========================================
// AUTH LISTENER
// =========================================

onAuthStateChanged(auth, (user) => {

    if(!user){
        window.location.replace("index.html");
        return;
    }

    loadUserData(user);

});

console.log("Dashboard dinâmico carregado.");