import { updateOrderSection } from "./orderSection.js";
import { updatePrice } from "./paymentSection.js";
import '../datas/cart-class.js';
import { verifyAuth } from "./utils/auth.js";


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
        await updateOrderSection(isAuth.info.id);
        await updatePrice(isAuth.info.id);
    }else{
        //window.location.href = "loginPage.html";
    }
})();