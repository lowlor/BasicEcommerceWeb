export const slip = JSON.parse(localStorage.getItem('slip')) || [{
    customerId : '1',
    orderId : '1',
    img: 'images/pixel.jpg'
}];

function saveToStorage(){
    localStorage.setItem('slip',JSON.stringify(slip));
}

export function addSlip(orderIdPut,imgPut){
    slip.push({
        customerId:1,
        orderId:orderIdPut,
        img: 'images/pixel.jpg'
    })

    saveToStorage();
    alert("addSuccess"+ orderIdPut, imgPut)
}