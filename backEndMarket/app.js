const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const app = express();

const mysql = require('mysql');
const { resourceLimits } = require('worker_threads');
const { info, log } = require('console');


const sessionStore = new MySQLStore({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'sessionView'
});
app.use(session({
    secret : 'ereprwpedf',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, 
        sameSite : 'None'
    }
}))
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'market'
});

app.use(cors({
    origin: 'http://127.0.0.1:3000',
    credentials : true
}));

const handleError = (err, res) => {
    res
      .status(500)
      .contentType("text/plain")
      .end("Oops! Something went wrong!");
  };


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const endpoint = req.originalUrl;
        if (endpoint.includes('/product/addImg')) {
            cb(null, path.join(__dirname, 'public/images/products')); 
        } else if (endpoint.includes('/order/slip')) {
            cb(null, path.join(__dirname, 'public/images/slips')); 
        } else {
            cb(new Error('Unknown upload destination'), null);
        }
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = file.originalname.split(ext)[0]; 
        cb(null, `${name}${ext}`); 
    }
});




const upload = multer({
    storage
})


app.use(express.urlencoded({ extended: false}));
app.use(express.json());

//
app.use('/images',express.static(path.join(__dirname,'public/images')));


app.post('/api/auth',(req,res)=>{
    const data = req.body;
    console.log(data);

    

    const textToInsert = 'SELECT * FROM user WHERE username = ?';
    connection.query(textToInsert, [data.username], (err, result, fields) => {
        if (err) throw err
        console.log(result);
        
        if(result.length > 0){
            console.log('print---------------when login-----');
            console.log(data.password);
            console.log(result[0].password);
            
            console.log('print-----------when login ---------');

            bcrypt.compare(data.password,result[0].password,(err, match)=>{
                console.log('goto comapre');
                console.log(match);
                
                if(err){
                    console.error('error in hash compare');
                    res.status(201).send({
                        status:0,
                        info:'error in compare hash'
                    })
                }
                console.log('pass compare');
                
                if(match){
                    console.log('dededededeeeeeeeeeeeeeeeeeeeeeeeeeeeee',result[0]);
            
                    req.session.user = { id : result[0].id , username : data.username};

                    console.log(req.session);
            
                    
                    if(result[0].role === 'admin'){
                        console.log('-------------------------------adminlogin-----------------------------------------');
                        
                        return res.status(200).send({
                            status : 2,
                            info : 'auth is valid',
                        });
                    }else{
                        console.log('-----------------------------------user lonign-------------------------');
                        
                        return res.status(200).send({
                            status : 1,
                            info : 'auth is valid',
                        });
                    }
                    
                    
                }else{
                    console.log('incorrect username');
                    
                    res.status(201).send({
                        status : 0,
                        info : "Username or password not found in database"

                    });
                }
            })
            
            
        }else{
            res.status(201).send({
                status : 0,
                info : "Username not found"
            });
        }
    })
})

app.post('/api/register', (req,res)=>{

    const data = req.body;
    console.log(data);
    
    connection.query('SELECT * FROM user WHERE username = ? ', [data.username],(err,result,field)=>{
        if(err){
            console.error('error in hashing');
            return res.status(500).send({
                status:0,
                info:"error in hashing"
            })   
        }else if(result[0]){
            return res.status(500).send({
                status:0,
                info:"username got taken"
            })   
        }else{
            bcrypt.hash(data.password, 10, (err,hash)=>{
                if( err){
                    console.error('error in hashing');
                    return res.status(500).send({
                        status:0,
                        info:"error in hashing"
                    })
                }

                console.log('print---------------when regis-----');
                console.log(data.password);
                console.log(hash);
                
                console.log('print-----------when regis ---------');

                bcrypt.compare(data.password,hash,(err,result)=>{
                    if(err){
                        console.log(err);
                    }
                    console.log('test hash result');
                    
                    console.log(result);
                    
                })
                connection.query('SELECT COUNT(*) AS count FROM `user`', (err,result,field)=>{
                    console.log('entercount user');
                    
                    if( err){
                        console.error('error in counting');
                        return res.status(500).send({
                            status:0,
                            info:"error in counting"
                        });
                    }
            
                    const idToinsert ='u'+(result[0].count+1).toString();
                    
                    connection.query('INSERT INTO `user`(`id`, `username`, `password`, `role`) VALUES (?,?,?,?)',
                        [idToinsert, data.username, hash, 'customer'],(err,result,field)=>{
                            console.log('enter insert user');
                            
                            if( err){
                                console.error('error in insert new user', err);
                                return res.status(500).send({
                                    status:0,
                                    info:"error in insert new user"
                                });
                            }
                            connection.query('SELECT COUNT(*) AS count FROM `cart`', (err,result,field)=>{
                                console.log('enter count cart');
                                
                                if( err){
                                    console.log(err);

                                    console.error('error in counting');
                                    return res.status(500).send({
                                        status:0,
                                        info:"error in counting"
                                    });
                                }
                        
                                const cartIdToinsert ='c'+(result[0].count+1).toString();
                                
                                connection.query('INSERT INTO `cart`(`id`, `userId` ,`deliveryOption`) VALUES (?,?,?)',
                                [cartIdToinsert,idToinsert, "1"],(err,result,field)=>{
                                    console.log('enter insert cart');
                                    
                                    if (err){

                                        console.error('error in insert new user', err);
                                        return res.status(500).send({
                                            status:0,
                                            info:"error in initialize cart"
                                        });
                                    }else{
                                        return res.status(200).send({
                                            status:1,
                                            info:'register completed'
                                        })
                                    
                                    }            
                                })

                            })
                    
                    })
                });
            });
            
        }
    });

    
})



