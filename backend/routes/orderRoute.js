const express = require('express');

const router = express.Router();
const { isUserAuthenticated, authoriseRoles } = require('../middleware/auth');
const { newOrder, getSingleOrder, getOrderOfUser, getMyOrders, updateOrder, deleteOrder, getAllOrders } = require('../controller/orderController');


// creating new order api
router.route("/new/order").post(isUserAuthenticated,newOrder)

//getting one single order api
router.route("/single/order/:id").get(isUserAuthenticated,getSingleOrder);

//get all order api of loggedIn Person
router.route("/my/orders").get(isUserAuthenticated,getMyOrders)

//get all orders admin api
router.route("/getAll/orders").get(isUserAuthenticated,authoriseRoles("admin"),getAllOrders);

//update order api
router.route("/update/order/:id").put(isUserAuthenticated,authoriseRoles("admin"),updateOrder);

//delete order 
router.route("/delete/order/:id").delete(isUserAuthenticated,authoriseRoles("admin"),deleteOrder)

module.exports = router;