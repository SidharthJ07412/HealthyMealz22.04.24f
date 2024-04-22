import express from "express";
import {View_mess, View_mess_rating, Remaining_Daily_tokens, Change_daily_tokens,View_subscribed_mess, Rate_Mess, Update_profile, filter_mess, fetch_profile,update_address, fetch_new, fetchNearbyMess, order,verify} from "../controllers/Customer_controller.js" 

const router = express.Router();

router.post("/View_mess", View_mess);
//router.post("/Subscribe_mess", Subscribe_mess);
router.post("/Remaining_Daily_tokens", Remaining_Daily_tokens);
router.post("/Change_daily_tokens", Change_daily_tokens);
router.post("/Rate_Mess", Rate_Mess);
router.post("/Update_profile", Update_profile);
router.post("/filter_mess", filter_mess);
router.post("/fetch_profile", fetch_profile);
router.post("/update_address", update_address);
router.post("/View_subscribed_mess",View_subscribed_mess);
router.post("/View_mess_rating", View_mess_rating);
router.post("/fetch_new",fetch_new);
router.post("/update_address",update_address);
router.post("/fetchNearbyMess",fetchNearbyMess);
router.post("/order",order);
router.post("/verify",verify);
export default router