app.post('/api/reauth',(req,res)=>{

    console.log('Session:', req.session); 
    console.log('user go to login');
    
    console.log(req.session.user);
    
    if(req.session.user){
        res.status(200).send({
            status:1,
            info:req.session.user,
        })
    }else{
        res.status(200).send({
            status:0,
            info:"unauthorize access"
        })
    }
})

app.post('/api/logout', (req, res) => {
    console.log('user log out');
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send({
                status: 0,
                info: 'error logging out',
            });
        } else {
            res.clearCookie('connect.sid'); 
            return res.status(200).send({
                status: 1,
                info: 'log out completed',
            });
        }
    });
});


app.get('/api/product',(req,res)=>{
    connection.query('SELECT * FROM product', (err,result,fields)=>{
        if (err) throw err;
        if(result.length>0){
            res.status(200).send({
                info:result,
                status:1
            });
        }else{
            res.status(200).send({
                info:[],
                status:0
            });
        }
    })
})

app.get('/api/product/:id',(req,res)=>{
    const data = req.params.id;
    
    connection.query('SELECT * FROM `product` WHERE id = ?',[data],(err,result,field)=>{
        if (err){
            return res.status(201).send({
                status:0,
                info:'error'
            })
        }else{
            return res.status(200).send({
                status:1,
                info:result[0]
            })
        }
    })
})

app.post('/api/product/add',(req,res)=>{
    console.log('front end Use api add Product');
    
    const data = req.body;
    console.log('product body');
    console.log(data);
    
    console.log('product body');

    connection.query('INSERT INTO `product`(`id`, `name`,`priceCents`, `type`) VALUES (?,?,?,?)',
        [data.id,data.name,data.priceCent,data.type],(err,result,field)=>{
           
            if (err) {
                console.log(err);
                
                return res.status(200).send(
                    {
                        status:1,
                        info:"error"
                    }
                )
            } else {
                return res.status(200).send({status:1,
                    info:"add product completed"
                });
            }
            
        }
    )
})

app.post('/api/product/addImg/:id', upload.single("file"), (req, res) => {
    const productId = req.params.id; 
    const tempPath = req.file.path;
    const extname = path.extname(req.file.originalname).toLowerCase();
    const targetPath = path.join(__dirname, `./public/images/products/${productId}${extname}`); 

    console.log('enterdededededede');
    console.log(productId);
    console.log(extname);
    console.log(req.file.originalname);
    console.log(req.file.path);
    console.log(req.file);
    
    
    
    
    if (extname === ".png") {
        console.log('enter this');

        fs.rename(tempPath, targetPath, (err) => {
            if (err) {
                console.error('File renaming error:', err);
                return res.status(500).send('Error renaming file');
            }

            const productImgPath = `http://localhost:5000/images/products/${productId}${extname}`;
            console.log('product to add to Pth : ', productImgPath);
            
            console.log('id to go to query : ', productId);
            
            connection.query('UPDATE `product` SET `img`=? WHERE id = ?', [productImgPath, productId], (err, result, field) => {
                if (err) {
                    console.error('Database update error:', err);
                    return res.status(500).send('Database update error');
                }

                console.log('Database updated successfully');
                return res.status(200).send({status:1,
                    info:"updated success"
                });
            });
        });
    } else {
        fs.unlink(tempPath, (err) => {
            if (err) {
                console.error('Error deleting invalid file:', err);
                return res.status(500).send('Error deleting invalid file');
            }

            res.status(403).send('Only .png files are allowed');
        });
    }
});

