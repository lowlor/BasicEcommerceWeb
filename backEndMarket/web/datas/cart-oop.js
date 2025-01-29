function Cart(localStorageKey){
    const cart ={
        cartItem :undefined,
    
        loadFromStorage(){
            this.cartItem = JSON.parse(localStorage.getItem(localStorageKey));
    
    
            if(!this.cartItem){
                this.cartItem = [];    
            }
        },
    
        saveToStorage(){
            localStorage.setItem(localStorageKey, JSON.stringify(this.cartItem));
        },
    
        addProduct(checkName, cartNumber) {
            console.log(checkName);
            let option = document.querySelector(`.quantityBox[data-product-id="${checkName}"]`);
        
            console.log(option);
            let selectedValue = parseInt(option.options[option.selectedIndex].value);
            let flag = 1;
        
            this.cartItem.forEach((product) => {
                if (product.id == checkName) {
                    product.quantity += selectedValue;
                    flag = 0;
                    console.log(this.cartItem);
                }
            });
        
            if (flag) {
                this.cartItem.push({
                    id: checkName,
                    quantity: selectedValue,
                    deliveryOptionId: "1"
                });
                console.log(this.cartItem);
            }
        
        
            console.log(cartNumber.innerHTML);
        
            this.saveToStorage();
        },
        
        
        removeFromCart(productId){
            const newCart = [];
            
            this.cartItem.forEach((cartItem)=>{
                if (cartItem.id !== productId){
                    newCart.push(cartItem);
                }
            }
            );
        
            this.cartItem = newCart;
        
            this.saveToStorage();
        },
        
        getAllCartQuantity(){
            let quantity = 0;
            this.cartItem.forEach(function(item){
                quantity+= item.quantity;
            })
        
            return quantity;
        },
        
        updataQuantity(productId, newQuantity){
            this.cartItem.forEach((item)=>{
                if(item.id===productId){
                    item.quantity = newQuantity;
                }
            })
        
            this.saveToStorage();
        },
        
        updateDelivery(productId, type){
            this.cartItem.forEach((item)=>{
                if(item.id===productId){
                    item.deliveryOptionId = type;
                }
            })
        
            this.saveToStorage();
        
        },
        
        getCart(productId){
            let a;
            this.cartItem.forEach((item)=>{
                if(item.id==productId){
                    a = item;
                }
            })
        
            return a;
        }
    };

    return cart;
}

const cart = new Cart('cart-oop');
const bussinessCart = new Cart('cart-busniess');


cart.loadFromStorage();
bussinessCart.loadFromStorage();