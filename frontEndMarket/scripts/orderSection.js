import {fetchCartInfo, getCart,removeFromCart,getAllCartQuantity, updataQuantity, updateDelivery} from "../datas/carts.js";
import { formatCurrency } from "./utils/money.js";
import {getDate} from "./utils/date.js"
import {deliveryOption, getDelivery} from "../datas/deliveryOption.js";
import {getProduct,products} from "../datas/products.js";
import {updatePrice} from "./paymentSection.js";

export async function updateOrderSection(){


    let cartHtml = "";
    const cart = await fetchCartInfo()
    console.log("ekeksks");


    cart.forEach(function(item){
        console.log("thisis item porduct id")        
        console.log(item.id);
        console.log(item);
        
        //let product = awit products();
        let product =item; 
        console.log(item.deliveryOptionId);

        let dayHeader = getDelivery(item.deliveryOption);

        console.log(dayHeader);
        console.log('heeeee')
        console.log(dayHeader.time);
        console.log(dayHeader.time);
        
        cartHtml += `
                    <div class="item js-itemOf${product.id}">
                        <div class="dueDate">
                            <h3 class="dueDate" data-product-id="${product.id}">${getDate(dayHeader.time)}</h3>
                        </div>
                        <div class="itemReal">
                            <img class="productImg" src="${product.img}" alt="">
                            <div class="itemText">
                                <h2 class="productName">${product.name}</h2>
                                <h3 class="priceEach">${formatCurrency(product.priceCents)} <i class="fa-solid fa-dollar"></i></h3>  
                                <p class="quantityTitle" data-product-id="${product.id}">Quantity : ${item.quantity}</p>
                                <p class="deliveryOption">Choose a delivery option</p>
                                <select name="quantity" id="quantity" class="quantityBox" data-product-id="${product.id}">
                                    ${addOption(item)}
                                </select>  
                                <button class="updateBtn" id="upBtn-${product.id}" data-product-id="${product.id}">update</button> 
                                <input type="text" class="quantity-input" data-product-id="${product.id}">
                                <button class="save-quantity-link link-primary" data-product-id="${product.id}">Save</button>   
                                <button class="deleteBtn" data-product-id="${product.id}">delete</button>     
                            </div>    
                        </div>
                    </div>
    `
       
    });

    document.querySelector('.cartNumber').innerHTML = getAllCartQuantity();

    function addOption(item){
        let html = '';
        let number = 1;

        console.log(item)
        console.log("this in addoption")
        deliveryOption.forEach((currOption)=>{
            if(currOption.deliveryId == item.deliveryOptionId){
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

    document.querySelector('.items').innerHTML = cartHtml;

    document.querySelectorAll(".deleteBtn").forEach(function(link){
        link.addEventListener('click',function(){
            const productId = link.dataset.productId;
            removeFromCart(productId);
            console.log(cart)
            const container = document.querySelector(`.js-itemOf${productId}`);
            container.remove();

            document.querySelector('.cartNumber').innerHTML = getAllCartQuantity();

            console.log(cart);
            console.log("deleteetetete");
            updatePrice();
        })
    })

    let upBtn = document.querySelectorAll(".updateBtn");
    upBtn.forEach((link)=>{
        link.addEventListener('click',()=>{
            const productId = link.dataset.productId;
            console.log(productId);
            document.querySelector(`#upBtn-${productId}`).style.display = 'none';
            document.querySelector(`.quantity-input[data-product-id="${productId}"]`).style.display = 'initial';
            document.querySelector(`.link-primary[data-product-id="${productId}"]`).style.display = 'initial';

    
        })
    })


    document.querySelectorAll('#quantity').forEach((link)=>{
        link.addEventListener('change',()=>{
            const productId = link.dataset.productId;
            updateDelivery(productId,link.value);
            updatePrice();
            console.log(cart);
            updateOrderSection();
        })
    })


    document.querySelectorAll('.link-primary').forEach((link)=>{
        link.addEventListener('click',()=>{
            const productId = link.dataset.productId;
            console.log(productId);
            const newQuantity = document.querySelector(`.quantity-input[data-product-id="${productId}"]`).value;
            updataQuantity(productId, parseInt(newQuantity));

            //update
            document.querySelector('.cartNumber').innerHTML = getAllCartQuantity();

            updatePrice();

            document.querySelector(`#upBtn-${productId}`).style.display = 'initial';
            document.querySelector(`.quantity-input[data-product-id="${productId}"]`).style.display = 'none';
            document.querySelector(`.link-primary[data-product-id="${productId}"]`).style.display = 'none';

            updateOrderSection();
        })
    })
}