const { Router } = require('express');
const {
  createUser,
  getUser,
  getDetail,
  updateUser,
  statusUser,
} = require('../controllers/userController');

const router = Router();

router.post('/create', createUser);
router.get('/', getUser);
router.get('/detail/:id', getDetail);
router.put('/update/:id', updateUser);
router.patch('/status/:id', statusUser);

module.exports = router;
