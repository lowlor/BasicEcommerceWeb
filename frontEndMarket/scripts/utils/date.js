

export function getDate(number){
    let v = new Date();

    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    
    let normalDeliveryDate = new Date(v.getTime()+(86400000*number));
    
    return `${normalDeliveryDate.getDate()} ${month[normalDeliveryDate.getMonth()]} ${normalDeliveryDate.getFullYear()}`;

    
}

export function getDateDateFormat(number){
    let v = new Date();

    
    const offset = v.getTimezoneOffset()
    v = new Date((v.getTime() - (offset*60*1000))+(86400000*number))

    return v.toISOString().split('T')[0]

}

export function getDateNow(){
    let v = new Date();

    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    
    let normalDeliveryDate = new Date(v.getTime());
    
    return `${normalDeliveryDate.getDate()} ${month[normalDeliveryDate.getMonth()]} ${normalDeliveryDate.getFullYear()} ${normalDeliveryDate.getHours()} ${normalDeliveryDate.getMinutes()}`;

}

export function getDateNowDateFormat(){
    let v = new Date();
    const offset = v.getTimezoneOffset()
    v = new Date(v.getTime() - (offset*60*1000))
    
    return v.toISOString().split('T')[0]

}



