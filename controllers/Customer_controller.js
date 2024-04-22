import client from "../db.js";
import Razorpay from "razorpay";
import crypto from "crypto";



export const order = async(req,res) => {

    // check if subscription already exist

    const { customer_id, Mess_id} = req.body;

    let exists;
    try {
      exists = await client.query("Select * from Subscription where customer_id = $1 and Mess_id = $2",
      [
        customer_id,Mess_id
      ]);
    } catch (err) {
      console.log(err);
    }
    
    if(exists.rowCount!==0)
    {
      return res.status(400).send("Cannot Subscribe to same mess multiple times!");
    }

    try {
		const instance = new Razorpay({
			key_id: process.env.KEY_ID,
			key_secret: process.env.KEY_SECRET,
		});

		const options = {
			amount: req.body.amount * 100,
			currency: "INR",
			receipt: crypto.randomBytes(10).toString("hex"),
		};

		instance.orders.create(options, (error, order) => {
			if (error) {
				console.log(error);
				return res.status(500).json({ message: "Something Went Wrong!" });
			}
			res.status(200).json({ data: order });
		});
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
	}
  }

  export const verify = async(req,res) => {

    try {
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature, months , mess_id,user_id} =
			req.body;
		const sign = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSign = crypto
			.createHmac("sha256", process.env.KEY_SECRET)
			.update(sign.toString())
			.digest("hex");

      let exists;
      try {
      exists = await client.query("INSERT INTO Subscription(customer_id,Mess_id,Remaining_token,subscription_validity,Daily_tokens,Subscription_date) VALUES($1,$2,$3,$4,1,CURRENT_DATE);", [
      user_id, mess_id, months*30,months
      ]);
    } catch (err) {
      console.log(err);
    }
    console.log(exists.rows);
    res.status(200).send("Successfully Subscribed!");
		
	} catch (error) {
		res.status(400).send("Payment failed ");
		console.log(error);
	}
  }

