export let cart = JSON.parse(localStorage.getItem('cart'));


if(!cart){
    cart = [];    
}

function saveToStorage(){
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addProduct(checkName, cartNumber, quantityNumber) {
    console.log(checkName);
    let option = document.querySelector(`.quantityBox[data-product-id="${checkName}"]`);

    console.log(option);
    let selectedValue = parseInt(option.options[option.selectedIndex].value);
    let flag = 1;

    cart.forEach((product) => {
        if (product.id == checkName) {
            product.quantity += selectedValue;
            flag = 0;
            console.log(cart);
        }
    });

    if (flag) {
        cart.push({
            id: checkName,
            quantity: selectedValue,
            deliveryOptionId: "1"
        });
        console.log(cart);
    }


    console.log(cartNumber.innerHTML);

    saveToStorage();
}


export function removeFromCart(productId){
    const newCart = [];
    
    cart.forEach((cartItem)=>{
        if (cartItem.id !== productId){
            newCart.push(cartItem);
        }
    }
    );

    cart = newCart;

    saveToStorage();
}

export function getAllCartQuantity(){
    let quantity = 0;
    cart.forEach(function(item){
        quantity+= item.quantity;
    })

    return quantity;
}

export function updataQuantity(productId, newQuantity){
    cart.forEach((item)=>{
        if(item.id===productId){
            item.quantity = newQuantity;
        }
    })

    saveToStorage();
}

export function updateDelivery(productId, type){
    cart.forEach((item)=>{
        if(item.id===productId){
            item.deliveryOptionId = type;
        }
    })

    saveToStorage();

}

export function getCart(productId){
    let a;
    cart.forEach((item)=>{
        if(item.id==productId){
            a = item;
        }
    })

    return a;
}