var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

var namelist = []//require('dynamic-array').DynamicArray();

server.listen(3000);

app.get('/' , function(req , res){
   res.sendFile(__dirname + '/index.html'); 
});

io.sockets.on('connection' , function(socket){
    
    socket.on('new user' , function(data , callback){
        if(namelist.indexOf(data) != -1){
            callback(false);
            console.log(data + 'false');
        }
        else {
            console.log(data + 'true');;
            callback(true);
            socket.name = data;
            namelist.push(socket.name)
            io.sockets.emit('username' , namelist);
        }
    });
    socket.on('send message' , function(data){
         io.sockets.emit('new message' , {msg: data , name:socket.name , id: Math.floor(Math.random() * 1000) + 1});
     });
    
    socket.on('bought item' , function(data){
        console.log("REmove item server" + data);
        socket.broadcast.emit('remove item' , data);
    })
    
    socket.on('disconnect' , function(data){
        if(!socket.name) return;
        namelist.splice(namelist.indexOf(socket.name) , 1);
        io.sockets.emit('username' , namelist);
    });
});

/*
msglist.each(function(item){
        socket.emit('init chat' , item);
    });
    
    jQuery
    $(document).ready(function(){
    $(".deleteMe").on("click", function(){
       $(this).closest("li").remove(); 
    });
});


    html
    <ul>
        <li>item one <div class='deleteMe'>X</div></li>
        <li>item two <div class='deleteMe'>X</div></li>
        <li>item three <div class='deleteMe'>X</div></li>
        <li>item four <div class='deleteMe'>X</div></li>
        <li>item five <div class='deleteMe'>X</div></li>
        <li>item six <div class='deleteMe'>X</div></li>
        <li>item seven <div class='deleteMe'>X</div></li>
        <li>item eight <div class='deleteMe'>X</div></li>
        <li>item nine <div class='deleteMe'>X</div></li>
    </ul>
    
    css
    ul li{
        list-style: none;
        background: gray;
        margin: 2px;
        border-raius: 5px;
        padding: 5px;
    }
    
    .deleteMe{
        float: right;
        background: yellow;
    }
    jason.stringify
*/