export const View_mess = async (req, res) => {

    let exists;
    try {
      exists = await client.query("select * from Mess ");
    } catch (err) {
      console.log(err);
    }
    console.log(exists.rows);
    res.status(200).send(exists.rows);
  };

  export const View_subscribed_mess = async (req, res) => {

    const {customer_id} = req.body;
    let exists;
    console.log(customer_id);
    try {
      exists = await client.query("select mess.tiffin_details,mess.status,mess.mess_name,Subscription.mess_id,Subscription.daily_tokens,Subscription.remaining_token,Subscription.subscription_validity from Subscription inner join mess on subscription.mess_id=mess.mess_id where customer_id=$1 ",
      [customer_id]);
    } catch (err) {
      console.log(err);
    }
    console.log(exists.rows);
    res.status(200).send(exists.rows);
  };


  



  // export const Subscribe_mess = async (req, res) => {
  //   const { customer_id, Mess_id, Remaining_token,subscription_validity} = req.body;

  //   let exists;
  //   try {
  //     exists = await client.query("Select * from Subscription where customer_id = $1 and Mess_id = $2",
  //     [
  //       customer_id,Mess_id
  //     ]);
  //   } catch (err) {
  //     console.log(err);
  //   }
    
  //   if(exists.rowCount!==0)
  //   {
  //     res.send("Cannot Subscribe same mess multiple times.");
  //   }else
  //   {
  //       try {
  //     exists = await client.query("INSERT INTO Subscription(customer_id,Mess_id,Remaining_token,subscription_validity,Daily_tokens,Subscription_date) VALUES($1,$2,$3,$4,1,CURRENT_DATE);", [
  //     customer_id, Mess_id, Remaining_token,subscription_validity
  //     ]);
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   console.log(exists.rows);
  //   res.status(200).send("Successfully Subscribed!");
  //   }
  // };
  
  // use to alert user that subscription is about to end 
  export const Remaining_Daily_tokens = async (req,res) => {
    const {customer_id,Mess_id} = req.body;

    let exists;

    try {
      exists = await client.query("Select remaining_tokens from Subscription where Mess_id=$1 and customer_id = $2",
      [
        Mess_id,customer_id        
      ])
    }catch(err) {
      console.log(err);
    }

    // console.log(exists);
    res.status(200).send(exists.rows[0]);
  }

  // when user changes number of tiffins per day
  export const Change_daily_tokens = async (req, res) => {

    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    console.log(currentHour);
    console.log("shdjkfhkdjfsd");
    
    // Check if current time is between 10 am to 1 pm (10 - 13)
    if (currentHour >= 9 && currentHour < 12) {
      return res.status(400).send("Tokens cannot be updated between 10 am to 12 pm.");
    }
    else if(currentHour >= 17 && currentHour < 19){
      return res.status(400).send("Tokens cannot be updated between 5 pm to 7 pm.");
    }

    const { customer_id,Mess_id,Daily_tokens} = req.body;
    let exists;
    try
    {
      exists = await client.query("Select * from Subscription where customer_id=$1 and Mess_id=$2",
      [
        customer_id,Mess_id
      ])
      // console.log(exists.rows[0].remaining_token);
      if(exists.rows[0].remaining_token < Daily_tokens)
      {
        
        res.status(400).send("Inadequate amount of Tokens left")
      }
      else
      {
        exists = await client.query("UPDATE Subscription SET Daily_tokens=$3 where customer_id=$1 and Mess_id=$2",
        [
          customer_id,Mess_id,Daily_tokens
        ]);
        res.status(200).send("Successfully Updated Daily Tokens!");
      }

    }catch(err)
    {
      console.log(err);
    }
  };

  export const Rate_Mess = async(req,res) => {

    const {User_id,Mess_id,Rating} = req.body;
    
    console.log(User_id,Mess_id,Rating);
    let exists;
    try {
      exists = await client.query("Select * from Ratings where User_id = $1 and Mess_id = $2",
      [
        User_id,Mess_id
      ]);
    } catch (err) {
      console.log(err);
    }
    if(exists.rowCount!==0)
    {
      try {
            exists = await client.query("UPDATE ratings SET rating = $3 WHERE user_id=$1 and mess_id =$2;",
            [
                User_id,Mess_id,Rating 
            ]);
          } catch (err) {
            console.log(err);
          }
      res.send("Updated Rating successfully!");
    }else
    {
        try {
            exists = await client.query("Insert into Ratings(User_id,Mess_id,Rating) Values($1,$2,$3)",
            [
                User_id,Mess_id,Rating 
            ]);
          } catch (err) {
            console.log(err);
          }
        res.status(200).send("Successfully Rated");
    }
    
  }

  export const View_mess_rating = async(req,res) => {
    const {Mess_id} = req.body;
    let exists;
    try {
      exists = await client.query("Select count(user_id) as count,avg(rating) as average from Ratings group by mess_id having mess_id =  $1;",[Mess_id]);
    } catch (err) {
      console.log(err);
    }
    console.log(exists.rows[0]);
    res.status(200).send(exists.rows[0]);
  }

  export const Update_profile = async (req, res) => {

    const {User_id,Fname, Lname, Phone_num, Password, User_address} = req.body;

    let exists;
    try {
      exists = await client.query("UPDATE Users SET Fname=$1, Lname=$2, Phone_num=$3, Password=$4, User_address=$5 where User_id=$6",
      [
        Fname, Lname, Phone_num, Password, User_address,User_id
      ]);
    } catch (err) {
      console.log(err);
    }
    // console.log(exists.rows);
    res.status(200).send("Successfully Updated Profile!");
  };

  export const fetch_profile = async (req, res) => {

    const {User_id} = req.body;

    let exists;
    try {
      exists = await client.query("Select * from Users where User_id = $1",
      [
        User_id
      ]);
    } catch (err) {
      console.log(err);
    }
    console.log(exists.rows);
    res.status(200).send(exists.rows[0]);
  };

  export const filter_mess = async(req,res) => {
    
    const {Filter_rating} = req.body;
    let exists;

    try{
    exists = await client.query("select * from Mess where Mess_id in (Select Mess_id from Ratings group by Mess_id having avg(Rating)>=$1)",[Filter_rating]);
    }catch(err){

      console.log(err);
    }
    res.status(200).send(exists.rows);
  }

  export const Make_payment = async(req,res) => {
    
  }

  // daily tokens remaining tokens validity in subscription 
  // seperate rating table user id mess id rating 
   

  // daily tokens remaining tokens validity in subscription 
  // seperate rating table user id mess id rating 
   
  export const fetchNearbyMess = async(req,res) => {
    
    const {user_id} = req.body;
    let exists;
    let lat1,log1;
    
    try{
    exists = await client.query("select lat as lat1, log as log1 from users where user_id = $1    ",[user_id]);
    lat1 = exists.rows[0].lat1;
    log1 = exists.rows[0].log1;
    }catch(err){

      console.log(err);
    }

    try{
    exists = await client.query("SELECT * FROM mess INNER JOIN users ON mess.mess_owner_id = users.user_id WHERE (($1 - CAST(users.lat AS FLOAT)) * ($1 - CAST(users.lat AS FLOAT)) + ($2 - CAST(users.log AS FLOAT)) * ($2 - CAST(users.log AS FLOAT)))  < 0.027*0.027 ;",[lat1,log1]);
    }catch(err){
      console.log(err);
    }
    
    res.status(200).send(exists.rows);
  }

  
  export const fetch_new = async (req, res) => {

    const {customer_id} = req.body;
    let exists;
    console.log(customer_id);
    try {
      exists = await client.query("select mess.mess_name, Subscription.remaining_token from Subscription inner join mess on subscription.mess_id=mess.mess_id where customer_id=$1 AND Subscription.remaining_token < 10 ",
      [customer_id]);
    } catch (err) {
      console.log(err);
    }
    console.log(exists.rows);
    res.status(200).send(exists.rows);
  };

  export const update_address = async (req, res) => {

    const {User_id,lat,lng,user_address} = req.body;

    let exists;
    try {
      exists = await client.query("UPDATE Users SET lat=$2, log=$3, user_address=$4 where user_id=$1",
      [
        User_id,lat,lng,user_address
      ]);
    } catch (err) {
      console.log(err);
    }
     console.log(exists.rows);
    res.status(200).send("Successfully Address Cordinates Updated");
  };