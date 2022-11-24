const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3001;

// ADDING IO AND SERVER
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const sequelize = require('./Config/connection');

io.on('connection', (socket) => {
  socket.on(`sender-join`, (data) => {
    socket.join(data.uid);
  });
  socket.on(`receiver-join`, (data) => {
    socket.join(data.uid);
    socket.in(data.sender_uid).emit(`init`, data.uid);
  });
  socket.on(`file-meta`, (data) => {
    socket.in(data.uid).emit(`fs-meta`, data.metadata);
  });
  socket.on(`fs-start`, (data) => {
    socket.in(data.uid).emit(`fs-share`, {});
  });
  socket.on(`file-raw`, (data) => {
    socket.in(data.uid).emit(`fs-share`, data.buffer);
  });
});

const hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./Controllers/index'));

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Server is now online'));
});
