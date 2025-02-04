import { formatCurrency } from "../scripts/utils/money.js";

export async function getProduct(productId){
    try {
        const {data} = await axios.get(`http://localhost:5000/api/product/${productId}`);
        console.log(data.info)
        if(data.status){
                return new Product(data.info);
                
                
        }else{
            return 0;
        }
    } catch (error) {
        alert('error');
        console.log(error);
        return 0;
    }
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
        this.priceCents= productDetails.priceCents;

    }
    

    getPrice(){
        return `${formatCurrency(this.priceCents)}`;
    }

    extraInfoHTML(){
        return ``;
    }
}


export const products = async ()=>{
    try {
        const {data} = await axios.get("http://localhost:5000/api/product");
        console.log(data.info)
        if(data.status){
            return data.info.map((productDetails)=>{
                return new Product(productDetails);
            });
        }else{
            return 0;
        }
    } catch (error) {
        alert('error');
        console.log(error);
        return 0;
    }
}


if(!products){
    products = "hello";
}

function saveToStorage(){
    localStorage.setItem('products', JSON.stringify(products));
}


export async function addProduct(nameToPut,priceCentToPut,imgToPut){

    
    const num = await totalProduct();

    const newFileName = `p${num+1}.png`;

    const img = new File([imgToPut], newFileName,{ type: imgToPut.type});
    const formData = new FormData();
    formData.append('file', img);

    try {
        const {data} = await axios.post("http://localhost:5000/api/product/add",{
        id: 'p' + (num+1).toString(),
        name: nameToPut,
        priceCent : priceCentToPut,
        type : "Phone"
        })
    } catch (error) {
        console.log('error on the addProduct---------------');
        console.error(error);
        console.log('error on the addProduct---------------');
        
    }
    try {
        const {data} = await axios.post(`http://localhost:5000/api/product/addImg/${'p'+(num+1).toString()}`,formData, {
        headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if(data.status){
            console.log('send complete');
            alert('upload completed')
        }else{
            console.log('problem occured in server end');
            
        }
    } catch (error) {
        console.log('error on the addProductImg---------------');
        console.error(error);
        console.log('error on the addProductImg---------------');
        
    }
}

export async function totalProduct(){

    const productList = await products();
    console.log(productList.length);
    
    if (productList.length){
        return productList.length;
    }else{
        return 0;
    }
} 
