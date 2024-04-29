import client from "../db.js";

export const View_mess_users = async (req, res) => {

    const {Mess_id} = req.body;
    let exists;
    try {
      exists = await client.query("select Users.fname,Users.lname,Users.phone_num,Users.email,Users.user_address,Subscription.daily_tokens , Subscription.remaining_token from subscription inner join Users on Users.User_id = Subscription.customer_id where subscription.Mess_id=$1",
      [Mess_id]);
    } catch (err) {
      console.log(err);
    }
    console.log(exists.rows);
    res.status(200).send(exists.rows);
  };

  export const update_address_mess = async (req, res) => {

    const {User_id,lat,lng,address} = req.body;

    let exists;
    try {
      exists = await client.query("UPDATE Users SET lat=$2, log=$3 where User_id=$1  ",
      [
        User_id,lat,lng
      ]);
    
    await client.query("UPDATE mess SET mess_address=$2 WHERE  mess_owner_id=$1",
    [
      User_id,address
    ]);
  }
    catch (err) {
      console.log(err);
    }
     console.log(exists.rows);
    res.status(200).send("Successfully Address Updated");
  };

  export const fetch_total_tokens = async (req, res) => {

    const {Mess_id} = req.body;
    let exists;
    try {
      exists = await client.query("select sum(daily_tokens) from subscription where Mess_id=$1",
      [Mess_id]);
    } catch (err) {
      console.log(err);
    }
    console.log(exists.rows);
    res.status(200).send(exists.rows);
  };

  export const Deduct_tokens = async (req, res) => {

    const {Mess_id} = req.body;
    let exists;
    try {
      exists = await client.query("UPDATE subscription SET remaining_token = remaining_token-daily_tokens WHERE mess_id=$1;",
      [Mess_id]);
    } catch (err) {
      console.log(err);
    }
    console.log(exists.rows);
    res.status(200).send(exists.rows);
  };

  export const Mess_registration = async (req, res) => {
    const { Messname, Messaddress, Messcontact,Fooddetails,Monthlyprice, mess_owner_id} = req.body;
      let newMess;
      try {
        newMess = await client.query(
          "INSERT INTO Mess(mess_name,mess_address,phone_num,tiffin_details, subscription_price,mess_owner_id,status) VALUES ($1,$2,$3,$4,$5,$6,1);",
          [Messname, Messaddress, Messcontact, Fooddetails, Monthlyprice, mess_owner_id]
        );
        res.status(200).send("Mess has been Registered");
      } catch (err) {
        console.log(err);
      }
    
  };

  export const fetch_mess_id = async (req, res) => {

    const {User_id} = req.body;
    let exists;
    try {
      exists = await client.query("select mess_id from Mess where mess_owner_id = $1",
      [User_id]);
    } catch (err) {
      console.log(err);
    }
    console.log(exists.rows);
    res.status(200).send(exists.rows[0]);
  };

  export const toggle_status = async (req, res) => {

    const {Mess_id} = req.body;
    let exists;
    try {
      exists = await client.query("update mess set status=1-status where mess_id=$1;",
      [Mess_id]);
    } catch (err) {
      console.log(err);
    }
    res.status(200).send(exists.rows[0]);
  };

  export const fetch_status = async (req, res) => {

    const {Mess_id} = req.body;
    let exists;
    try {
      exists = await client.query("select status from mess where mess_id=$1",
      [Mess_id]);
    } catch (err) {
      console.log(err);
    }
    res.status(200).send(exists.rows[0]);
  };

  export const fetch_agents = async (req, res) => {
    const {Mess_id} = req.body;
    let exists;
    try {
      exists = await client.query("SELECT * from users full outer JOIN request ON users.user_id = request.agent_id WHERE users.user_type = 2 and (status is NULL or status='Hired' or mess_id=$1) union  SELECT user_id,fname,lname,phone_num,email,password,user_address,user_type,lat,log,mess_id,agent_id,null as status from users right JOIN request ON users.user_id = request.agent_id WHERE users.user_type = 2 and status='Pending' and mess_id!=$1 and agent_id not in (select agent_id from request where mess_id=$1);",[Mess_id]);
    } catch (err) {
      console.log(err);
    }
    res.status(200).send(exists.rows);
  };

  export const fetch_current_agent = async (req, res) => {

    const {Mess_id} = req.body;
    let exists;
    try {
      exists = await client.query("select * from request inner join users on users.user_id =  request.agent_id  where request.mess_id=$1 and request.status='Hired'",
      [Mess_id]);
    } catch (err) {
      console.log(err);
    }
    res.status(200).send(exists.rows);
  };
  
  export const remove_agent = async (req, res) => {

    const {Mess_id} = req.body;
    console.log(Mess_id);
    let exists;
    try {
      await client.query("DELETE FROM request WHERE mess_id=$1 and status='Hired' ",
      [Mess_id]);
    } catch (err) {
      console.log(err);
    }
    res.status(200).send("remove");
  };



  export const send_request = async (req, res) => {

    const {Mess_id,agent_id} = req.body;
    let exists;
    try {
      await client.query("INSERT INTO request VALUES ($1, $2, 'Pending');",
      [Mess_id,agent_id]);
    } catch (err) {
      console.log(err);
    }
    res.status(200).send("send");
  };

  export const update_menu = async (req, res) => {
    const { User_id,newMenu} = req.body;
    let exists;

    let temp="";
    for(let i=0;i<newMenu.length;i++)
    {
      temp=temp+newMenu[i];
      if(i===newMenu.length-2){temp+=" and ";}
      else if(i!==newMenu.length-1){temp+=", ";}
      else{temp+=".";}
    }

    try
    {
      exists = await client.query("UPDATE Mess SET tiffin_details = $2 where mess_owner_id = $1",
      [
        User_id,temp
      ])
      res.status(200).send("Successfully Updated menu");
    }catch(err)
    {
      console.log(err);
    }
  };

  export const fetch_menu = async (req, res) => {
    const {User_id} = req.body;
    let exists;
    try {
      exists = await client.query("select tiffin_details from Mess where mess_owner_id = $1",
      [User_id]);
    } catch (err) {
      console.log(err);
    }
    console.log(exists.rows);
    res.status(200).send(exists.rows[0]);
  };

