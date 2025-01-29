import { orders } from "../datas/order.js";
import { getProduct, products } from "../datas/products.js";
import { getAllCartQuantity } from "../datas/carts.js";
let html ='';

document.querySelector('.cartNumber').innerHTML = getAllCartQuantity();


orders.forEach((order)=>{

    html+= `
    <div class="orderContainer">
        <div class="orderContainerText">
                <h2 class="orderId">ID : ${order.id} ${order.status}</h2>
                <h3 class="sumTotal">Sum Total : ${order.getTotalCost()} </h2>
        </div>
        
        <div class="orderItems">
            
            ${productHtml(order.products,order.id,order.status,order.payStatus)}
        </div>
    </div>
        `
    console.log(html);
})

function productHtml(itemArray,id,status,payStatus){
    let html='';
    console.log(payStatus)
    console.log('hello');
    itemArray.forEach((item)=>{
        let product = getProduct(item.productId)
        if(status === "Waiting Comfirming Payment" & payStatus===0){
            html += `
        <div class="orderItem">
            <img class="itemImg" src="${product.img}" alt="">
            <div class="orderItemText">
                <h3 class="productName">${product.name}</h3>
                <p>Price : ${product.getPrice()}</p>
                <div class="orderItemTextDiv">
                    <a href=payRequestPage.html?orderId=${id}&productId=${item.productId}>
                        <button data-product-id="${item.productId}" class="checkStatus">Send Request</button>    
                    </a>
                </div>
            </div>
         </div>  
        `
        }else if(payStatus===1){
            console.log('enter');
            html += `
        <div class="orderItem">
            <img class="itemImg" src="${product.img}" alt="">
            <div class="orderItemText">
                <h3 class="productName">${product.name}</h3>
                <p>Price : ${product.getPrice()}</p>
                <div class="orderItemTextDiv">
                    <p>Waiting comfirm your slip</p>
                </div>
            </div>
         </div>  
        `
        }else{
            console.log("enter bottom----------------------");
            html += `
        <div class="orderItem">
            <img class="itemImg" src="${product.img}" alt="">
            <div class="orderItemText">
                <h3 class="productName">${product.name}</h3>
                <p>Price : ${product.getPrice()}</p>
                <div class="orderItemTextDiv">
                    <p class="deliveryDate">Estimated Delivery : ${item.estimatedDeliveryTime}</p>
                    <a href=trackingPage.html?orderId=${id}&productId=${item.productId}>
                        <button data-product-id="${item.productId}" class="checkStatus">check</button>    
                    </a>
                </div>
            </div>
         </div>  
        `
        }
        
    })

    return html;
}

document.querySelector('.orderContainers').innerHTML = html;
