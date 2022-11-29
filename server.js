const express = require('express');
const session = require('express-session');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const http = require('http');

const SequelizeStore = require('connect-session-sequelize')(session.Store);
const socketio = require('socket.io');
const sequelize = require('./Config/connection');
const helpers = require('./utils/formatter');

const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./utils/users');

const app = express();
const server = http.createServer(app);

const io = socketio(server);

const PORT = process.env.PORT || 3001;

// Create Session middleware
const sess = {
  secret: `${process.env.SECRET}`,
  cookie: {
    // session expires in 2 hours
    maxAge: 7200000,
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
  rolling: true,
};

app.use(session(sess));

// Set Handlebars as the default template engine.
const hbs = exphbs.create({ helpers });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Turn on routes
app.use(require('./Controllers/index'));

const rtBot = 'Roundtable Bot';

// #region Socket.io
// Run when client connects
io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit(`message`, formatMessage(rtBot, `Welcome to the chat!`));

    // broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        `message`,
        formatMessage(rtBot, `${user.username} has joined the chat`)
      );
    // Send users and room info
    io.to(user.room).emit(`roomUsers`, {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on(`chatMessage`, (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit(`message`, formatMessage(`${user.username}`, msg));

    socket.broadcast.emit('notification', room);
    console.log(`Message is ${message}`);
  });

  // Send File
  socket.on(`file-message`, ({ room, file }) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit(
      `message`,
      formatMessage(`${user.username}`, null, file)
    );
  });

  // runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        `message`,
        formatMessage(rtBot, `${user.username} has left the chat`)
      );
    }

    // Send users and room info
    io.to(user.room).emit(`roomUsers`, {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });
});
// #endregion

sequelize.sync({ force: false }).then(() => {
  server.listen(PORT, () =>
    console.log(`Server running on port ${PORT}. Happy Hacking!`)
  );
});
