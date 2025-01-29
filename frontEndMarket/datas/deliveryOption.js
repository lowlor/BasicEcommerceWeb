export const deliveryOption = [{
    deliveryId : '1',
    deliveryName : 'Normal',
    price: 500,
    time: 3
},{
    deliveryId : '2',
    deliveryName : 'express',
    price: 1000,
    time: 2
},{
    deliveryId : '3',
    deliveryName : 'same day',
    price: 2000,
    time: 1
}]

export function getDelivery(deliveryId){
    
    let a;
    deliveryOption.forEach((curr)=>{
        if (curr.deliveryId===deliveryId){
            a = curr;
        }
    })
    return a;
}