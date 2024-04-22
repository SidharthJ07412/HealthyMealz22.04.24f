import express from "express";
import {fetch_menu,update_menu,send_request,remove_agent,fetch_current_agent,fetch_agents,fetch_status,View_mess_users,fetch_total_tokens,Deduct_tokens,Mess_registration,fetch_mess_id,toggle_status, update_address_mess} from "../controllers/Mess_owner_controller.js"
const router = express.Router();

router.post("/View_mess_users", View_mess_users);
router.post("/fetch_total_tokens", fetch_total_tokens);
router.post("/Deduct_tokens", Deduct_tokens);
router.post("/Mess_registration",Mess_registration);
router.post("/fetch_mess_id",fetch_mess_id);
router.post("/toggle_status",toggle_status);
router.post("/fetch_status",fetch_status);
router.post("/fetch_agents",fetch_agents);
router.post("/fetch_current_agent",fetch_current_agent);
router.post("/send_request",send_request);
router.post("/remove_agent",remove_agent);
router.post("/update_menu",update_menu);
router.post("/fetch_menu",fetch_menu);
router.post("/update_address_mess",update_address_mess);

export default router;