const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");


const app = express();


// =====================
// PORT RENDER
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
// PATH
// =====================


const ROOT = __dirname;


const configPath = path.join(
    ROOT,
    "config.json"
);





// =====================
// CONFIG
// =====================


function getConfig(){

    try{

        return JSON.parse(
            fs.readFileSync(
                configPath,
                "utf8"
            )
        );

    }
    catch(err){

        console.log(
            "CONFIG ERROR:",
            err
        );

        return {
            username:"admin",
            password:"123456",
            allowIP:[]
        };

    }

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

        ip =
        ip.split(",")[0];

    }



    ip =
    ip.replace(
        "::ffff:",
        ""
    );



    return ip.trim();


}





// =====================
// PAGE
// =====================


// LOGIN

app.get("/",(req,res)=>{

    res.sendFile(

        path.join(
            ROOT,
            "login.html"
        )

    );

});




// INDEX

app.get("/index.html",(req,res)=>{

    res.sendFile(

        path.join(
            ROOT,
            "index.html"
        )

    );

});





// ADMIN

app.get("/admin",(req,res)=>{


    res.sendFile(

        path.join(
            ROOT,
            "admin.html"
        )

    );


});







// =====================
// LOGIN API
// =====================


app.post("/api/login",(req,res)=>{


    const {

        username,

        password

    } = req.body;



    const config =
    getConfig();



    const userIP =
    getClientIP(req);



    console.log(
        "LOGIN IP:",
        userIP
    );


    console.log(
        "ALLOW:",
        config.allowIP
    );




    // CHECK IP


    if(
        !config.allowIP.includes(userIP)
    ){


        return res.json({

            success:false,

            message:
            "IP chưa được cấp quyền",

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

            message:
            "Sai tài khoản hoặc mật khẩu"

        });


    }





    res.json({

        success:true,

        message:
        "Login success",

        redirect:
        "/index.html"


    });



});







// =====================
// CHECK IP
// =====================


app.get(
"/api/check-ip",
(req,res)=>{


    const config =
    getConfig();


    const userIP =
    getClientIP(req);



    if(
        config.allowIP.includes(userIP)
    ){


        return res.json({

            success:true,

            ip:userIP

        });


    }




    res.json({

        success:false,

        ip:userIP

    });



});








// =====================
// GET IP LIST
// =====================


app.get(
"/api/ip-list",
(req,res)=>{


    const config =
    getConfig();



    res.json({

        allowIP:
        config.allowIP || []

    });



});









// =====================
// ADD IP
// =====================


app.post(
"/api/add-ip",
(req,res)=>{


    const {

        ip

    } = req.body;



    if(!ip){


        return res.json({

            success:false,

            message:
            "Missing IP"

        });


    }




    const config =
    getConfig();





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









// =====================
// DELETE IP
// =====================


app.post(
"/api/remove-ip",
(req,res)=>{


    const {

        ip

    } = req.body;




    const config =
    getConfig();




    config.allowIP =

    config.allowIP.filter(

        item =>

        item !== ip

    );




    saveConfig(config);




    res.json({

        success:true,

        allowIP:
        config.allowIP


    });



});









// =====================
// STATIC
// =====================


app.use(

express.static(
    ROOT
)

);









// =====================
// ERROR
// =====================


app.use((req,res)=>{

    res.status(404).send(
        "Not Found"
    );

});








// =====================
// START
// =====================


app.listen(
PORT,
()=>{


console.log(

`Server running on port ${PORT}`

);


});