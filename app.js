const crypto=require('crypto')
const exp= require('express')
const app = exp()
const bcrypt=require('bcrypt')
const {mongoose,User}=require('./monDB')
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const jwt=require('jsonwebtoken')
const cookieParser = require('cookie-parser');

const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex'); // Generates a 64-character (256-bit) hexadecimal key
  };
  
  const secretKey = generateSecretKey();

app.use(exp.json());
app.use(cookieParser());

app.listen(1000,()=>{
    console.log("Server is running on port 1000")
})

passwordRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/

//Registration
app.post('/register',async(req,res)=>{
    const { name, email,password } = req.body;
    
    if(!emailRegex.test(email)){
       res.status(400).json({ error: 'Invalid email format' });
    }

    if(!passwordRegex.test(password)){
        res.status(400).json({ error: 'Invalid password format' });
    }
    try {
        const newUser = new User({ name, email,password });
        await newUser.save();
        res.json({ message: 'User created', user: newUser });
      } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'An error occurred' });
      }
});


app.post('/login',async(req,res)=>{
    const {email, password}=req.body;
    try{
        const user  =await User.findOne({email});
        if(!user){
            res.status(401).json({error:'invalid user id'})
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          res.status(401).json({ error: 'Invalid email or password' });
        }
        // console.log(user._id)
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
      
        res.cookie('token',token).redirect('/info')
    }catch(error){
        res.status(500).json({ error: 'An error occurred' });
    }

})

// app.post('/info',async(req,res)=>{
//     const token=req.cookies.token
//     decoded=await jwt.decode(token)
//     id=decoded.userId
//     const user2= await User.findOne({_id:id})
//     res.status(200).json({message:'Welcome'})
    
// })

app.post('/info',async(req,res)=>{
    const token=req.cookies.token
    decoded=await jwt.decode(token)
    id=decoded.userId
    const user2= await User.findOne({_id:id})
    console.log(user2.email)
    if(!user2){
        res.json({message:"no"})
    }
    if(token){
        res.status(200).json({message:'Welcome'})
    }else{
        res.status(400).json({message:'Session expired'})  
    }
})