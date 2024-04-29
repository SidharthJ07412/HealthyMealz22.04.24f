import express from "express";
import {fetch_mess_id,fetch_mess_users,delete_request,accept_request,fetch_hire_requests,fetch_current_mess,fetch_mess_loc, set_del_status, fetch_del_status} from "../controllers/Delivery_controller.js"
const router = express.Router();

router.post("/fetch_current_mess", fetch_current_mess);
router.post("/fetch_hire_requests", fetch_hire_requests);
router.post("/delete_request", delete_request);
router.post("/accept_request", accept_request);
router.post("/fetch_mess_id", fetch_mess_id);
router.post("/fetch_mess_users", fetch_mess_users);
router.post("/fetch_mess_loc", fetch_mess_loc);
router.post("/set_del_status",set_del_status);
router.post("/fetch_del_status",fetch_del_status);


// router.post("/DeliveryMapPage")

export default router