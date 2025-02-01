export async function auth(username,password){
    try{
        const {data} = await axios.post('http://localhost:5000/api/auth', {
            username: username,
            password : password
        },{ withCredentials: true});

        console.log(data);
        console.log(data.status);
        
        if(data.status=='2'){
            console.log('return 1');
            alert('logIn completed')    
            return 2;
        }else if(data.status=='1'){
            console.log('return 1');
            alert('logIn completed')    
            return 1;
        }else{
            console.log('return 0');
            alert('Username or password Incorrect')    
            return 0;
        }

    } catch (error){
        alert('error occured');
        console.log(error);
        
    }
 
}

export async function register(username, password){
    try {
        const {data} = await axios.post('http://localhost:5000/api/register',{
            username: username,
            password : password
        },{ withCredentials: true});
        if(data.status){
            console.log('return 1');
            alert('register completed')    
            return 1;
        }else{
            console.log('return 0');
            alert('register incomplete')    
            return 0;
        }        
    } catch (error) {
        console.error(error);
    }
}

export async function logout(){
    try {
        const {data} = await axios.post('http://localhost:5000/api/logout',{},{ withCredentials: true});
        if(data.status){
            console.log('return 1');
            alert('logOut completed')    
            return 1;
        }else{
            console.log('return 0');
            alert('logOut incomplete')    
            return 0;
        }

    } catch (error) {
        console.error(error);
    }
}

export async function verifyAuth(){
    console.log('go to fnction');
    
    try {
        console.log('check post');
        
        const {data} = await axios.post('http://localhost:5000/api/reauth',
            {},{ withCredentials: true});
        console.log(data);
        
        if(data.status){
            console.log('return 1');   
            return {status:1,
                info: data.info
            };
        }else{
            console.log('return 0');
            alert('auth wrong')    
            return {status:0,
                info: data.info
            };
        }
    
    } catch (error) {
        console.error(error);
        return 0;
    }
}