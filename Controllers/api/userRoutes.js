const { User, Chat, Message } = require('../../Models');
const router = require('express').Router();

// get all users
router.get('/', (req, res) => {
  User.findAll({
    attributes: ['id', 'username', 'password'],
    // include: [
    //   {
    //     model: Chat,
    //     attributes: ['id', 'chat_name'],
    //   },
    //   {
    //     model: Message,
    //     attributes: ['id', 'text_message'],
    //   },
    // ],
  })
    .then((userData) => res.json(userData))
    .catch((err) => {
      res.status(500).json(err);
    });
});

// get all users by id
router.get('/:id', (req, res) => {
  User.findAll({
    where: {
      id: req.params.id,
    },
    attributes: ['id', 'username', 'password'],
    include: [
      {
        model: Chat,
        attributes: ['id', 'chat_name'],
        include: [
          {
            model: User,
            attributes: ['id', 'username'],
          },
          {
            model: Message,
            attributes: ['id', 'text_message', 'user_id'],
            include: [
              {
                model: User,
                attributes: ['id', 'username'],
              },
            ],
          },
        ],
      },
    ],
  })
    .then((userData) => {
      if (!userData) {
        res.status(404).json({ message: 'No user found with that id' });
        return;
      }
      res.json(userData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// create a new user
router.post('/', (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password,
  })
    .then((userData) => res.json(userData))
    .catch((err) => {
      res.status(500).json(err);
    });
});

// allows user to change password
router.put('/:id', (req, res) => {
  User.update(
    {
      password: req.body.password,
    },
    {
      where: {
        id: req.params.id,
      },
    },
  )
    .then((userData) => {
      if (!userData) {
        res.status(404).json({ message: 'No user found with that id' });
        return;
      }
      res.json(userData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// LOGOUT /api/users/logout
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// deletes a user
router.delete('/:id', (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((userData) => {
      if (!userData) {
        res.status(404).json({ message: 'No user found with that id' });
        return;
      }
      res.json(userData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
