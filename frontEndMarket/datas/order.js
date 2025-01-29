import { getDateNow, getDateNowDateFormat } from "../scripts/utils/date.js";
import { formatCurrency } from "../scripts/utils/money.js";



class Order{
    id;
    userId;
    orderTime;
    orderTimeDate;
    totalCostCent;
    products;
    status;
    payStatus;
    urlImg;

    constructor(details){
        console.log('create order');
        this.id=details.id;
        this.userId= details.userId;
        this.orderTime=details.orderTime;
        this.orderTimeDate= details.orderTimeDate;
        this.totalCostCent=details.totalCostCent;
        this.products=details.products;
        this.status=details.status;
        this.payStatus = details.payStatus;
        this.urlImg = details.slipImg;
    }

    changeStatus(status){
        console.log("current status: "+this.status +" to status : " +status);
        this.status = status;
        this.updateOrder();
    }

    changePayStatus(status){
        this.payStatus = status;
        this.updateOrder();
    }

    async changeSlip(slipImg){
        const newFileName = `slip${this.id}.png`; 

        const img = new File([slipImg], newFileName, { type: slipImg.type });

        this.urlImg = img;
        const formData = new FormData();
        formData.append('file', img);
        console.log(formData);
        
        try {
            const {data} = await axios
            .post(`http://localhost:5000/api/order/slip/${this.id}`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            console.log(data);
            
            if(data.status){
                console.log('send complete');
                alert('upload completed')
            }else{
                console.log('problem occured in server end');
                
            }
        } catch (error) {
            console.log("error in from data");
            console.log(error);
            
        }
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

    async updateOrder(){
        try {
            const {data} = await axios.put(`http://localhost:5000/api/order/${this.id}`,{
                id: this.id,
                userId: this.userId,
                orderTime: this.orderTime,
                orderTimeDate: this.orderTimeDate,
                totalCostCent: this.totalCostCent,
                products: this.products,
                status: this.status,
                payStatus: this.payStatus,
                slipImg : this.urlImg
            })
            if(data.status){
                console.log('order update successfull');
            }else{
                console.log('failed to update order');
            }
        } catch (error) {
            console.error('Error update:', error);
        }
    }
}

//export const orders = (JSON.parse(localStorage.getItem('orders')) || []).map((orderDetails) => {
//    return new Order(orderDetails);
//});

export const fetchOrders = async (userID)=>{
    console.log('goto fetchorder');
    
    try {
        const {data} = await axios.get(`http://localhost:5000/api/order/${userID}`);
        console.log(data);
        
        if (data.status){
            console.log(
                'enter this status =1'
            );
            
            return data.info.map((orderDetails) => {
                return new Order(orderDetails);
            });
        }
    } catch (error) {
        
    }
}

export async function addOrder(totalCostCent,cart,userID){

    const a = await getTotalOrder();
    const id = (a+1).toString();
    try {
        const {data} =  await axios.post("http://localhost:5000/api/order",{
            id: id,
            userId : userID,
            orderTime : getDateNow(),
            orderTimeDate : getDateNowDateFormat(),
            totalCostCent: totalCostCent,
            products:cart,
            status : "Waiting Comfirming Payment",
            payStatus : 0
        });    
        if(data.status){
            console.log('add order complete');
        
        }else{
            console.log('something wrong');
        }
    } catch (error) {
        alert('error on add order')
        console.log(error);
    }

}



async function getTotalOrder(){
    try {
        const {data} = await axios.get('http://localhost:5000/api/order/find/total');
        if(data.status){
            return data.info;
        }else{
            return 0;
        }
    } catch (error) {
        console.error(error);
    }

}

export async function getOrder(id,customerId){
    let aim;
    console.log(typeof(id));
    console.log("id");
    const orders = await fetchOrders(customerId); 
    console.log('this is order to all');
    console.log(orders);
    
    orders.forEach((item)=>{
        console.log(item.id);
        if(item.id === id){
            aim = item;
            console.log("found it");
        }
    })

    
    return aim;
}
