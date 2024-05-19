
// ----------------------------------------------------------
// IMPORTANDO
// ----------------------------------------------------------

import {pool} from "../database/connection.js";
import format from "pg-format";


// ----------------------------------------------------------
// FUNCIONES
// ----------------------------------------------------------

// Asociar category con id_category

// FUNCION - FINDIDCATEGORYBYSALE
const findIdCategoryBySale_Sales = async function(sale){

    const category = sale.category;

    const query = "SELECT * FROM category WHERE name = '%s'";
    const values = category;
    const formattedQuery = format(query, values);
    const {rows} = await pool.query(formattedQuery);
    return rows[0].id;
}


const countPages_Sales = async function(id_seller){

    console.log("sales.model.countPages_Sales: Start");
    const limit = 10;
    const query = `SELECT COUNT(*) FROM products WHERE id_seller = %s`;
    const values = id_seller;
    const formattedQuery = format(query, values);
    const { rows} = await pool.query(formattedQuery);
    const total_rows = parseInt(rows[0].count, 10);
    const total_pages = limit > 0 ? Math.ceil(total_rows / limit) : 1;
    console.log("sales.model.countPages_Sales: Start");
    return total_pages;
}

// FUNCION - FINDALLBYID_SALES
const findAllById_Sales = async function(id_seller){
    let query;
    query = `SELECT products.id, products.name, products.image, products.image_name, products.description, products.price, category.name AS category
	                    FROM products 
	                    LEFT JOIN category 
	                    ON products.id_category = category.id
	                        WHERE products.id_seller = %s`;
    const values = id_seller;
    const formattedQuery = format(query, values);
    const {rows} = await pool.query(formattedQuery);
    return rows;
}

// FUNCION - FINDALLBYIDPAGINATION_SALES
const findAllByIdPagination_Sales = async function(id_seller, pagination_V){
    
    console.log("sales.model.findAllByIdPagination_Sales: Start");

    let query
    let formattedQuery;
    let values= [];

    query = `SELECT products.id, products.name, products.image, products.image_name, products.description, products.price, category.name AS category
                        FROM products 
                        LEFT JOIN category 
                        ON products.id_category = category.id
                        WHERE products.id_seller = %s`;

    const { orderby, order, limit, page} = pagination_V;
    const offset = (page-1)*limit;
    
    values.push(id_seller);

    if(limit){

        values.push(orderby);
        values.push(order);

        if (limit <= 0) {

            query = `${query} ORDER BY %s %s`;
            formattedQuery = format(query, ...values);

        }else{

            values.push(limit);
            values.push(offset);
            query = `${query} ORDER BY %s %s LIMIT %s OFFSET %s`;
            formattedQuery = format(query, ...values);
        }

    }else{

        formattedQuery = format(query, ...values);
    }

    const { rows } = await pool.query(formattedQuery);
    console.log("sales.model.findAllByIdPagination_Sales: End");
    return rows;
} 

// FUNCION - FINBYID_SALE
const findById_Sale = async function(id){

    console.log("sales.model.findById_Sale: Start");
    const query = `SELECT products.id, products.name, products.image, products.image_name, products.description, products.price, category.name AS category
                    FROM products 
                    LEFT JOIN category 
                    ON products.id_category = category.id
                        WHERE products.id = %s`;

    const values = id;
    const formattedQuery = format(query, values);
    const {rows} = await pool.query(formattedQuery);
    console.log("sales.model.findById_Sale: Start");
    return rows[0];
} 

const create_Sale = async function(){} 

// FUNCION - CREATEBYID_SALE
const createById_Sale = async function(id_seller, sale){

    console.log("sales.model.createById_Sale: Start");
    const id_category = await findIdCategoryBySale_Sales(sale);

    console.log(sale);
    const query = "INSERT INTO products (name, image, image_name, description, price, id_category, id_seller) VALUES ('%s', '%s', '%s', '%s', %s, %s, %s) RETURNING *";
    const values = [sale.name, sale.image, sale.image_name, sale.description, sale.price, id_category, id_seller];
    const formattedQuery = format(query, ...values);
    const {rows} = await pool.query(formattedQuery);
    console.log("sales.model.createById_Sale: End");
    return rows[0]; 
} 


// FUNCION - UPDATEBYID_SALE
const updateById_Sale = async function(id, sale){

    console.log("sales.model.updateById_Sale: Star");
    let query;
    let formattedQuery;
    let id_category

    if(sale.category){

        id_category = await findIdCategoryBySale_Sales(sale);
    }else{

        id_category = sale.id_category;
    }

    if(sale.name && sale.name != undefined && isNaN(sale.name)){

        console.log("sales.model.updateById_Sale: Updating name");
        query = `UPDATE products SET name = '%s' WHERE id = %s`;
        formattedQuery = format(query, sale.name, id);
        let {rows} = await pool.query(formattedQuery);
    }

    if(sale.image && sale.image != undefined && isNaN(sale.image)){

        console.log("sales.model.updateById_Sale: Updating image");
        query = `UPDATE products SET image = '%s' WHERE id = %s`;
        formattedQuery = format(query, sale.image, id);
        let {rows} = await pool.query(formattedQuery);
    }

    if(sale.image_name && sale.image_name != undefined && isNaN(sale.image_name)){

        console.log("sales.model.updateById_Sale: Updating image_name");
        query = `UPDATE products SET image_name = '%s' WHERE id = %s`;
        formattedQuery = format(query, sale.image_name, id);
        let {rows} = await pool.query(formattedQuery);
    }

    if(sale.description && sale.description != undefined && isNaN(sale.description)){

        console.log("sales.model.updateById_Sale: Updating description");
        query = `UPDATE products SET description = '%s' WHERE id = %s`;
        formattedQuery = format(query, sale.description, id);
        let {rows} = await pool.query(formattedQuery);
    }

    if(sale.price && sale.price != undefined && !isNaN(sale.price)){

        console.log("sales.model.updateById_Sale: Updating price");
        query = `UPDATE products SET price = '%s' WHERE id = %s`;
        formattedQuery = format(query, sale.price, id);
        let {rows} = await pool.query(formattedQuery);
    }

    if(id_category && id_category != undefined && !isNaN(id_category)){

        console.log("sales.model.updateById_Sale: Updating id_category");
        query = `UPDATE products SET id_category = %s WHERE id = %s`;
        formattedQuery = format(query, id_category, id);
        let {rows} = await pool.query(formattedQuery);
    }

    const response = await findById_Sale(Number(id));
    console.log("sales.model.updateById_Sale: End");
    return response;
}

// FUNCION - REMOVEBYID_SALE
const removeById_Sale = async function(id){

    console.log("sales.model.removeById_Sale: Start");
    const query = "DELETE FROM products WHERE id = %s RETURNING *";
    const formattedQuery = format(query, Number(id));
    const {rows} = await pool.query(formattedQuery);
    console.log("sales.model.removeById_Sale: End");
    return rows[0];
}


export const salesModel = {countPages_Sales, findAllById_Sales, findAllByIdPagination_Sales, findById_Sale, createById_Sale , updateById_Sale, removeById_Sale};