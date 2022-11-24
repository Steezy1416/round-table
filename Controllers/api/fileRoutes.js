const router = require('express').Router();
const { User, Chat, File } = require('../../Models');

// get all files
router.get('/', (req, res) => {
  File.findAll({
    attributes: ['id', 'file_name', 'file_path', 'user_id', 'chat_id'],
    include: [
      {
        model: User,
        attributes: ['id', 'username'],
      },
      {
        model: Chat,
        attributes: ['id', 'chat_name'],
      },
    ],
  })
    .then((fileData) => res.json(fileData))
    .catch((err) => {
      res.status(500).json(err);
    });
});

// get file by id
router.get('/:id', (req, res) => {
  File.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ['id', 'file_name', 'file_path', 'user_id', 'chat_id'],
    include: [
      {
        model: User,
        attributes: ['id', 'username'],
      },
      {
        model: Chat,
        attributes: ['id', 'chat_name'],
      },
    ],
  })
    .then((fileData) => {
      if (!fileData) {
        res.status(404).json({ message: 'No file found with this id' });
      }
      res.json(fileData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// create a new file
router.post('/', (req, res) => {
  File.create({
    file_name: req.body.file_name,
    file_path: req.body.file_path,
    user_id: req.body.user_id,
    chat_id: req.body.chat_id,
  })
    .then((fileData) => res.json(fileData))
    .catch((err) => {
      res.status(500).json(err);
    });
});

// delete a file
router.delete('/:id', (req, res) => {
  File.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((fileData) => {
      if (!fileData) {
        res.status(404).json({ message: 'No file found with this id' });
      }
      res.json(fileData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
