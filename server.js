// import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";

// import Sign_routes from "./routes/Sign_routes.js"
// import Customer_route from "./routes/Customer_route.js"
// import Delivery_route from "./routes/Delivery_route.js"
// import Mess_owner_route from "./routes/Mess_owner_route.js"

// const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(
//   cors({
//     origin: ["http://localhost:3000", "http://localhost:5000"],
//     methods: ["POST", "PUT", "GET", "DELETE", "SHOW"],
//     credentials: [true],
//   })
// );

// app.use("/auth", Sign_routes);
// app.use("/Customer", Customer_route);
// app.use("/Mess_owner",Mess_owner_route)
// app.use("/Delivery_boy", Delivery_route);
// // app.use("/test", (req,res)=>{console.log(665);res.send("hellppppp")});

// const port = 5000;
// app.listen(port, () => {
//   console.log(`Server is listening on port ${port}`);
// });


import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import Sign_routes from "./routes/Sign_routes.js"
import Customer_route from "./routes/Customer_route.js"
import Delivery_route from "./routes/Delivery_route.js"
import Mess_owner_route from "./routes/Mess_owner_route.js"
import dotenv from "dotenv";
const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors()
);

app.use("/auth", Sign_routes);
app.use("/Customer", Customer_route);
app.use("/Mess_owner",Mess_owner_route)
app.use("/Delivery_boy", Delivery_route);

const port = 5000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


