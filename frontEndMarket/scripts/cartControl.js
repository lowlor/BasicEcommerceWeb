import { updateOrderSection } from "./orderSection.js";
import { updatePrice } from "./paymentSection.js";
import { logout, verifyAuth } from "./utils/auth.js";


const loginAuth = async()=>{
    return await verifyAuth();
}
(async ()=>{
    const isAuth = await loginAuth();
    console.log(isAuth);
    console.log(typeof isAuth.info);
    console.log(isAuth.info);
    console.log(isAuth.info.id);
    
    
    if(isAuth.status){
        document.querySelector('.userInfo').innerHTML = "Welcome back..."+isAuth.info.username;
        await updateOrderSection(isAuth.info.id);
        await updatePrice(isAuth.info.id);

        document.querySelector('#logOutBtn').addEventListener('click',async ()=>{
                const logoutOk = await logout();
                console.log('go log out');
                
                if (logoutOk) {
                    alert('log out complete');
                    window.location.href = 'loginPage.html';
                }else{
                    alert('log out error');
                }
        })
    }else{
        window.location.href = "loginPage.html";
    }
})();