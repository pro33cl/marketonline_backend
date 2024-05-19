// ----------------------------------------------------------
// IMPORTANDO
// ----------------------------------------------------------

import {usersController} from "../controllers/users.controller.js";
import {productsController} from "../controllers/products.controller.js";
import {salesController} from "../controllers/sales.controller.js";
import {credentialController} from "../controllers/credential.controller.js";
import {Router} from "express";
import { imageController } from "../controllers/image.controller.js";

// ----------------------------------------------------------
// DECLARACION DE VARIABLES
// ----------------------------------------------------------

const router = Router();

// ----------------------------------------------------------
// GET
// ----------------------------------------------------------

router.get("/", productsController.findAllByFilterPagination_Products); //lista

router.get("/products/", productsController.findAllByFilterPagination_Products); //lista

router.get("/products/:id", productsController.findById_Product); //lista

router.get("/products/user/data", credentialController.validateToken, usersController.findById_User); //lista

router.get("/products/user/sales", credentialController.validateToken, salesController.findAllByIdPagination_Sales); //lista

router.get("/productimage/:id", imageController.getById_Image);

// ----------------------------------------------------------
// POST
// ----------------------------------------------------------

router.post("/products/login/", credentialController.login); //lista

router.post("/products/register/", usersController.create_User); //lista

router.post("/products/user/sales", credentialController.validateToken, salesController.createById_Sale); // lista

router.post("/productimage/:id", credentialController.validateToken, imageController.autorization_Image, imageController.upload.single('file'), imageController.post_Image );

// ----------------------------------------------------------
// PUT
// ----------------------------------------------------------

router.put("/products/user/data", credentialController.validateToken, usersController.updateById_User); //lista

router.put("/products/user/sales", credentialController.validateToken, salesController.updateById_Sale); //lista

// ----------------------------------------------------------
// DELETE
// ----------------------------------------------------------

router.delete("/products/user/sales", credentialController.validateToken, salesController.removeById_Sale); //lista

router.delete("/productimage/:id", credentialController.validateToken, imageController.autorization_Image, imageController.delete_Image );

// ----------------------------------------------------------
// EXPORTANDO
// ----------------------------------------------------------

export default router;
