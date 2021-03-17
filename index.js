// server side code

const { Socket } = require('socket.io');

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/javascript', (req, res) => {
    res.sendFile(__dirname + '/public/javascript.html');
});

app.get('/css', (req, res) => {
    res.sendFile(__dirname + '/public/css.html');
});

app.get('/swift', (req, res) => {
    res.sendFile(__dirname + '/public/swift.html');
});

// creating tech namespace
const tech = io.of('/tech');

// whenever a connection is made || something happens
tech.on('connection', (socket) => {
    console.log('User connected');

    socket.on('join', (data) => {
        socket.join(data.room);
        // console.log(data.room);
        if (data.room == 'javascript' || data.room == 'css') {
            tech.in(data.room).emit('message', `New User joined ${data.room} room!`); 
         }
    });

    // allows swift room to work on data at once

    // socket.on('message_data', (evt) => {
    //     // log(evt)
    //     // how do I make it so just the swift room gets the data??????

    //     // tech.in(data.room).emit('message', evt);
    //     // not logging the data at all
    //     console.log(evt);

    //     socket.broadcast.emit('message_data', evt);
    // });

    // send message between users
    socket.on('message', (data) => {
        console.log(`message: ${data.msg}`);
        console.log(data);
        tech.in(data.room).emit('message', data.msg);
    });

    // socket.on('keyup', () => {
    //     socket.emit('message_received', data);
    // });

    // tech.on('connection', (socket) => {
    //     socket.on('message', (evt) => {
    //         tech.in(data.room).emit('message', evt);
    //         console.log(evt);
    //     });
    // });

    socket.on('disconnect', (data) => {
        console.log('user disconnected');
        // only show if user disconnected for the chat rooms
        if (data.room == 'javascript' || data.room == 'css') {
           tech.emit('message', 'user disconnected'); 
        }
        
    })
});


// to run debug for windows - set DEBUG=*& npm run start