const express = require('express');
const bodyParser =  require('body-parser')
const http = require('http');
const uuid =require('uuid/v4')
const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);

let rooms = 0;
let uniqueGid;
let max = 1000;
let roomnum = Math.floor(Math.random() * Math.floor(max));

app.use(bodyParser.json())
app.use(express.static('client'));

// app.get('/', (req, res,next) =>{
//     res.send('<h1>Hello world</h1>');
//   });
io.on('connection', function(socket){
    console.log('a user connected');
    console.log(roomnum)
    socket.on('sendName',function(msg){
      socket.join(`room-${roomnum}`, () => {
        let rooms = Object.keys(socket.rooms);
        console.log(rooms); // [ <socket.id>, 'room 237' ]
        io.to(`room-${roomnum}`).emit('newGame' ,{  room: `room-${roomnum}` }); 
        io.to(`room-${roomnum}`).emit('asuccess' ,'New Room Created'); 
        socket.on('rowColl',function(stats){
          console.log(stats)
          socket.emit('clickedR&C',{
                  'clickedCol':stats.clickedCol,
                  'clickedRow':stats.clickedRow
          });
          socket.broadcast.to(`room-${roomnum}`).emit('clickedR&C',{
            'clickedCol':stats.clickedCol,
            'clickedRow':stats.clickedRow
    })
        })
      });
    })
    
  

  socket.on('joinRoom',function (data){
       socket.join(`room-${data.roomno}`,() =>{
        socket.broadcast.to(`room-${data.roomno}`).emit('secoundSucces',`${data.playerName} ${'Joined Room '} `);
        socket.emit('bsuccess', {'playerName':data.playerName,'message':'Successfully Joined To Room'})
        socket.on('rowColl',function(stats){
          console.log(stats)
          socket.emit('clickedR&C',{
                  'clickedCol':stats.clickedCol,
                  'clickedRow':stats.clickedRow
          })
          socket.broadcast.to(`room-${data.roomno}`).emit('clickedR&C',{
            'clickedCol':stats.clickedCol,
            'clickedRow':stats.clickedRow
    })
        })
       }); 
       
  })
  
  socket.on('disconnect', function(){
    console.log('a user disconnected');
  });
});



//server.listen(`${5000}/${gameId}`)
server.listen(5000)