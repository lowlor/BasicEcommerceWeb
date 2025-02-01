import { fetchOrders, getOrder } from "../datas/order.js";
import { addProduct } from "../datas/products.js";
import { fetchUser } from "../datas/user.js";
import { logout } from "./utils/auth.js";
//import { getOrder, orders } from "../datas/order.js";

let html = '';
let currentOrder;

document.querySelector(".addProductBtn").addEventListener("click",()=>{
    const imgToPut = document.querySelector(".imgInput").files[0];
    const productNameToPut = document.querySelector(".productName");
    const productPriceCentToPut = document.querySelector(".productPrice");

    addProduct(productNameToPut.value,productPriceCentToPut.value,imgToPut);
});

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

async function customerSection(){
    let html = '';
    const customerText = await getCustomerHtml();
    html+= `
        <p>Select customer</p>
            <select name="" id="customerOption">
                ${customerText}
            </select>
        <button id="customerBtn">Enter</button>
        `
    
    document.querySelector('.customerChoice').innerHTML = html;
    
    document.querySelector('#customerBtn').addEventListener('click',async ()=>{
        const customerId = document.querySelector('#customerOption').value;
        console.log(customerId);
        
        (async () =>{
            orderSection(customerId)
        })();
    
    })
}

async function orderSection(customerId){
    let html = '';
    
    const orderText = await getOrderHtml(customerId);

    html+= `
      <p>Select customer order</p>
          <select name="" id="orderOption">
              ${orderText}
          </select>
    <button id="orderBtn">Enter</button>
      `
    document.querySelector('.shippingIdOption').innerHTML = html;
 
    document.querySelector('#orderBtn').addEventListener('click',async ()=>{

        currentOrder = await getOrder(document.querySelector('#orderOption').value,customerId);

        console.log('-------------------------------------------');
        console.log(document.querySelector('#orderOption').value);
        
        console.log(currentOrder);
        
        console.log('-------------------------------------------');
        

        
        document.querySelector(".currStatus").innerHTML = `
        Currently Status = ${currentOrder.status}
        `;
    
        if(currentOrder.status === 'Waiting Comfirming Payment'){
            console.log('goto slip section');
            
            document.querySelector('.slipSection').style.display = 'block';

            slipSection(currentOrder);
        }else{
            document.querySelector('.shippingOption').style.display = 'block';
            document.querySelector('.changeShippingStatusBtn').style.display = 'block';

    
        }
    })
}

async function getCustomerHtml(){
    const users = await fetchUser()


    let html = '';
    let num = 0;
    users.forEach((user)=>{
        if (num ===0){
            html += `
            <option value="${user.id}" selected="selected">${user.id} ${user.username}</option>
            `;    
        }else{
            html += `
            <option value="${user.id}">${user.id} ${user.username}</option>
            `;    

        }

    })

    return html;


}

async function getOrderHtml(customerId){
    const orders = await fetchOrders(customerId);


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












async function slipSection(order) {
    console.log(order);
    let html;
    if(order.payStatus === 0){
        console.log('go to this');
        
        html = `
        <p class="slipText">Slip not yet be sent</p>
    `;
    }else{
        html = `
        <p class="slipText">Slip</p>
        <img class="slipImg" src="${(order.urlImg).toString()}" alt="">
    `;
    document.querySelector('.acceptSlip').style.display = 'block';

    }
    
    
    
    document.querySelector('.slipSection').innerHTML = html;

} 

document.querySelector('.acceptSlip').addEventListener('click',()=>{
    currentOrder.changeStatus("Packed")
});
document.querySelector('.changeShippingStatusBtn').addEventListener("click",()=>{
    let selectStatus = document.querySelector('.statusOption');
    
    console.log("prepare to change status :");
    currentOrder.changeStatus(selectStatus.value);
    alert("ok");
});

customerSection();