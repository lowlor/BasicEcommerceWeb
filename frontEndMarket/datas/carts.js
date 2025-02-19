class Cart{
    id;
    userId;
    products;
    deliveryOptionId;

    constructor(cartDetail){
        console.log(cartDetail);
        
        this.id = cartDetail.id;
        this.userId = cartDetail.userId;
        this.products = cartDetail.products;
        this.deliveryOptionId = cartDetail.deliveryOption;
    }

    
    async updateDelivery(type){
        this.deliveryOptionId = type;
        try {
            const {data} = await axios.put(`http://localhost:5000/api/cart/${this.id}`,{
                deliveryOptionId : this.deliveryOptionId
            });
            console.log(data.info)
            if(data.status){
                return data;
            }else{
                return 0;
            }
        } catch (error) {
            alert('error');
            console.log(error);
            return 0;
        }
    }


    //complete implement
    async updateCartProduct(productIdToPut, newQuantity){
        console.log(productIdToPut, newQuantity);

        this.products.forEach((item)=>{
            if(item.productId===productIdToPut){
                item.quantity = newQuantity;
            }
        })
        
        try {
            const {data} = await axios.put(`http://localhost:5000/api/cartDetail/${this.id}`,{
                productId : productIdToPut,
                quantity : newQuantity
            });
            console.log(data.info)
            if(data.status){
                return data;
            }else{
                return 0;
            }
        } catch (error) {
            alert('error');
            console.log(error);
            return 0;
        }
    }

    //complete implement
    async addProductData(newProduct){
        console.log(newProduct);
        try {
            const {data} = await axios.post(`http://localhost:5000/api/cart/addProduct/${this.id}`,{
                product : newProduct
            });
            if(data.status){
                console.log(data);
                
                return data;
            }else{
                console.log(data);

                return 0;
            }
        } catch (error) {
            alert('error');
            console.log(error);
            return 0;
        }
    }

    async removeProduct(productId){
        try {
            console.log(this.id, productId, ' this is cart id ------------------------------------');
            
            const {data} = await axios.delete(`http://localhost:5000/api/cartDetail/${productId}&${this.id}`);
            if(data.status){
                return data;
            }else{
                return 0;
            }
        } catch (error) {
            alert('error');
            console.log(error);
            return 0;
        }
    }

    async addProduct(checkName, selectedValue) {
        let flag = 1;

        console.log(this.products);
        
        
        //find product if found product in cart
        for (const product of this.products) {
            console.log('find ', checkName, 'of', product.productId);
            
            if (product.productId == checkName) {
                
                product.quantity += selectedValue;
                flag = 0;
                await this.updateCartProduct(product.productId, product.quantity); // Now properly awaited
                break; // Exit loop early if found
            }
        }
    
    
    
    
        //if not create new product in cart
        if (flag) {
            console.log('go get new product');
            
            await this.addProductData({
                id: checkName,
                quantity: selectedValue
            })
            
        }
    
    
    }
    
    getAllCartQuantity(){
        
        //try {
        //    const {data} = await axios.get(`http://localhost:5000/api/cartDetail/totalQuantity/${productId}`);
        //    if(data.status){
        //        return data;
        //    }else{
        //        return 0;
        //    }
        //} catch (error) {
        //    alert('error');
        //    console.log(error);
        //    return 0;
        //}

        let quantity = 0;
        this.products.forEach((item)=>{
            quantity += item.quantity;
        })
    
        return quantity;
    }
    
    
}

export let fetchCart = async (userId)=>{
    try {
        const {data} = await axios.get(`http://localhost:5000/api/cart/${userId}`);
        console.log(data)
        if(data.status){
            return new Cart(data.info[0]);
        }else{
            return 0;
        }
    } catch (error) {
        alert('error');
        console.log(error);
        return 0;
    }
}


