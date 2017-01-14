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
            //console.log(data + 'false');
        }
        else {
            //console.log(data + 'true');;
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
        //console.log("REmove item server" + data);
        io.sockets.emit('remove item' , data);
    })
    
    socket.on('update chef vis' , function(data){
        socket.emit('chatbox chef vis' , data);
    });
    
    socket.on('update grocer vis' , function(data){
        //console.log("Grocer server call");
        socket.emit('chatbox grocer vis' , data);
    });
    
    socket.on('disconnect' , function(data){
        if(!socket.name) return;
        namelist.splice(namelist.indexOf(socket.name) , 1);
        io.sockets.emit('username' , namelist);
    });
});