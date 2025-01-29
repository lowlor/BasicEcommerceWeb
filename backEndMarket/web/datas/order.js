import { getDateNow } from "../scripts/utils/date.js";
import { formatCurrency } from "../scripts/utils/money.js";



class Order{
    id;
    orderTime;
    totalCostCent;
    products;
    status;
    payStatus;

    constructor(details){
        console.log('create order');
        this.id=details.id;
        this.orderTime=details.orderTime;
        this.totalCostCent=details.totalCostCent;
        this.products=details.products;
        this.status=details.status;
        this.payStatus = details.payStatus;
    }

    changeStatus(status){
        console.log("current status: "+this.status +" to status : " +status);
        this.status = status;
        saveToStorage();
    }

    changePayStatus(status){
        this.payStatus = status;
        saveToStorage();
    }

    getTotalCost(){
        return formatCurrency(this.totalCostCent);
    }

    getProduct(id){
        let aim;

        this.products.forEach((product)=>{
            console.log(product.productId);
            console.log("findig");
            console.log(id);
            if (product.productId=== id){
                aim = product;
                console.log("found");
            }
        })
        return aim;
    
    }
}

export const orders = (JSON.parse(localStorage.getItem('orders')) || []).map((orderDetails) => {
    return new Order(orderDetails);
});

function saveToStorage(){
    localStorage.setItem('orders',JSON.stringify(orders));

}

export function addOrder(totalCostCent,cart){

    const heo = {
        id:(getTotalOrder()+1).toString(),
        orderTime : getDateNow(),
        totalCostCent: totalCostCent,
        products:cart,
        status : "Waiting Comfirming Payment",
        payStatus : 0
    };
    orders.push(heo);
    saveToStorage();
    console.log(orders);
}


function getTotalOrder(){
    let count =0;
    orders.forEach(()=>{
        count++;
    })

    return count++;
}

export function getOrder(id){
    let aim;
    console.log(typeof(id));
    console.log("id");
    orders.forEach((item)=>{
        console.log(item.id);
        if(item.id === id){
            aim = item;
            console.log("found it");
        }
    })
    return aim;
}


