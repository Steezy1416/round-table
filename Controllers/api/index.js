const router = require('express').Router();
const userRoutes = require('./userRoutes');
const messageRoutes = require('./messageRoutes');
const chatRoutes = require('./chatRoutes');

router.use('/users', userRoutes);
router.use('/messages', messageRoutes);
router.use('/chats', chatRoutes);

module.exports = router;
