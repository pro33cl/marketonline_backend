
// ----------------------------------------------------------
// IMPORTANDO
// ----------------------------------------------------------

import { pool } from "../database/connection.js";
import format from "pg-format";

// ----------------------------------------------------------
// FUNCIONES
// ----------------------------------------------------------

// FUNCION - COUNTPAGES
const countPages = async function (limit_V, filters_V) {
    console.log("products.model.countPages: Start");

    const limit = limit_V;
    const { category, search } = filters_V;
    let id_category;

    let query, formattedQuery;
    let values = [];
    let queryValues1 = [];
    let queryValues2 = [];
    let total_rows;
    let total_pages;

    console.log("category :"+category);
    console.log("search :"+search);

    if (category || search) {

        query = 'SELECT COUNT(*) FROM products WHERE';

        if (category) {
            id_category = await findIdCategoryByCategory_Products(category);
            values.push(id_category);
            queryValues1.push("id_category = %s");
        }

        if (search) {

            values.push(`%${search}%`);
            values.push(`%${search}%`);
            queryValues2.push("name LIKE '%s'");
            queryValues2.push("description LIKE '%s'");
        }

        if(category && search){

            query = `${query} ${queryValues1} AND ( ${queryValues2.join(' OR ')} )`;

        }else if(category && !search){

            query = `${query} ${queryValues1}`;

        }else if(!category && search){

            query = `${query} ${queryValues2.join(' OR ')}`;

        }

        
        formattedQuery = format(query, ...values);
        console.log(formattedQuery);
        const { rows: countResults } = await pool.query(formattedQuery);
        total_rows = parseInt(countResults[0].count, 10);

    }
    else {

        query = 'SELECT COUNT(*) FROM products';
        const { rows: countResults } = await pool.query(query);
        total_rows = parseInt(countResults[0].count, 10);
    }

    console.log("total_rows :"+total_rows);
    console.log("limit :"+limit);
    total_pages = limit > 0 ? Math.ceil(total_rows / limit) : 1;
    console.log("products.model.countPages: End");
    return total_pages;
}

// FUNCION - FINDALLCATEGORIES_PRODUCTS
const findAllCategory_Products = async function(){

    console.log("products.model.findAllCategory_Products: Start");
    const query = "SELECT * FROM category";
    console.log("antes del pool.query");
    const {rows} = await pool.query(query);
    console.log("despues del pool.query");
    console.log("products.model.findAllCategory_Products: End");
    return rows;
}

// FUNCION - FINDIDCATEGORYBYSALE
const findIdCategoryByCategory_Products = async function(category){

    const query = "SELECT * FROM category WHERE name = '%s'";
    const values = category;
    const formattedQuery = format(query, values);
    const {rows} = await pool.query(formattedQuery);
    return rows[0].id;
}


// FUNCION - FINDALLBYFILTERPAGINATION_PRODUCTS
const findAllByFilterPagination_Products = async function (filters_V, pagination_V) {
    console.log("products.model.findAllByFilterPagination_Products: Start");
    const { category, search } = filters_V;
    const { orderby, order, limit, page} = pagination_V;
    const offset = (page-1)*limit;
    
    let id_category;
    let query;
    let values = [];
    let queryValues1 = [];
    let queryValues2 = [];
    let formattedQuery;

    console.log("products.model.findAllByFilterPagination_Products: Verifying category and search");
    console.log(category);
    console.log(search);
    console.log(orderby);
    console.log(order);
    console.log(limit);
    console.log(page);

    if(category || search){
        
        console.log(category);
        console.log(search);

        query = 'SELECT * FROM products WHERE';

        if (category) {

            id_category = await findIdCategoryByCategory_Products(category);
            console.log("idcategory :"+id_category);
            values.push(id_category);
            queryValues1.push("id_category = %s");
        }

        if (search) {

            values.push(`%${search}%`);
            values.push(`%${search}%`);
            queryValues2.push("name LIKE '%s'");
            queryValues2.push("description LIKE '%s'");
        }

        if(category && search){

            query = `${query} ${queryValues1} AND ( ${queryValues2.join(' OR ')} )`;

        }else if(category && !search){

            query = `${query} ${queryValues1}`;

        }else if(!category && search){

            query = `${query} ${queryValues2.join(' OR ')}`;
        }

        console.log("products.model.findAllByFilterPagination_Products: Verifying limit");
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
    }
    else{

        values.push(orderby);
        values.push(order);

        if(limit<=0){
    
            query = 'SELECT * FROM products ORDER BY %s %s ';
            formattedQuery = format(query, ...values);
    
        }
        else{

            values.push(limit);
            values.push(offset);
            query = 'SELECT * FROM products ORDER BY %s %s LIMIT %s OFFSET %s';
            formattedQuery = format(query, ...values);
    
        }
    }

    const { rows } = await pool.query(formattedQuery);
    console.log("products.model.findAllByFilterPagination_Products: End");
    return rows;
}

// FUNCION - FINDBYFILTER_PRODUCTS
const findById_Product = async function (id) {

    console.log("products.model.findById_Product: Start");
    const query = "SELECT * FROM products WHERE id = %s";
    const values = id;
    const formattedQuery = format(query, values);
    const {rows} = await pool.query(formattedQuery);
    console.log("products.model.findById_Product: End");
    return rows[0];

}


export const productsModel = { countPages, findAllCategory_Products, findAllByFilterPagination_Products, findById_Product };