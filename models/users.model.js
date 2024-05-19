// ----------------------------------------------------------
// IMPORTANDO
// ----------------------------------------------------------

import {pool} from "../database/connection.js";
import format from "pg-format";


// ----------------------------------------------------------
// FUNCIONES
// ----------------------------------------------------------


// FUNCION - FINDIDBYEMAIL_USER
const findByEmail_User = async function(email){

    console.log("users.model.findByEmail_User: Start");
    const query = "SELECT * FROM users WHERE email = '%s'";
    const values = email;
    const formattedQuery = format(query, values);
    const {rows} = await pool.query(formattedQuery);
    console.log("users.model.findByEmail_User: End");
    return rows[0];
}

// FUNCION - FINDIDBYEMAIL_USER
const ifExistEmail_User = async function(email){
    console.log("users.model.ifExistEmail_User: Start");

    const query = "SELECT COUNT(*) FROM users WHERE email = '%s'";
    const values = email;
    const formattedQuery = format(query, values);
    const { rows } = await pool.query(formattedQuery);
    const total = rows[0].count;

    if(total > 0){
        console.log("users.model.ifExistEmail_User: True");
        console.log("users.model.ifExistEmail_User: End");
        return true;
    }else{
        console.log("users.model.ifExistEmail_User: False");
        console.log("users.model.ifExistEmail_User: End");
        return false;
    }
}


// FUNCION - FINDBYID_USER
const findById_User = async function(id){

    console.log("users.model.findById_User: Start");
    const query = "SELECT * FROM users WHERE id = %s";
    const values = id;
    const formattedQuery = format(query, values);
    const {rows} = await pool.query(formattedQuery);
    console.log("users.model.findById_User: End");
    return rows[0];
} 

// FUNCION - CREATE_USER
const create_User = async function(user){

    console.log("users.model.create_User: Start");
    const query = "INSERT INTO users (email, name, lastname, age, phone, password) VALUES ('%s', '%s', '%s', %s, '%s', '%s') RETURNING *";
    const values = [user.email, user.name, user.lastname, user.age, user.phone, user.password];
    const formattedQuery = format(query, ...values);
    const {rows} = await pool.query(formattedQuery);
    console.log("users.model.create_User: End");
    return rows[0]; 
} 

// FUNCION - UPDATEBYID_USER
const updateById_User = async function(id, user){

    console.log("users.model.updateById_User: Start");

    let query;
    let formattedQuery;

    if(user.email && user.email != undefined && isNaN(user.email)){

        console.log("users.model.updateById_User: Updating email");
        query = `UPDATE users SET email = '%s' WHERE id = %s`;
        formattedQuery = format(query, user.email, id);
        let {rows} = await pool.query(formattedQuery);
    }

    if(user.name && user.name != undefined && isNaN(user.name)){

        console.log("users.model.updateById_User: Updating name");
        query = `UPDATE users SET name = '%s' WHERE id = %s`;
        formattedQuery = format(query, user.name, id);
        let {rows} = await pool.query(formattedQuery);
    }

    if(user.lastname && user.lastname != undefined && isNaN(user.lastname)){

        console.log("users.model.updateById_User: Updating lastname");
        query = `UPDATE users SET lastname = '%s' WHERE id = %s`;
        formattedQuery = format(query, user.lastname, id);
        let {rows} = await pool.query(formattedQuery);
    }

    if(user.age && user.age != undefined && !isNaN(user.age)){

        console.log("users.model.updateById_User: Updating age");
        query = `UPDATE users SET age = %s WHERE id = %s`;
        formattedQuery = format(query, user.age, id);
        let {rows} = await pool.query(formattedQuery);
    }

    if(user.phone && user.phone != undefined && isNaN(user.phone)){

        console.log("users.model.updateById_User: Updating phone");
        query = `UPDATE users SET phone = '%s' WHERE id = %s`;
        formattedQuery = format(query, user.phone, id);
        let {rows} = await pool.query(formattedQuery);
    }
    
    if(user.password && user.password != undefined && isNaN(user.password) && user.password != null){

        console.log("users.model.updateById_User: Updating password");
        query = `UPDATE users SET password = '%s' WHERE id = %s`;
        formattedQuery = format(query, user.password, id);
        let {rows} = await pool.query(formattedQuery);
    }

    const response = await findById_User(Number(id));
    console.log("users.model.updateById_User: End");
    return response;
}


export const usersModel = { findByEmail_User, ifExistEmail_User, findById_User, create_User, updateById_User };