// =========================================
// NEXA ENTERPRISES
// auth.js
// Firebase v11.9.1
// =========================================

import { auth, db } from "./firebase.js";

import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

async function syncUser(user){

    const ref = doc(db, "users", user.uid);

    const snap = await getDoc(ref);

    if(!snap.exists()){

        await setDoc(ref,{

            name: user.displayName || "",

            email: user.email || "",

            photo: user.photoURL || "",

            company: "",

            role: "Usuário",

            plan: "Free",

            projects: 0,

            files: 0,

            messages: 0,

            notifications: 0,

            createdAt: serverTimestamp(),

            lastLogin: serverTimestamp()

        });

    }else{

        await updateDoc(ref,{

            lastLogin: serverTimestamp(),

            name: user.displayName || "",

            photo: user.photoURL || ""

        });

    }

}

// =========================================
// ELEMENTOS
// =========================================

const loginForm = document.getElementById("loginForm");
const googleButton = document.getElementById("googleLogin");
const logoutBtn = document.getElementById("logoutBtn");
const message = document.getElementById("message");

// =========================================
// MENSAGENS
// =========================================

function showMessage(text, type = "success") {

    if (!message) return;

    message.textContent = text;
    message.className = `message ${type}`;

}

// =========================================
// PERSISTÊNCIA
// =========================================

await setPersistence(auth, browserLocalPersistence);

// =========================================
// LOGIN COM E-MAIL
// =========================================

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {

            const credential = await signInWithEmailAndPassword(
    auth,
    email,
    password
);

await syncUser(credential.user);

            showMessage("Login realizado com sucesso!", "success");

            setTimeout(() => {

                window.location.replace("dashboard.html");

            }, 800);

        } catch (error) {

            console.error(error);

            switch (error.code) {

                case "auth/invalid-email":
                    showMessage("E-mail inválido.", "error");
                    break;

                case "auth/invalid-credential":
                case "auth/user-not-found":
                case "auth/wrong-password":
                    showMessage("E-mail ou senha incorretos.", "error");
                    break;

                case "auth/too-many-requests":
                    showMessage("Muitas tentativas. Aguarde alguns minutos.", "error");
                    break;

                default:
                    showMessage("Erro ao realizar login.", "error");

            }

        }

    });

}

// =========================================
// LOGIN COM GOOGLE
// =========================================

if (googleButton) {

    googleButton.addEventListener("click", async () => {

        try {

            const provider = new GoogleAuthProvider();

            provider.setCustomParameters({
                prompt: "select_account"
            });

            const result = await signInWithPopup(auth, provider);

await syncUser(result.user);

            showMessage("Login realizado com sucesso!", "success");

            setTimeout(() => {

                window.location.replace("inicio.html");

            }, 800);

        } catch (error) {

            console.error(error);

            switch (error.code) {

                case "auth/popup-closed-by-user":
                    showMessage("Login cancelado.", "error");
                    break;

                case "auth/popup-blocked":
                    showMessage("O navegador bloqueou a janela do Google.", "error");
                    break;

                case "auth/cancelled-popup-request":
                    showMessage("Aguarde alguns segundos e tente novamente.", "error");
                    break;

                default:
                    showMessage("Não foi possível entrar com Google.", "error");

            }

        }

    });

}

// =========================================
// LOGOUT
// =========================================

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        try {

            await signOut(auth);

            window.location.replace("index.html");

        } catch (error) {

            console.error(error);

            alert("Erro ao sair da conta.");

        }

    });

}

// =========================================
// VERIFICAÇÃO DE SESSÃO
// =========================================

onAuthStateChanged(auth, (user) => {

    const page = window.location.pathname.split("/").pop();

    if (user) {

        if (page === "dashboard.html" || page === "") {

            window.location.replace("index.html");

        }

    } else {

        if (page === "index.html") {

            window.location.replace("dashboard.html");

        }

    }

});

console.log("Nexa Auth carregado com sucesso.");