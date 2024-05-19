// ----------------------------------------------------------
// IMPORTANDO
// ----------------------------------------------------------

import { usersModel } from '../models/users.model.js';
import jwt from "jsonwebtoken";
import bcript from "bcryptjs";

// ----------------------------------------------------------
// FUNCIONES
// ----------------------------------------------------------


// FUNCION - FINDBYID_USER
const findById_User = async function(req, res){

    try {

        console.log("users.controller.findById_User: Start");
        const Authorization = await req.header("Authorization");
        const token = Authorization.split(" ")[1];
        console.log(token);
        const {user_id, user_email} = jwt.decode(token);
        console.log(user_id);
        const user = await usersModel.findById_User(user_id);

        if(!user){

            console.log("users.controller.findById_User: User not found");
            return res.status(404).json({message:"User not found", result: null});

        }else{

            console.log("users.controller.findById_User: Success");
            return res.status(200).json({message:"Success", result: user});
        } 
    } catch (error) {

        console.log("users.controller.findById_User: Internal server error");
        return res.status(500).json({message: "Internal server error", result: error}); 
        
    }finally{

        console.log("users.controller.findById_User: End");
    }
}

// FUNCION - CREATE_USER
const create_User = async function(req, res){

    try {

        console.log("users.controller.create_User: Start");
        const user = await req.body;
        console.log(user);
        let newUser;

        if(!user){

            console.log("users.controller.create_User: Post is required");
            return res.status(400).json({message:"Post is required", result: null});
        }
        else if(!user.email || !user.name || !user.lastname || !user.age || !user.phone || !user.password){

            console.log("users.controller.create_User: Post data is required");
            return res.status(400).json({message:"Post data is required", result: null});
        }
        else{

            const ifExistEmail = await usersModel.ifExistEmail_User(user.email);

            if(ifExistEmail){

                console.log("users.controller.create_User: Email already exist");
                return res.status(400).json({message:"Email already exist", result: null});
            }
            else{

                newUser = {email: user.email, name: user.name, lastname: user.lastname, age: user.age, phone: user.phone, password: bcript.hashSync(user.password,10)};
            } 
        }

        const posted = await usersModel.create_User(newUser);
        console.log("users.controller.create_User: Posted");
        return res.status(201).json({message:"Posted", result: posted});
        
    } catch (error) {
        
        console.log("users.controller.create_User: Internal server error");
        return res.status(500).json({message: "Internal server error", result: error});

    }finally{

        console.log("users.controller.create_User: End");
    }
}

// FUNCION - UPDATEBYID_USER
const updateById_User = async function(req, res){

    try {

        console.log("users.controller.updatedById_User: Start");
        const Authorization = await req.header("Authorization");
        console.log("Mostrando la Authorization :"+Authorization);
        const token = Authorization.split(" ")[1];
        const {user_id, user_email} = jwt.decode(token);
        console.log("user_id :"+user_id);
        const user = await req.body;
        let newUser;

        console.log(user);

        console.log(user.password);

        if(!user){

            console.log("users.controller.updatedById_User: Post is required");
            return res.status(400).json({message:"Post is required", result: null});
        }
        else{

            if(user.password || user.password != null || user.password != undefined ){

                newUser = {email: user.email, name: user.name, lastname: user.lastname, age: user.age, phone: user.phone, password: bcript.hashSync(user.password,10)};

            }else{

                console.log("entró acá");
                newUser = {email: user.email, name: user.name, lastname: user.lastname, age: user.age, phone: user.phone};
            }   
        }

        const posted = await usersModel.updateById_User(user_id, newUser);

        if(!posted){

            console.log("users.controller.updatedById_User: Not updated");
            return res.status(404).json({message:"Not updated", result: null});
        }
        else{

            console.log("users.controller.updatedById_User: Updated");
            return res.status(200).json({message:"Updated", result: posted});
        }
    } catch (error) {

        console.log("users.controller.updatedById_User: Internal server error");
        return res.status(500).json({message: "Internal server error", result: error});

    }finally{

        console.log("users.controller.updatedById_User: End");
    }
}

// ----------------------------------------------------------
// EXPORTANDO
// ----------------------------------------------------------

export const usersController = {findById_User, create_User, updateById_User };