import { addProduct } from "../datas/products.js";
import { getOrder, orders } from "../datas/order.js";

let html = '';



document.querySelector(".addProductBtn").addEventListener("click",()=>{
    let imgToPut = document.querySelector(".imgInput");
    let productNameToPut = document.querySelector(".productName");
    let productPriceCentToPut = document.querySelector(".productPrice");

    addProduct(productNameToPut.value,productPriceCentToPut.value,"\images\oppoPhone.webp");
});

orders.forEach(()=>{
    html+= `
        <p>Select Customer Shipping</p>
            <select class="selectId" name="" id="">
                ${addOptionHtml()}
            </select>
    `
})



document.querySelector('.shippingIdOption').innerHTML = html;

let currStatus = document.querySelector(".selectId"); 
let selectStatus = document.querySelector('.statusOption');
document.querySelector(".currStatus").innerHTML = `currently Selected Id : ${currStatus.options[currStatus.selectedIndex].text} `;



function addOptionHtml(){
    let html = '';
    let num = 0;
    orders.forEach((order)=>{
        if (num ===0){
            html += `
            <option value="${order.id}" selected="selected">${order.id}</option>
            `;    
        }else{
            html += `
            <option value="${order.id}">${order.id}</option>
            `;    

        }

    })

    return html;
}

currStatus.addEventListener('change',()=>{
    document.querySelector(".currStatus").innerHTML = `
    Currently Status = ${currStatus.value}
    `;
})

document.querySelector('.changeShippingStatusBtn').addEventListener("click",()=>{
    let order = getOrder(currStatus.value);
    console.log("prepare to change status :");
    console.log(order);
    console.log(selectStatus.value);
    console.log(selectStatus);
    order.changeStatus(selectStatus.value);
    alert("ok");
})