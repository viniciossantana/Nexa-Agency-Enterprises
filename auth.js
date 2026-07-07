// =========================================
// NEXA ENTERPRISES
// auth.js
// Firebase Authentication + Firestore
// Firebase v11.9.1
// =========================================


// ===============================
// IMPORTS FIREBASE AUTH
// ===============================

import {

    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";


// ===============================
// IMPORT FIREBASE CONFIG
// ===============================

import {

    auth,
    db

} from "./firebase.js";


// ===============================
// IMPORT FIRESTORE
// ===============================

import {

    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp

} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";



// =========================================
// CONTROLE PARA EVITAR LOOP
// =========================================

let authChecked = false;




// =========================================
// SINCRONIZA USUÁRIO COM FIRESTORE
// =========================================

async function syncUser(user){


    try{


        const userRef = doc(
            db,
            "users",
            user.uid
        );



        const snapshot = await getDoc(userRef);



        if(!snapshot.exists()){


            await setDoc(userRef,{


                name:
                user.displayName || "Usuário Nexa",


                email:
                user.email || "",


                photo:
                user.photoURL || "",


                company:
                "",


                role:
                "Usuário",


                plan:
                "Free",


                projects:
                0,


                files:
                0,


                messages:
                0,


                notifications:
                0,


                createdAt:
                serverTimestamp(),


                lastLogin:
                serverTimestamp()


            });



        }else{


            await updateDoc(userRef,{


                name:
                user.displayName || "Usuário Nexa",


                photo:
                user.photoURL || "",


                lastLogin:
                serverTimestamp()


            });


        }



    }catch(error){


        console.error(
            "Erro ao sincronizar usuário:",
            error
        );


    }


}






// =========================================
// ELEMENTOS DA PÁGINA
// =========================================


const loginForm =
document.getElementById("loginForm");


const googleButton =
document.getElementById("googleLogin");


const logoutButton =
document.getElementById("logoutBtn");


const message =
document.getElementById("message");






// =========================================
// SISTEMA DE MENSAGENS
// =========================================


function showMessage(
    text,
    type = "success"
){


    if(!message)
        return;



    message.textContent = text;


    message.className =
    "message";


    message.classList.add(type);



}







// =========================================
// LOGIN EMAIL E SENHA
// =========================================


if(loginForm){


    loginForm.addEventListener(
    "submit",
    async(e)=>{


        e.preventDefault();



        const email =
        document.getElementById("email")
        .value
        .trim();



        const password =
        document.getElementById("password")
        .value;




        try{


            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );



            showMessage(
                "Login realizado com sucesso!",
                "success"
            );



            setTimeout(()=>{


                window.location.replace(
                    "inicio.html"
                );


            },800);



        }catch(error){



            console.error(error);



            switch(error.code){



                case "auth/invalid-email":


                    showMessage(
                        "E-mail inválido.",
                        "error"
                    );


                break;




                case "auth/invalid-credential":


                case "auth/user-not-found":


                case "auth/wrong-password":


                    showMessage(
                        "E-mail ou senha incorretos.",
                        "error"
                    );


                break;




                case "auth/too-many-requests":


                    showMessage(
                        "Muitas tentativas. Aguarde alguns minutos.",
                        "error"
                    );


                break;




                default:


                    showMessage(
                        "Erro ao realizar login.",
                        "error"
                    );


            }



        }



    });


}







// =========================================
// LOGIN GOOGLE
// =========================================


if(googleButton){


    googleButton.addEventListener(
    "click",
    async()=>{


        try{


            const provider =
            new GoogleAuthProvider();



            provider.setCustomParameters({

                prompt:
                "select_account"

            });




            await signInWithPopup(
                auth,
                provider
            );



            showMessage(
                "Login realizado com sucesso!",
                "success"
            );



            setTimeout(()=>{


                window.location.replace(
                    "inicio.html"
                );


            },800);




        }catch(error){



            console.error(error);



            switch(error.code){



                case "auth/popup-closed-by-user":


                    showMessage(
                        "Login cancelado.",
                        "error"
                    );


                break;




                case "auth/popup-blocked":


                    showMessage(
                        "O navegador bloqueou o login Google.",
                        "error"
                    );


                break;




                case "auth/cancelled-popup-request":


                    showMessage(
                        "Aguarde e tente novamente.",
                        "error"
                    );


                break;




                default:


                    showMessage(
                        "Não foi possível entrar com Google.",
                        "error"
                    );


            }



        }



    });


}







// =========================================
// LOGOUT
// =========================================


if(logoutButton){


    logoutButton.addEventListener(
    "click",
    async()=>{


        try{


            await signOut(auth);



            window.location.replace(
                "index.html"
            );



        }catch(error){



            console.error(error);



            showMessage(
                "Erro ao sair da conta.",
                "error"
            );



        }



    });


}







// =========================================
// PROTEÇÃO DE PÁGINAS
// SEM LOOP DE REDIRECIONAMENTO
// =========================================


onAuthStateChanged(
auth,
async(user)=>{


    if(authChecked)
        return;



    authChecked = true;



    const page =
    window.location.pathname
    .split("/")
    .pop()
    .split("?")[0];




    const protectedPages = [


        "inicio.html",

        "dashboard.html",

        "suporte.html",

        "perfil.html"


    ];





    const publicPages = [


        "",

        "index.html"


    ];







    if(user){



        await syncUser(user);




        if(
            publicPages.includes(page)
        ){



            window.location.replace(
                "inicio.html"
            );



        }



        return;



    }







    if(
        protectedPages.includes(page)
    ){



        window.location.replace(
            "index.html"
        );



    }



});







console.log(
"Nexa Auth carregado com sucesso."
);
