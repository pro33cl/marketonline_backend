// ----------------------------------------------------------
// IMPORTANDO
// ----------------------------------------------------------

import { productsModel } from "../models/products.model.js";
import { salesModel } from "../models/sales.model.js"
import jwt from "jsonwebtoken";


// ----------------------------------------------------------
// FUNCIONES
// ----------------------------------------------------------

// FUNCION - FINDALLBYID_SALES
const findAllById_Sales = async function(req, res){


}


// FUNCION - FINDALLBYIDPAGINATION_SALES
const findAllByIdPagination_Sales = async function(req, res){

    try {
        
        console.log("sales.controller.findAllByIdPagination_Sales: Start");

        const Authorization = await req.header("Authorization");
        const token = Authorization.split(" ")[1];
        const {user_id, user_email} = jwt.decode(token);

        const {page} = await req.query;
        const orderby = "id";
        const order = "ASC";
        const limit = 10;

        const total_pages = await salesModel.countPages_Sales(user_id);
        const sales = await salesModel.findAllByIdPagination_Sales(user_id, {orderby, order, limit, page});

        console.log("sales.controller.findAllByIdPagination_Sales: Success");
        return res.status(200).json({message:"Success", result: {totalpages: total_pages, sales: sales}});

    } catch (error) {

        console.log("sales.controller.findAllByIdPagination_Sales: Internal server error");
        return res.status(500).json({message: "Internal server error", result: error}); 
       
    }finally{

        console.log("sales.controller.findAllByIdPagination_Sales: End");
    }
}

// FUNCION - FINBYID_SALE
const findById_Sale = async function(req, res){

    try {

        console.log("sales.controller.findById_Sale: Start");

        const sale_id = await req.params.id;
        const sale = await salesModel.findById_Sale(sale_id);
        
        if(!sale){

            console.log("sales.controller.findById_Sale: Sale not found");
            return res.status(404).json({message:"Sale not found", result: null});

        }else{

            console.log("sales.controller.findById_Sale: Success");
            return res.status(200).json({message:"Success", result: sale});
        } 

    } catch (error) {

        console.log("sales.controller.findById_Sale: Internal server error");
        return res.status(500).json({message: "Internal server error", result: error}); 
        
    }finally{

        console.log("sales.controller.findById_Sale: End");
    }

}



// FUNCION - CREATEBYID_SALE
const createById_Sale = async function(req, res){

    try {

        console.log("sales.controller.createById_Sale: Start");

        const Authorization = await req.header("Authorization");
        const token = Authorization.split(" ")[1];
        const {user_id, user_email} = jwt.decode(token);

        const sale = await req.body;
        let newSale;

        if(!sale){

            console.log("sales.controller.createById_Sale: Post is required");
            return res.status(400).json({message:"Post is required", result: null});
        }
        else if(!sale.name || !sale.image || !sale.image_name || !sale.description || !sale.price || !sale.category){

            console.log("sales.controller.createById_Sale: Post data is required");
            return res.status(400).json({message:"Post data is required", result: null});
        }
        else{

            newSale = {name: sale.name, image: sale.image, image_name: sale.image_name, description: sale.description, price: sale.price, category: sale.category};
        }

        const posted = await salesModel.createById_Sale(user_id, newSale);
        console.log("sales.controller.createById_Sale: Posted");
        return res.status(201).json({message:"Posted", result: posted});

    } catch (error) {

        console.log("sales.controller.createById_Sale: Internal server error");
        return res.status(500).json({message: "Internal server error", result: error});
        
    }finally{

        console.log("sales.controller.createById_Sale: End");
    }
}

// FUNCION - UPDATEBYID_SALE
const updateById_Sale = async function(req, res){

    try {
        
        console.log("sales.controller.updateById_Sale: Start");

        const Authorization = await req.header("Authorization");
        const token = Authorization.split(" ")[1];
        const {user_id, user_email} = jwt.decode(token);
        const {sale_id} = await req.query;
        const sale = await req.body;
        let newSale;

        const sale_exist = await productsModel.findById_Product(sale_id);

        if(user_id == sale_exist.id_seller){

            console.log("sales.controller.updateById_Sale: Access to modify");
        }
        else{

            console.log("sales.controller.updateById_Sale: No access to modify");
            return res.status(400).json({message:"No access to modify", result: null});
        }

        if(!sale){

            console.log("sales.controller.updateById_Sale: Post is required");
            return res.status(400).json({message:"Post is required", result: null});
        }
        else{

            newSale = {name: sale.name, image: sale.image, image_name: sale.image_name, description: sale.description, price: sale.price, category: sale.category};
        }

        const posted = await salesModel.updateById_Sale(sale_id, newSale);

        if(!posted){

            console.log("sales.controller.updateById_Sale: Not updated");
            return res.status(404).json({message:"Not updated", result: null});
        }
        else{

            console.log("sales.controller.updateById_Sale: Updated");
            return res.status(200).json({message:"Updated", result: posted});
        }
    } catch (error) {
        
        console.log("sales.controller.updateById_Sale: Internal server error");
        return res.status(500).json({message: "Internal server error", result: error});

    }finally{

        console.log("sales.controller.updateById_Sale: End");
    }
}

// FUNCION - REMOVEBYID_SALE
const removeById_Sale = async function(req, res){

    try {

        console.log("sales.controller.removeById_Sale: Start");

        const Authorization = await req.header("Authorization");
        const token = Authorization.split(" ")[1];
        const {user_id, user_email} = jwt.decode(token);
        const {sale_id} = await req.query;
        const sale_exist = await productsModel.findById_Product(sale_id);
        console.log(sale_id);
        console.log(sale_exist);

        let sale_deleted;

        if(user_id == sale_exist.id_seller){

            console.log("sales.controller.removeById_Sale: Access to deleted");
            sale_deleted = await salesModel.removeById_Sale(sale_id);
        }
        else{

            console.log("sales.controller.removeById_Sale: No access to deleted");
            return res.status(400).json({message:"No access to deleted", result: null});
        }
        
        if(!sale_deleted){

            console.log("sales.controller.removeById_Sale: Sale not deleted");
            return res.status(404).json({message:"Sale not deleted", result: null});

        }else{

            console.log("sales.controller.removeById_Sale: Deleted");
            return res.status(200).json({message:"Deleted", result: sale_deleted});
        } 

    } catch (error) {

        console.log("sales.controller.removeById_Sale: Internal server error");
        return res.status(500).json({message: "Internal server error", result: error}); 
        
    }finally{

        console.log("sales.controller.removeById_Sale: End");
    }
}

// ----------------------------------------------------------
// EXPORTANDO
// ----------------------------------------------------------

export const salesController = {findAllById_Sales, findAllByIdPagination_Sales, findById_Sale, createById_Sale , updateById_Sale, removeById_Sale};