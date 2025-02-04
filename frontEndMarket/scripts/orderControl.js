import { fetchOrders} from "../datas/order.js";
import { getProduct, products } from "../datas/products.js";
import { fetchCart} from "../datas/carts.js";
import { logout, verifyAuth } from "./utils/auth.js";
let html ='';

const initial =  async (userID,username) => {
    document.querySelector('.userInfo').innerHTML = "Welcome back..."+username;

    const cart = await fetchCart(userID);
    document.querySelector('.cartNumber').innerHTML = cart.getAllCartQuantity();

    const orders = await fetchOrders(userID);
    console.log(orders);
    
    for (const order of orders){
    
        const productText = await productHtml(order.products,order.id,order.status,order.payStatus);
        console.log(productText);
        console.log('productText');
        
        
        html+= `
        <div class="orderContainer">
            <div class="orderContainerText">
                    <h2 class="orderId">ID : ${order.id} ${order.status}</h2>
                    <h3 class="sumTotal">Total Price : ${order.getTotalCost()} <i class="fa-solid fa-dollar"></i></h2>
            </div>
            
            <div class="orderItems">
                
                ${productText}
            </div>

            ${orderStatusSplit(order)}
        </div>
            `
            
    }

    function orderStatusSplit(order){
        console.log('enter to orderstatussplit');
        console.log(order);
        
        
        if(order.status === "Waiting Comfirming Payment" & order.payStatus===0){
                
            return `<div class="dynamicOrderInfo" id="sendSlip${order.id}">
                        <a href=payRequestPage.html?orderId=${order.id}>
                            <button class="checkStatus">Send Request</button>    
                        </a>
                    </div>`;        
        
        }else if(order.payStatus===1 & order.status === "Waiting Comfirming Payment"){
            return `<div class="dynamicOrderInfo" id="WaitingForOk">
                <p><Waiting for Accept/p>
            </div>`;
        }else{
            console.log('enter this');
            
            return `<div class="dynamicOrderInfo" id="trackDelivery${order.id}">
                <p class="deliveryDate">Estimated Delivery : ${order.estimatedDeliveryTime}</p>
                <a href=trackingPage.html?orderId=${order.id}>
                    <button class="checkStatus">check</button>    
                </a>
            </div>`;

            
        }
    }
    async function productHtml(itemArray,id,status,payStatus){
        let html ='';
        console.log(itemArray);
        
        for(const item of itemArray){
                console.log(item.productId);
                
                const product = await getProduct(item.productId)
                console.log(product);
                
                html += `
                <div class="orderItem">
                    <img class="itemImg" src="${product.img}" alt="">
                    <div class="orderItemText">
                        <h3 class="productName">${product.name}</h3>
                        <p>Price : ${product.getPrice()}<i class="fa-solid fa-dollar"></i></p>
                        <div class="orderItemTextDiv">
                        </div>
                    </div>
                 </div>  
                `
            
                }
        
        return html;
    }
    
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
    
    document.querySelector('.orderContainers').innerHTML = html;
    
}
const loginAuth = async()=>{
    return await verifyAuth()
}

(async ()=>{
    const isAuth = await loginAuth();
    if(isAuth.status){
        console.log('goto main');
        console.log(isAuth.info);
        
        initial(isAuth.info.id,isAuth.info.username);
    }else{
        //window.location.href = "loginPage.html";
    }
    
})();
