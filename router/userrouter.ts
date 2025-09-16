import express from 'express'
const router = express.Router();
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import prisma from '../DB/db.config';

router.post('/register',async (req,res)=>{
    const {name,email,password} = req.body;
    try{
        const one = await prisma.user.findUnique({
            where:{email}
        });
            if(one){
                return res.status(400).json({message:"Email already exist"})
            }
            const hashedPassword = await bcrypt.hash(password,10);

            const user =await prisma.user.create({
                data:{
                    name:name,
                    email:email,
                    password:hashedPassword
                },
            });
            return res.status(200).json({message:"User created sucessfully"})
        }
    catch(error){
        console.error(error)
            res.status(500).json({message:"Registration Failed"})
        }

});

//login

router.post('/login',async (req,res)=>{
    const {email,password} = req.body
    try{
        const one = await prisma.user.findUnique({
            where:{email}
            });
            if(!one){
                return res.status(400).json({message:"Email does not exist plaese register yourself "})
            }

            const isMatch = await bcrypt.compare(password,one.password)
            if(!isMatch){
                return res.status(400).json({message:"Failed to login Wrong password"})
            }

            const token = jwt.sign(
            {id:one.id, email: one.email},
            process.env.JWT_SECRET!,
            {expiresIn: '3h'}
        );
        return res.status(200).json({
            message:"User login sucesfully",
            token: token,
            user: {
                id: one.id,
                name: one.name,
                email: one.email
            }
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message:"Login Failed"})
    }

});

export default router;

