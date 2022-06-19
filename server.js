const express = require('express'); //web sunucusu 
const app = express();
const server = require('http').Server(app); //http server
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid'); //eşsiz oda idleri oluşturmak için
const { ExpressPeerServer, PeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {debug:true});

const room_url = uuidv4(); // oluşturduğum eşsiz oda id sini room_url diye tanımladım

app.set('view engine','ejs');
app.use(express.static('public'));
app.use('/peerjs', peerServer);

app.get('/', (req,res)=>{
   res.redirect(`/${room_url}`);
});

app.get('/:room', (req,res)=>{
   res.render('room',{roomId: req.params.room})
});

io.on('connection', socket =>{
   socket.on('join-room', (roomId, userId) => {
      socket.join(roomId);
      socket.to(roomId)/*.broadcast*/.emit('user-connected', userId);
      socket.on('message', message => {
         io.to(roomId).emit('createMessage', message)
      })
            //console.log('kullanıcı odaya katıldı');
   })
})

server.listen(process.env.PORT || 3030); 
