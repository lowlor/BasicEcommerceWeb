import { auth } from "./utils/auth.js";
document.querySelector(".loginBtn").addEventListener("click",async ()=>{
    console.log("enter");
    let log = document.querySelector('.loginInput').value;
    let pass = document.querySelector('.passwordInput').value;


    const check = await auth(log,pass);
    
    console.log(check);

    
    if(check == 1){
        console.log('enter home');
        
        window.location.href = "../mainPage.html";
    }if(check == 2){
        console.log('enter back end');
        
        window.location.href = "../backEndPage.html";
    }else{     
        console.log('gogo');
        
        console.log("incorrect password or username");
        alert('Incorrect username or password');
    }

})