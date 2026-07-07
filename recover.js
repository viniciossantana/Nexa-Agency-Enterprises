import { auth } from "./firebase.js";

import {
sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

window.send = async function(){

const email = document.getElementById("email").value.trim();

if(email===""){
alert("Digite um e-mail.");
return;
}

try{

await sendPasswordResetEmail(auth,email);

alert("Se existir uma conta, enviamos um e-mail de recuperação.");

}catch(e){

alert("Não foi possível enviar o e-mail.");

}

}