class Product{
    id;
    name;
    img;
    priceCent;

    constructor(productDetails){
        this.id= productDetails.id
        this.name=productDetails.name;
        this.img=productDetails.img;
        this.priceCent= productDetails.priceCent;
    }
    getProduct(productId){
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
}

export const products = [{
    id: "p1",
    name: "google pixel 8 pro",
    img: "images/pixel.jpg",
    priceCent: "99999"
},{
    id: "p2",
    name: "Samsung Galaxy s24 ultra",
    img: "images/th-galaxy-s24-s928-sm-s928bzycthl-thumb-539305998.webp",
    priceCent: "129999"
},{
    id: "p3",
    name: "Samsung Galaxy tab s9 ultra",
    img: "images/tabS9.avif",
    priceCent: "139999"
}].map((productDetails)=>{
    return new Product(productDetails);
});