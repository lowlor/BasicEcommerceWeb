import { auth } from "./utils/auth.js";
document.querySelector(".loginBtn").addEventListener("click",async ()=>{
    console.log("enter");
    let log = document.querySelector('.loginInput').value;
    let pass = document.querySelector('.passwordInput').value;


    const check = await auth(log,pass);
    
    console.log(check);

    
    if(check){
        console.log('enter home');
        
        window.location.href = "../mainPage.html";
    }else{     
        console.log('gogo');
        
        console.log("incorrect password or username");
        alert('Incorrect username or password');
    }

})