import { getProduct } from "../datas/products.js";
import { getOrder } from "../datas/order.js";
import { getAllCartQuantity } from "../datas/carts.js";
const url = new URL(window.location.href);

const order = getOrder(url.searchParams.get('orderId'));
console.log(order);
const product = getProduct(url.searchParams.get('productId'));

const orderProduct = order.getProduct(product.id);
console.log(orderProduct);

document.querySelector('.cartNumber').innerHTML = getAllCartQuantity();


let html = `
            <div class="trackingHeadContainer">
                <h2 class="statusText">${order.status}</h2>
                <div class="trackingText2">
                    <h2 class="orderNum">Order number :${order.id}</h2>
                    <h2 class="deliverTime">Estimated Delivery Time : ${orderProduct.estimatedDeliveryTime}</h3>    
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
            
            <div class="productContainer">
                <img class="productImg" src="${product.img}" alt="">
                <div class="productText">
                    <h3 class="productName">${product.name}</h3>
                    <div class="productTextSecondary">
                        <p class="quantityText">Quantity : ${orderProduct.quantity}</p>
                        <p class="priceText"><i class="fa-solid fa-dollar"></i>${product.getPrice()}</p>        
                    </div>
                </div>
            </div>

`;

function changeStatusDisplay(status){
    if(status ==="Packing"){
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
