

export function getDate(number){
    let v = new Date();

    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    
    let normalDeliveryDate = new Date(v.getTime()+(86400000*number));
    
    return `${normalDeliveryDate.getDate()} ${month[normalDeliveryDate.getMonth()]} ${normalDeliveryDate.getFullYear()}`;

    
}

export function getDateNow(){
    let v = new Date();

    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    
    let normalDeliveryDate = new Date(v.getTime());
    
    return `${normalDeliveryDate.getDate()} ${month[normalDeliveryDate.getMonth()]} ${normalDeliveryDate.getFullYear()} ${normalDeliveryDate.getHours()} ${normalDeliveryDate.getMinutes()}`;

}



