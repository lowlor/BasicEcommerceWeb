import { register } from "./utils/auth.js";
document.querySelector(".registerBtn").addEventListener("click",async ()=>{
    console.log("enter");
    let log = document.querySelector('.usernameInput').value;
    let pass = document.querySelector('.passwordInput').value;
    let confirmPass = document.querySelector('.confirmPasswordInput').value;

    let check;
    if(confirmPass === pass){
        check = await register(log, pass); 
    }else if(pass.includes('<') || pass.includes('=') || pass.includes('"')){
        return alert('Make sure password not contains < and = and ".');
    }else{
        return alert('Make sure password are the same.');
    }

    
    console.log(check);

    
    if(check){
        console.log('enter home');
        alert('register complete')
        window.location.href = "../loginPage.html";
    }else{     
        console.log('gogo');
        alert('regiter unsucessful');
    }

})