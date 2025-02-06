import {fetchCart} from "../datas/carts.js";
import { formatCurrency } from "./utils/money.js";
import { getProductByKeyword, products } from "../datas/products.js";
import { logout, verifyAuth } from "./utils/auth.js";



const initial = async(userId,username, productToPut)=>{
    document.querySelector('.userInfo').innerHTML = "Welcome back..."+username
    let productHtml = "";
    let cartNumber = document.querySelector(".cartNumber");
    let cart = await fetchCart(userId);
    console.log(cart);
    
    const productList = productToPut;
    let quantityNumber = 0;
    console.log(productList);
    for(const product of productList){
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
            </div>
        `
    };
    
    document.querySelector('.cartNumber').innerHTML = cart.getAllCartQuantity();
    
    document.querySelector('.containerProducts').innerHTML = productHtml;
    
    document.querySelectorAll('.productBuy').forEach(
        async function(button){
            button.addEventListener("click",async function(){
                console.log(button.dataset.productId);
                let checkName = button.dataset.productId;
    
                let option = document.querySelector(`.quantityBox[data-product-id="${checkName}"]`);
                let selectedValue = parseInt(option.options[option.selectedIndex].value);

                console.log(checkName, cartNumber, selectedValue);
                
                await cart.addProduct(checkName, selectedValue);
    
                cart = await fetchCart(userId);
                console.log('added new product');                
                document.querySelector('.cartNumber').innerHTML = cart.getAllCartQuantity();
                

            });
        });

    document.querySelector('.search').addEventListener('click',async()=>{
        const keyword = document.querySelector('.searchBox').value;
        const productList = await getProductByKeyword(keyword);
        console.log(productList);
        
        initial(userId,username,productList);
        
    })
    
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
    console.log(document.querySelectorAll('.productBuy'));
}

const loginAuth = async()=>{
    return await verifyAuth()
}

(async ()=>{
    const isAuth = await loginAuth();
    if(isAuth.status){
        console.log('goto main');
        console.log(isAuth.info);
        
        const productList = await products();
        
        
        initial(isAuth.info.id,isAuth.info.username,productList);
    }else{
        window.location.href = "loginPage.html";
    }
    
})();
