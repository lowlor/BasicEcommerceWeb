import { getOrder } from "../datas/order.js";
import { addSlip } from "../datas/slips.js";
import { verifyAuth } from "./utils/auth.js";
const url = new URL(window.location.href);


const initial = async (cusId)=>{
    const order = await getOrder(url.searchParams.get('orderId'),cusId);
    console.log(order);
    
    document.querySelector(".ConfirmBtn").addEventListener('click',()=>{
        const fileToPut = document.querySelector('#slipInput').files[0];
        console.log(fileToPut);
        
        order.changeSlip(fileToPut)
        order.changePayStatus(1);
        //window.location.href = "orderPage.html";
    })
    
}

const loginAuth = async()=>{
    return await verifyAuth()
}

(async ()=>{
    const isAuth = await loginAuth();
    if(isAuth.status){
        console.log('goto main');
        console.log(isAuth.info);
        console.log(isAuth.info.id);
        
        initial(isAuth.info.id);
    }else{
        window.location.href = "loginPage.html";
    }
    
})();

