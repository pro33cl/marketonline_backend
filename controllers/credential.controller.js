// ----------------------------------------------------------
// IMPORTANDO
// ----------------------------------------------------------

import "dotenv/config";
import { usersModel } from '../models/users.model.js';
import bcript from "bcryptjs";
import jwt from "jsonwebtoken";

const timeExpireToken = 600; //time in seconds

// ----------------------------------------------------------
// FUNCIONES
// ----------------------------------------------------------

// FUNCION - LOGIN
const login = async function(req, res){

    try {
        
        console.log("credential.controller.login: Start");
        const {email, password} = req.body;
        const user = await usersModel.findByEmail_User(email);

        if(!user){

            console.log("credential.controller.login: User not found");
            return res.status(404).json({message:"User not found", result: null});

        }else{

            const isMatch = bcript.compareSync(password, user.password);
    
            if(!isMatch){

                console.log("credential.controller.login: Invalid credentials");
                return res.status(400).json({message:"Invalid credentials", result: null});

            }else{

                const payload = {user_id: user.id, user_email: user.email};
                const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: timeExpireToken});
                console.log("credential.controller.login: Login successfully");
                return res.status(200).json({message:"Login successfully", result: token});
            }
        }

    } catch (error) {

        console.log("credential.controller.login: Internal server error");
        return res.status(500).json({message: "Internal server error", result: error}); 
   
    }finally{

        console.log("credential.controller.login: End");
    }
}

const validateToken = async function (req, res, next){

    try {

        console.log("credential.controller.validateToken: Start");
        const Authorization = await req.header("Authorization");
        console.log(Authorization)
        const token = Authorization.split(" ")[1];
        console.log(token);
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
       
        if(verifyToken){

            const {user_id, user_email} = jwt.decode(token);
            const user = await usersModel.findById_User(user_id);

            if(user_id == user.id && user_email == user.email){

                console.log("credential.controller.validateToken: Valid credentials");
                next();
            }
             else{

                console.log("credential.controller.validateToken: Invalid credentials");
                return res.status(400).json({message:"Invalid credentials", result: null});
            }
        }
        else{

            console.log("credential.controller.validateToken: Invalid credentials");
            return res.status(400).json({message:"Invalid credentials", result: null});
        }
        
    } catch (error) {

        console.log("credential.controller.validateToken: Internal server error");
        return res.status(500).json({message: "Internal server error", result: error});
        
    }finally{

        console.log("credential.controller.validateToken: End");
    }
}


// ----------------------------------------------------------
// EXPORTANDO
// ----------------------------------------------------------

export const credentialController = { login, validateToken};