import {fetchCart} from "../datas/carts.js";
import { formatCurrency } from "./utils/money.js";
import {getDate} from "./utils/date.js"
import {deliveryOption, getDelivery} from "../datas/deliveryOption.js";
import {getProduct,products} from "../datas/products.js";
import {updatePrice} from "./paymentSection.js";
import { fetchUser } from "../datas/user.js";

export async function updateOrderSection(userId){


    let cartHtml = "";
    const cart = await fetchCart(userId);
    console.log("ekeksks");
    
    console.log(cart);
    
    for(const item of cart.products){
        console.log("thisis item porduct id")        
        console.log(item.id);
        console.log(item);
        
        //let product = awit products();
        
        
        const product = await getProduct(item.productId);
        console.log(product);
         

        let dayHeader = getDelivery(cart.deliveryOptionId);

        console.log(dayHeader);
        console.log('heeeee')
        console.log(dayHeader.time);
        console.log(dayHeader.time);

        
        cartHtml += `
                    <div class="item js-itemOf${product.id}">
                        <div class="itemReal">
                            <img class="productImg" src="${product.img}" alt="">
                            <div class="itemText">
                                <h2 class="productName">${product.name}</h2>
                                <h3 class="priceEach">${formatCurrency(product.priceCents)} <i class="fa-solid fa-dollar"></i></h3>  
                                <p class="quantityTitle" data-product-id="${product.id}">Quantity : ${item.quantity}</p>
                                <button class="updateBtn" id="upBtn-${product.id}" data-product-id="${product.id}">update</button> 
                                <input type="text" class="quantity-input" data-product-id="${product.id}">
                                <button class="save-quantity-link link-primary" data-product-id="${product.id}">Save</button>   
                                <button class="deleteBtn" data-product-id="${product.id}">delete</button>     
                            </div>    
                        </div>
                    </div>
    `
       
    };

    console.log('-----------------------------------------');
    
    console.log(cartHtml);
    console.log('-----------------------------------------');
    

    document.querySelector('.cartNumber').innerHTML = cart.getAllCartQuantity();

    

    document.querySelector('.items').innerHTML = cartHtml;

    document.querySelectorAll(".deleteBtn").forEach(async function(link){
        link.addEventListener('click', async function(){
            const productId = link.dataset.productId;
            await cart.removeProduct(productId);
            console.log(cart)
            const container = document.querySelector(`.js-itemOf${productId}`);
            container.remove();

            document.querySelector('.cartNumber').innerHTML = cart.getAllCartQuantity();

            console.log(cart);
            console.log("deleteetetete");
            await updatePrice(userId);
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


    


    document.querySelectorAll('.link-primary').forEach((link)=>{
        link.addEventListener('click',async ()=>{
            const productId = link.dataset.productId;
            console.log(productId);
            const newQuantity = document.querySelector(`.quantity-input[data-product-id="${productId}"]`).value;
            await cart.updateCartProduct(productId, parseInt(newQuantity));

            //update
            document.querySelector('.cartNumber').innerHTML = cart.getAllCartQuantity();


            
            updatePrice(userId);

            document.querySelector(`#upBtn-${productId}`).style.display = 'initial';
            document.querySelector(`.quantity-input[data-product-id="${productId}"]`).style.display = 'none';
            document.querySelector(`.link-primary[data-product-id="${productId}"]`).style.display = 'none';

            updateOrderSection(userId);
            
        })
    })
}