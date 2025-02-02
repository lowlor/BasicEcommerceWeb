import { getProduct } from "../datas/products.js";
import { getOrder } from "../datas/order.js";
import { fetchCart } from "../datas/carts.js";
import { verifyAuth } from "./utils/auth.js";
const url = new URL(window.location.href);

async function initial(customerId,username){
    document.querySelector('.userInfo').innerHTML = "Welcome back..."+username;

    const order = await getOrder(url.searchParams.get('orderId'),customerId);
    console.log(order);

    const cart = await fetchCart(customerId); 
    console.log(order.products);

    document.querySelector('.cartNumber').innerHTML = cart.getAllCartQuantity();


    const productSectionHtml = await productHtml(order);
    let html = `
                <div class="trackingHeadContainer">
                    <h2 class="statusText">${order.status}</h2>
                    <div class="trackingText2">
                        <h2 class="orderNum">Order number :${order.id}</h2>
                    </div>    
                </div>
                <div class="deliveryVisual">
                    <div class="node" id="node1"></div>
                    <div class="line" id="line1"></div>
                    <div class="node" id="node2"></div>
                    <div class="line" id="line2"></div>
                    <div class="node" id="node3"></div>
                </div>
                <div class="deliveryVisualText">
                    <div class="nodeText">Packing</div>
                    <div class="space"></div>
                    <div class="nodeText">Delivering</div>
                    <div class="space"></div>
                    <div class="nodeText">Delivered</div>
                </div>

                ${productSectionHtml}

    `;

    async function productHtml(order){
        let html = '';

        for(const product of order.products){
            
            const oriProduct = await getProduct(product.productId);
            console.log(oriProduct);
            console.log(product);
            
            
            html += `
            <div class="productContainer">
                <img class="productImg" src="${oriProduct.img}" alt="">
                <div class="productText">
                    <h3 class="productName">${oriProduct.name}</h3>
                    <div class="productTextSecondary">
                        <p class="quantityText">Quantity : ${product.quantity}</p>
                        <p class="priceText"><i class="fa-solid fa-dollar"></i>${oriProduct.getPrice()}</p>        
                    </div>
                </div>
            </div>

            `
        }

        console.log(html);
        
        return html;
    }
    function changeStatusDisplay(status){
        console.log(status);
        
        if(status ==="Packed"){
            console.log('in this');
            
            document.querySelector("#node1").style.backgroundColor = "red";

        }else if(status ==="Delivering"){
            document.querySelector("#node1").style.backgroundColor = "black";
            document.querySelector("#line1").style.backgroundColor = "black";
            document.querySelector("#node2").style.backgroundColor = "red";
        }else if(status === "Delivered"){
            document.querySelector("#node1").style.backgroundColor = "black";
            document.querySelector("#line1").style.backgroundColor = "black";
            document.querySelector("#node2").style.backgroundColor = "black";
            document.querySelector("#line2").style.backgroundColor = "black";
            document.querySelector("#node3").style.backgroundColor = "red";

        }
    }

    document.querySelector(".trackingContainer").innerHTML = html;

    changeStatusDisplay(order.status);

}

const loginAuth = async()=>{
    return await verifyAuth();
}

(async ()=>{
    const isAuth = await loginAuth();
    if(isAuth.status){
        console.log('goto main');
        console.log(isAuth.info);
        
        initial(isAuth.info.id,isAuth.info.username);
    }else{
        window.location.href = "loginPage.html";
    }
    
})();
