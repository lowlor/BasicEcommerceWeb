import { formatCurrency } from "../scripts/utils/money.js";


export function getProduct(productId){
    let ans;
    console.log("search for this product");
    console.log(productId);
    
    products.forEach((item)=>{
        if(productId===item.id){
            ans = item;
        }
    })

    return ans;
}


class Product{
    id;
    name;
    img;
    priceCents;

    constructor(productDetails){
        this.id= productDetails.id
        this.name=productDetails.name;
        this.img=productDetails.img;
        this.priceCents= productDetails.priceCent;

    }
    

    getPrice(){
        return `${formatCurrency(this.priceCents)}`;
    }

    extraInfoHTML(){
        return ``;
    }
}

class Tablet extends Product{
    connectionType;

    constructor(productDetails){
        super(productDetails);
        this.connectionType = productDetails.connectionType;
    }

    extraInfoHTML(){
        return `
            <p>${this.connectionType}</p>
            <p>warranty: 2 year</p>
        `;
    }
}

class Phone extends Product{
    connection;

    constructor(productDetails){
        super(productDetails);
        this.connection = productDetails.connection;
    }

    extraInfoHTML(){
        return `
            <p>${this.connection}</p>
            <p>warranty: 1 year</p>

        `;
    }
}

export const products = (JSON.parse(localStorage.getItem('products')) || []).map((productDetails)=>{
    if(productDetails.type === 'Phone'){
        return new Phone(productDetails);
    }else if(productDetails.type=== 'Tablet'){
        return new Tablet(productDetails);
    }
    
});;

if(!products){
    products = "hello";
}

function saveToStorage(){
    localStorage.setItem('products', JSON.stringify(products));
}


export function addProduct(nameToPut,priceCentToPut,imgToPut){
    console.log("product to add :")

    products.push({
        id: 'p' + (products.length+1).toString(),
        name: nameToPut,
        priceCent : priceCentToPut,
        img : imgToPut,
        type : "Phone"
    })

    saveToStorage();

}
