import {cart, removeFromCart,getAllCartQuantity, updataQuantity, updateDelivery} from "../datas/carts.js";
import { formatCurrency } from "./utils/money.js";
import {getDate} from "./utils/date.js"
import {deliveryOption, getDelivery} from "../datas/deliveryOption.js";
import {getProduct} from "../datas/products.js";
import { addOrder } from "../datas/order.js";

let totalItemPrice = 0;
let tax = 0;
let shipping =0;
let totalPrice =0;

export function updatePrice(){
    totalItemPrice = 0;
    tax = 0;
    shipping =0;
    totalPrice =0;
    cart.forEach(function(item){
        let product = getProduct(item.id);
        totalItemPrice += parseInt(product.priceCents)*item.quantity;
        
      
        let cost = getDelivery(item.deliveryOptionId);
        shipping += cost.price;
    })   
    console.log("hello",shipping);
    console.log(totalItemPrice);


    let html;

    let textToTake = `<div class="conclusionPriceDetail">
                <h3 class="subTotal">subtotal (2 items) :</h2>
                <p class="totalItemPrice"><i class="fa-solid fa-dollar"></i>${formatCurrency(totalItemPrice)}</p>
            </div>
            <div class="conclusionPriceDetail">
                <h3 class="subTotal">Shipping :</h2>
                <p class="shipping"><i class="fa-solid fa-dollar"></i>${formatCurrency(shipping)}</p>
            </div>
            <div class="conclusionPriceDetail">
                <h3 class="subTotal">Tax 7% :</h2>
                <p class="tax"><i class="fa-solid fa-dollar"></i>${formatCurrency((totalItemPrice*0.07))}</p>
            </div>
            <div class="conclusionPriceDetail">
                <h2 class="subTotal">total :</h2>
                <p class="totalPrice"><i class="fa-solid fa-dollar"></i>${formatCurrency(totalItemPrice+(totalItemPrice*0.07)+shipping)}</p>
            </div>
            <button class="conclusionBtn">proceed to checkout</button>`

    document.querySelector('.conclusionContainer').innerHTML = textToTake;

    console.log(document.querySelector('.conclusionContainer'));

    document.querySelector('.conclusionBtn').addEventListener('click',()=>{
        //const response = await fetch('https:\\supersimplebackend.dev/orders', {
        //    method: 'POST',
        //    headers:{
        //        'Content-Type' : 'application/json'
        //    },
        //    body : JSON.stringify({
        //        cart : cart
        //    })
        //});

        //const order = await response.json()
        //console.log(order);
        let cartToPut = [];
        cart.forEach((item)=>{
            const dateToPut = getDelivery(item.deliveryOptionId);
            cartToPut.push({
                productId : item.id,
                quantity: item.quantity,
                estimatedDeliveryTime : getDate(dateToPut.time)
            })
        })
        addOrder(totalItemPrice+(totalItemPrice*0.07)+shipping,cartToPut);

        alert("Complete! Please proceed to order tab to pay your order");
    })
}