app.post('/api/order', async (req,res)=>{
    const data = req.body;

    console.log(data);

    connection.query(
        `INSERT INTO \`order\` (id,userId, orderTime, orderTimeDate, estimatedDeliveryTime, estimatedDeliveryTimeDate, totalCostCent, status, payStatus)
         VALUES (?,?,?,?,?,?,?,?,?)`,
        [data.id,data.userId,data.orderTime,data.orderTimeDate,data.estimatedDeliveryTime,data.estimatedDeliveryTimeDate,data.totalCostCent,data.status,data.payStatus],
        (err,result,field)=>{
            if (err){
                console.log(err);
                return res.status(201).send({status:0,
                    info:'error occurred'
                })
            }
            console.log(result);
            console.log('update complete');
            const promises = data.products.map((current)=>{
                return new Promise((resolve,reject)=>{
                    connection.query(`INSERT INTO \`orderdetail\`(orderId, id, productId, quantity)
                         VALUES 
                         (?,?,?,?)`,
                        [data.id,current.id,current.productId,current.quantity],
                    (err,result,field)=>{
                        if(err){
                            reject(err);
                        }else{
                            resolve();
                        }
                    })
                })
            })

            Promise.all(promises)
            .then(() => {
                res.status(200).send({
                    status: 1,
                    info: 'Data successfully inserted',
                });
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send({
                    status: 0,
                    info: 'Error occurred while inserting into orderdetail table',
                });
            });
        
        })


    
})

app.get('/api/order/:id',(req,res)=>{
    const userId = req.params.id;
    console.log('belowe is userId');
    connection.query('SELECT * FROM `order` WHERE `userId` = ?',[userId], async (err,result,fields)=>{
        if (err) {
            return res.status(201).send({status:0,
                info:'error'
            })
        }
        if(result.length === 0){
            console.log('enter length 0');
            
            return res.status(200).send({
                status:1,
                info:[]
            })
        }
        console.log("this is result");
        
        console.log(result);
        
        console.log("this is result id");
        
        console.log(result[0].id);

        const promise = await Promise.all(result.map((current)=>{
            return new Promise((resolve, reject) =>{
                connection.query('SELECT * FROM `orderDetail` WHERE `orderId` = ?',[result[0].id],(err,resultDetail,field)=>{
                    if (err){
                        console.log(err);
                        return reject(err);
                    }else{
                        console.log("defrgthy");
                        console.log(resultDetail);
                        
                        return resolve({
                                ...current,
                                products : resultDetail  
                            });
                    }
                })
            })
        }))

        console.log(promise);
        
        return res.status(200).send({status:1,
            info:promise
        })


    })
     
    
    }

)

app.get('/api/order/find/total',(req,res)=>{
    connection.query('SELECT COUNT(*) AS count FROM `order`', (err,result,field)=>{
        console.log('print result of number of row of order');
        console.log(result);
        
        if (err){

            return res.status(201).send({
                status:0,
                info: err
            }) 
        }else{
            return res.status(200).send({
                status:1,
                info: result[0].count
            })
        }
    })
})
app.put('/api/order/:id',(req,res)=>{
    const data = req.body;
    const id = req.params.id;

    connection.query(`UPDATE \`order\` 
            SET \`id\`= ?, \`userId\`= ?,
            \`orderTime\`= ? ,\`orderTimeDate\`= ?
            ,\`totalCostCent\`=?,\`status\`=?
            ,\`payStatus\`=? WHERE \`id\` = ?`,
        [data.id,data.userId,data.orderTime,
        data.orderTimeDate,data.totalCostCent,
        data.status,data.payStatus,id],(err,result,field)=>{
            if(err){
                return res.status(201).send({status:0,
                    info:'error ocurred'
                })
            }
            res.status(200).send({status:1,
                info:'update complete'
            })
        })
})

app.post('/api/order/slip/:id', upload.single("file"), (req, res) => {
    const orderId = req.params.id;
    const tempPath = req.file.path;
    const extname = path.extname(req.file.originalname).toLowerCase();
    const targetPath = path.join(__dirname, `./public/images/slips/slip${orderId}${extname}`); 

    console.log('enter ererererierrrrrrrrrrrrrrrrrrrrr');

    if (extname === ".png") {
        console.log('enter this');

        fs.rename(tempPath, targetPath, (err) => {
            if (err) {
                console.error('File renaming error:', err);
                return res.status(500).send('Error renaming file');
            }

            const slipImgPath = `http://localhost:5000/images/slips/slip${orderId}${extname}`;

            connection.query('UPDATE `order` SET `slipImg`=? WHERE id = ?', [slipImgPath, orderId], (err, result, field) => {
                if (err) {
                    console.error('Database update error:', err);
                    return res.status(500).send('Database update error');
                }

                console.log('Database updated successfully');
                return res.status(200).send({status:1,
                    info:"updated success"
                });
            });
        });
    } else {
        fs.unlink(tempPath, (err) => {
            if (err) {
                console.error('Error deleting invalid file:', err);
                return res.status(500).send('Error deleting invalid file');
            }

            res.status(403).send('Only .png files are allowed');
        });
    }
});


