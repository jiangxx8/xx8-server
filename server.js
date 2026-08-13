const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();


// =====================
// PORT
// =====================

const PORT = process.env.PORT || 3000;



// =====================
// MIDDLEWARE
// =====================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended:true
}));




// =====================
// CONFIG
// =====================

const configPath = path.join(
    __dirname,
    "config.json"
);



function getConfig(){

    return JSON.parse(
        fs.readFileSync(
            configPath,
            "utf8"
        )
    );

}



function saveConfig(data){

    fs.writeFileSync(

        configPath,

        JSON.stringify(
            data,
            null,
            2
        )

    );

}




// =====================
// GET IP
// =====================

function getClientIP(req){


    let ip =

    req.headers["x-forwarded-for"]

    ||

    req.socket.remoteAddress

    ||

    "";



    if(ip.includes(",")){

        ip = ip.split(",")[0];

    }



    ip = ip.replace(
        "::ffff:",
        ""
    );


    return ip;

}





// =================================================
// PAGE
// =================================================


// LOGIN

app.get("/",(req,res)=>{


    res.sendFile(

        path.join(
            __dirname,
            "login.html"
        )

    );


});





// INDEX

app.get("/index.html",(req,res)=>{


    res.sendFile(

        path.join(
            __dirname,
            "login.html"
        )

    );


});





// ADMIN

app.get("/admin",(req,res)=>{


    res.sendFile(

        path.join(
            __dirname,
            "admin.html"
        )

    );


});






// =================================================
// LOGIN API
// =================================================


app.post("/api/login",(req,res)=>{


    const {

        username,

        password

    } = req.body;




    const config = getConfig();



    const userIP = getClientIP(req);





    // CHECK IP

    if(

        config.allowIP

        &&

        !config.allowIP.includes(userIP)

    ){


        return res.json({

            success:false,

            message:"IP chưa được cấp quyền",

            ip:userIP

        });


    }






    // CHECK ACCOUNT


    if(

        username !== config.username

        ||

        password !== config.password

    ){


        return res.json({

            success:false,

            message:"Sai tài khoản hoặc mật khẩu"

        });


    }





    return res.json({

        success:true,

        message:"Đăng nhập thành công",

        redirect:"/admin"

    });



});







// =================================================
// IP LIST
// =================================================


app.get("/api/ip-list",(req,res)=>{


    const config = getConfig();



    res.json({

        allowIP:

        config.allowIP || []

    });


});







// =================================================
// ADD IP
// =================================================


app.post("/api/add-ip",(req,res)=>{


    const {

        ip

    } = req.body;




    if(!ip){


        return res.json({

            success:false,

            message:"Thiếu IP"

        });


    }





    const config = getConfig();



    if(

        !config.allowIP.includes(ip)

    ){


        config.allowIP.push(ip);


        saveConfig(config);


    }




    res.json({

        success:true,

        allowIP:

        config.allowIP

    });



});








// =================================================
// DELETE IP
// =================================================


app.post("/api/remove-ip",(req,res)=>{


    const {

        ip

    } = req.body;



    const config = getConfig();




    config.allowIP =

    config.allowIP.filter(

        item => item !== ip

    );




    saveConfig(config);




    res.json({

        success:true,

        allowIP:

        config.allowIP

    });



});








// =================================================
// STATIC
// CSS JS IMAGE
// =================================================


app.use(

    express.static(

        __dirname

    )

);








// =================================================
// START
// =================================================


app.listen(

    PORT,

    ()=>{


        console.log(

            `Server running on port ${PORT}`

        );


    }

);