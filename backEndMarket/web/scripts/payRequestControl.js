import { getOrder } from "../datas/order.js";
import { addSlip } from "../datas/slips.js";
const url = new URL(window.location.href);

const order = getOrder(url.searchParams.get('orderId'));
console.log(order);

document.querySelector(".ConfirmBtn").addEventListener('click',()=>{
    addSlip(order.id,"fakeImg")
    order.changePayStatus(1);
    window.location.href = "orderPage.html";
})

