class User{
    id;
    username;
    password;
    role;

    constructor(cusDetails){
        this.id = cusDetails.id;
        this.username = cusDetails.username; 
        this.password = cusDetails.password;
        this.role = cusDetails.role;
    }

}
export const fetchUser = async (userID)=>{
    
    try {
        const {data} = await axios.get(`http://localhost:5000/api/user`);
        console.log(data);
        
        if (data.status){
            console.log(
                'enter this status =1'
            );
            
            return data.info.map((cusDetails) => {
                return new User(cusDetails);
            });
        }
    } catch (error) {
        
    }
}
