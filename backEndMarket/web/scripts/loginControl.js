document.querySelector(".loginBtn").addEventListener("click",()=>{
    console.log("enter");
    let log = document.querySelector('.loginInput').value;
    let pass = document.querySelector('.passwordInput').value;

    if(log==="admin" & pass==="admin"){
        console.log("gello");
        window.location.href = "../backEndPage.html";
    }else{     
        console.log("main");
        window.location.href = "../mainPage.html";

    }

})