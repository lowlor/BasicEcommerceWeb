import {fetchCart} from "../datas/carts.js";
import { formatCurrency } from "./utils/money.js";
import {getDate, getDateDateFormat} from "./utils/date.js"
import {deliveryOption, getDelivery} from "../datas/deliveryOption.js";
import {getProduct} from "../datas/products.js";
import { addOrder } from "../datas/order.js";

let totalItemPrice = 0;
let tax = 0;
let shipping =0;
let totalPrice =0;

export async function updatePrice(userID){
    
    totalItemPrice = 0;
    tax = 0;
    shipping =0;
    totalPrice =0;
    const cart = await fetchCart(userID);
    const totallItemNumber = await cart.getAllCartQuantity();
    for(const item of cart.products){
        let product = await getProduct(item.productId);
        totalItemPrice += parseInt(product.priceCents)*item.quantity;
        
      
        console.log(item);
        
        
    }
    let cost = getDelivery(cart.deliveryOptionId);
    shipping += cost.price;
    console.log("hello",shipping);
    console.log(totalItemPrice);


    let html;

    let textToTake = `
            <p class="deliveryOption">Choose a delivery option</p>
            <select name="quantity" id="quantity" class="quantityBox">
                ${addOption(cart.deliveryOptionId)}
            </select>
            <div class="conclusionPriceDetail">
                <h3 class="subTotal">subtotal (${totallItemNumber} items) :</h2>
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

    function addOption(item){
        let html = '';
        let number = 1;

        console.log(item)
        console.log("this in addoption")
        deliveryOption.forEach((currOption)=>{
            if(currOption.deliveryId == item){
                html+=    `
            <option value="${currOption.deliveryId}" selected=true>${currOption.deliveryName}</option>
            `
            }else{
                html+=    `
                <option value="${currOption.deliveryId}">${currOption.deliveryName}</option>
                `
            }
            
            number++;
        })

        return html;
    }
        
    
    document.querySelector('.conclusionContainer').innerHTML = textToTake;

    console.log(document.querySelector('.conclusionContainer'));

    const optionDeli = document.querySelector('#quantity');
    
    optionDeli.addEventListener('change',async ()=>{
            console.log(optionDeli.value);
            console.log(typeof optionDeli.value);
            
            
            await cart.updateDelivery(optionDeli.value);
            
            
            console.log('----------------------update delivery');
            
            await updatePrice(userID);
            console.log('----------------------update price');
            
    })
    

    document.querySelector('.conclusionBtn').addEventListener('click',()=>{
        let cartToPut = [];
        let countId =1;
        cart.products.forEach((item)=>{            
            cartToPut.push({
                id: countId.toString(),
                productId : item.productId,
                quantity: item.quantity,
            })
            countId++;
        })
        addOrder(totalItemPrice+(totalItemPrice*0.07)+shipping,cartToPut,userID,getDate(cost.time), getDateDateFormat(cost.time));

        alert("Complete! Please proceed to order tab to pay your order");
    })
}
