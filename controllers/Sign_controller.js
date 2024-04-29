import client from "../db.js";
import twilio from 'twilio';
import dotenv from "dotenv";

export const createUser = async (req, res) => {
  const { Fname, Lname, Phone_num, Email, Password, User_address, User_type,lat ,log } = req.body;
  let exists;
  try {
    exists = await client.query(
      "Select * from Users where Users.Email=$1 and Users.User_type=$2;",
      [Email,User_type]
    );
  } catch (err) {
    console.log(err);
  }
  
  if (exists.rowCount != 0) {
    res.status(500).send("User already Existed. Try Sign in instead ");
  } else {
    let newUser;
    try {
      newUser = await client.query(
        "INSERT INTO Users(Fname, Lname, Phone_num, Email, Password, User_address, User_type, lat , log) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9);",
        [Fname, Lname, Phone_num, Email, Password, User_address, User_type, lat, log]
      )
      newUser = await client.query("select * from Users where Email=$1 and Password=$2;",
      [
        Email,
        Password
      ])
      console.log(newUser.rows[0]);
      res.status(200).send(newUser.rows[0]);
    } catch (err) {
      console.log(err);
    }
  }
};

export const logInUser = async (req, res) => {
  console.log("Email");
  const { Email, Password, User_type} = req.body;
  
  let userExists;
  try {
    userExists = await client.query(
      "select User_id from Users WHERE Email=$1 and Password=$2 and User_type=$3;",
      [Email, Password, User_type]
    );
  } catch (err) {
    console.log(err);
  }
  if (userExists.rowCount == 1) {
    res.status(200).send(userExists.rows[0]);
  } else {
    res.status(500).send("User does not Exists");
  }
};




dotenv.config();
const {TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN,TWILIO_SERVICE_SID} = process.env;
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, { lazyLoading: true });

export const sendOTP = async (req,res,next) => {
  const {phoneNumber} = req.body;
  try{
    const otpResponse = await twilioClient.verify.v2
    .services(TWILIO_SERVICE_SID)
    .verifications.create({
      to: `+91${phoneNumber}`,
      channel: "sms",
    });
    res.status(200).send(`OTP send successfully!: ${JSON.stringify(otpResponse)}`)
  }catch(err){

    res.status(400).send("Otp sent successfully");
  }
};

export const verifyOTP = async  (req,res,next) => {
  const {phoneNumber, otp} = req.body;
  try{
    const verifiedResponse = await twilioClient.verify.v2
    .services(TWILIO_SERVICE_SID)
    .verificationChecks.create({
      to: `+91${phoneNumber}`,
      code: otp,
    });
    res.status(200).send(`${JSON.stringify(verifiedResponse.status)}`);
  }catch(error)
  {
    console.log(error);
    res.status(400).send("unable to verify");
  }
}