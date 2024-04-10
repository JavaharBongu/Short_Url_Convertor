const express = require("express");
const path=require("path");
const app = express();
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require("./connect.js");
connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(() =>
  console.log("Mongodb connected"));
const urlRoute = require("./Routes/url.js");
const URL = require("./Models/url.js");
const staticRoute = require("./Routes/staticRouter.js");
const userRoute = require("./Routes/user.js")
const {checkForAuthentication, restrictTo}=require("./middlewares/auth.js")

const PORT = 8001;
app.set("view engine","ejs");
app.set("views", path.resolve("./views"))
app.use(express.json()); // to support the json data
app.use(express.urlencoded({ extended: false })); // to support the form data
// app.get("/test", async (req, res)=>{
//     return res.render('home');
// });
app.use(cookieParser());
app.use(checkForAuthentication);
// app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use("/user", userRoute);
// app.use("/", checkAuth, staticRoute);
app.use("/", staticRoute);
app.get("/url/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
      {
        shortId,
      },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      }
    );
    res.redirect(entry.redirectURL);
  });
app.listen(PORT, () => console.log(`server started at PORT : ${PORT}`));
