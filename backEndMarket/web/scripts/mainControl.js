import {addProduct, cart, getAllCartQuantity} from "../datas/carts.js";
import { formatCurrency } from "./utils/money.js";
import { products } from "../datas/products.js";

let productHtml = "";
let cartNumber = document.querySelector(".cartNumber");

let quantityNumber = 0;
console.log(products);
products.forEach((product)=>{
    console.log(product);
    productHtml += `
        <div class="product">
            <img class="productImg" src=${product.img} alt="">
            <h2 class="productName">${product.name}</h2>
            <h3 class="productPrice">${product.getPrice()} <i class="fa-solid fa-dollar"></i></h3>
            <select name="quantity" id="quantity" class="quantityBox" data-product-id=${product.id}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
            <button class="productBuy" data-product-id=${product.id}>put to cart</button>

            ${product.extraInfoHTML()}
        </div>
    `
});

document.querySelector('.cartNumber').innerHTML = getAllCartQuantity();

document.querySelector('.containerProducts').innerHTML = productHtml;

document.querySelectorAll('.productBuy').forEach(
    function(button){
        button.addEventListener("click",function(){
            console.log(button.dataset.productId);
            let checkName = button.dataset.productId;

            addProduct(checkName, cartNumber, quantityNumber);

            document.querySelector('.cartNumber').innerHTML = getAllCartQuantity();
            
        });
    });

console.log(document.querySelectorAll('.productBuy'));