app.get('/api/user', (req,res)=>{
    console.log('have conection require user data');
    
    connection.query(`SELECT * FROM \`user\` WHERE role = 'customer'`, (err,result,field)=>{
        if (err){

            return res.status(201).send({
                status:0,
                info: err
            }) 
        }else{
            return res.status(200).send({
                status:1,
                info: result
            })
        }
    })
})

app.get('/api/cart/:id',(req,res)=>{
    const userId = req.params.id;
    console.log('belowe is userId');
    connection.query('SELECT * FROM `cart` WHERE `userId` = ?',[userId], async (err,result,fields)=>{
        if (err) {
            return res.status(201).send({status:0,
                info:'error'
            })
        }
        if(result.length === 0){
            console.log('enter length 0');
            
            return res.status(200).send({
                status:1,
                info:[]
            })
        }
        console.log("this is result");
        
        console.log(result);
        
        console.log("this is result id");
        
        console.log(result[0].id);

        const promise = await Promise.all(result.map((current)=>{
            return new Promise((resolve, reject) =>{
                connection.query('SELECT * FROM `cartDetail` WHERE `cartId` = ?',[result[0].id],(err,resultDetail,field)=>{
                    if (err){
                        console.log(err);
                        return reject(err);
                    }else{
                        console.log("defrgthy");
                        console.log(resultDetail);
                        
                        return resolve({
                                ...current,
                                products : resultDetail  
                            });
                    }
                })
            })
        }))

        console.log(promise);
        
        return res.status(200).send({status:1,
            info:promise
        })


    })
     
    
    }

)

app.put('/api/cartDetail/:id',(req,res)=>{
    console.log('user want update cartdetail');

    const cartId = req.params.id; 
    const data = req.body;
    console.log(data, cartId);
    
    connection.query('UPDATE `cartdetail` SET `quantity`=? WHERE cartId = ? AND productId = ?', [data.quantity, cartId, data.productId],(err,result,field)=>{
        if (err) {
            return res.status(201).send({
                status:0,
                info:'error in update product quntity'
            })
        }
        return res.status(200).send({
            status:1,
            info:'update complete'
        })
    })
})

app.put('/api/cart/:id',(req,res)=>{
    console.log('user want update cart');

    const cartId = req.params.id; 
    const data = req.body;

    connection.query('UPDATE `cart` SET `deliveryOption`=? WHERE id = ? ', [data.deliveryOptionId, cartId],(err,result,field)=>{
        if (err) {
            return res.status(201).send({
                status:0,
                info:'error in update product deliveryOption'
            })
        }
        return res.status(200).send({
            status:1,
            info:'update complete'
        })
    })
})

app.post('/api/cart/addProduct/:id',(req,res)=>{
    console.log('user want add product');
    
    const cartId = req.params.id; 
    const data = req.body;
    const product = data.product;

    console.log(cartId, data, product);
    
    connection.query('SELECT COUNT(*) AS count FROM `cartDetail`', (err,result,field)=>{
        if( err){
            console.error('error in counting');
            return res.status(500).send({
                status:0,
                info:"error in counting"
            });
        }

        const idToinsert ='cd'+(result[0].count+1).toString();
        
        connection.query('INSERT INTO `cartdetail`(`id`, `cartId`, `productId`, `quantity`) VALUES (?,?,?,?)', [idToinsert, cartId, product.id, product.quantity],(err,result,field)=>{
            if (err) {
                return res.status(201).send({
                    status:0,
                    info:'error in insert cart detail'
                })
            }
            return res.status(200).send({
                status:1,
                info:'update complete'
            })
        })
    })
})
app.delete('/api/cartDetail/:id', (req,res)=>{
    const cartDetailId = req.params.id;

    connection.query('DELETE FROM `cartdetail` WHERE id = ?', [cartDetailId],(err,result,field)=>{
        if (err) {
            return res.status(201).send({
                status:0,
                info:'error in delete product from cart'
            })
        }
        return res.status(200).send({
            status:1,
            info:'delete  complete'
        })
    })
})

app.listen(5000,()=>{
    console.log('listening on port 5000');
    
})



//let dataPrepared = [];

    
    //data.cart.forEach((current)=>{
    //    connection.query(`SELECT 'id','name','img','priceCents' FROM product WHERE id = '${current.id}'`,(err,result,fields)=>{
    //        if(err) throw err;
    //        dataPrepared.push({
    //            ...result[0],
    //            "quantity": data.quantity,
    //            "deliveryOptionId": data.deliveryOptionId
    //        });
    //    })
    //})

    