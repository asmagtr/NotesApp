const jwt = require('jsonwebtoken')

function authentificateToken(req,res,next){
    const authHeader=req.headers["authorization"];
    // console.log(`///////// REQUEST : ${req.headers} ///////////`);
    // console.log(`///////// headers.authori : ${authHeader} ///////////`);
    const token = authHeader && authHeader.split(" ")[1];
    // console.log(`///////// token: ${token} ///////////`);
    // console.log(`///////// responsei : ${res} ///////////`)
   

    if (!token) return res.sendStatus(401);

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,user)=>
    { if (err)
        {   console.log(`\\\\ error ${err} ////////`)
             return res.sendStatus(401);}
    req.user=user;
    next();
})
}

module.exports={
    authentificateToken,
};