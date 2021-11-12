import express from "express";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import customerRouter from "./services/customers/index";
import GoogleStrategy from "./services/auth/oauth";
import passport from "passport";
import bodyParser from "body-parser";
import {
  unauthorizedHandler,
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} from "./services/errorHandlers";
import accomRouter from "./services/accommodation/index";

const server = express();

const port = process.env.PORT || 3001;

// ************************* MIDDLEWARES ********************************
// passport.use('google', googlestrategy);

server.use(cors());
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(passport.initialize());
passport.use("google", GoogleStrategy);
// server.use(passport.initialize());
// ************************* ROUTES ************************************

server.use("/customers", customerRouter);
server.use("/accomadation", accomRouter);
// ************************** ERROR HANDLERS ***************************
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(badRequestHandler);
server.use(genericErrorHandler);
console.log(process.env.GOOGLE_OAUTH_ID);
let mongo_url = process.env.MONGO_CONNECTION as string;
mongoose.connect(mongo_url);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server running on port ${port}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
