const { getUser } = require("../service/auth");

// async function restrictToLoggedinUserOnly(req, res, next) {
//   const userUid = req.cookies?.uid;
  
//   // const userUid = req.headers["authorization"];

//   if (!userUid) return res.redirect("/login");

//   // const token = userUid.startsWith("Bearer ") ? userUid.split("Bearer ")[1] : null;

//   // const token = userUid.split("Bearer ")[1];
//   const user = getUser(userUid);
//   // const user = getUser(token);

//   if (!user) return res.redirect("/login");

//   req.user = user;
//   next();
// }

// async function checkAuth(req, res, next) {
//   const userUid = req.cookies?.uid;
//   // console.log(req.headers);
//   // const userUid = req.headers["authorization"];
//   // const token = userUid.split("Bearer ")[1];
//   // const token = userUid.startsWith("Bearer ") ? userUid.split("Bearer ")[1] : null;

//   const user = getUser(userUid);
//   // const user = getUser(token);


//   req.user = user;
//   next();
// }


// module.exports = {
//   restrictToLoggedinUserOnly,
//   checkAuth,
// };

function checkForAuthentication(req, res, next){
  const tokenCookie = req.cookies?.token;
  if(!tokenCookie) return next();
  const token = tokenCookie;
  const user = getUser(token);
  req.user = user;
  return next();
}
function restrictTo(roles = []){
  return function (req, res, next){
    if(!req.user) return res.redirect("/login");
    if(!roles.includes(req.user.role)) return res.end("Unauthorized");
    return next();
  };
}
module.exports={
  checkForAuthentication,
  restrictTo,
}