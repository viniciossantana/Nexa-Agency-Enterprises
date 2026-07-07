// =========================================
// NEXA ENTERPRISES
// register.js
// Firebase v11.9.1
// =========================================

import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// =========================================
// ELEMENTOS
// =========================================

const form = document.getElementById("registerForm");
const googleBtn = document.getElementById("googleRegister");
const message = document.getElementById("message");

// =========================================
// MENSAGEM UI
// =========================================

function showMessage(text, type = "success"){

    if(!message) return;

    message.textContent = text;
    message.className = `message ${type}`;

}

// =========================================
// CRIAR USUÁRIO NO FIRESTORE
// =========================================

async function createUserDoc(user, extraData = {}){

    const ref = doc(db, "users", user.uid);

    const snap = await getDoc(ref);

    if(!snap.exists()){

        await setDoc(ref,{

            name: user.displayName || extraData.name || "",

            email: user.email,

            photo: user.photoURL || "",

            company: extraData.company || "",

            role: "Usuário",

            plan: "Free",

            projects: 0,

            files: 0,

            messages: 0,

            notifications: 0,

            createdAt: serverTimestamp(),

            lastLogin: serverTimestamp()

        });

    }

}

// =========================================
// REGISTRO COM EMAIL
// =========================================

if(form){

    form.addEventListener("submit", async (e)=>{

        e.preventDefault();

        const name = document.getElementById("name").value.trim();

        const company = document.getElementById("company").value.trim();

        const email = document.getElementById("email").value.trim();

        const password = document.getElementById("password").value;

        const confirm = document.getElementById("confirmPassword").value;

        if(password !== confirm){

            showMessage("As senhas não coincidem.", "error");

            return;

        }

        try{

            const cred = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            await updateProfile(cred.user,{

                displayName:name

            });

            await createUserDoc(cred.user,{

                name,
                company

            });

            showMessage("Conta criada com sucesso!", "success");

            setTimeout(()=>{

                window.location.replace("dashboard.html");

            },800);

        }catch(err){

            console.error(err);

            switch(err.code){

                case "auth/email-already-in-use":
                    showMessage("Este e-mail já está em uso.", "error");
                    break;

                case "auth/weak-password":
                    showMessage("Senha muito fraca (mínimo 6 caracteres).", "error");
                    break;

                case "auth/invalid-email":
                    showMessage("E-mail inválido.", "error");
                    break;

                default:
                    showMessage("Erro ao criar conta.", "error");

            }

        }

    });

}

// =========================================
// REGISTRO COM GOOGLE
// =========================================

if(googleBtn){

    googleBtn.addEventListener("click", async ()=>{

        try{

            const provider = new GoogleAuthProvider();

            provider.setCustomParameters({

                prompt:"select_account"

            });

            const result = await signInWithPopup(auth, provider);

            await createUserDoc(result.user);

            showMessage("Conta criada com Google!", "success");

            setTimeout(()=>{

                window.location.replace("dashboard.html");

            },800);

        }catch(err){

            console.error(err);

            showMessage("Erro ao registrar com Google.", "error");

        }

    });

}