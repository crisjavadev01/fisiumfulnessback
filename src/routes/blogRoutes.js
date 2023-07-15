const { Router } = require('express');
const {
  createBlog,
  getAllBlog,
  getBlogDetail,
  updateBlog,
  statusBlog,
} = require('../controllers/blogController.js');

const router = Router();

router.post('/create', createBlog);
router.get('/', getAllBlog);
router.get('/detail/:id', getBlogDetail);
router.put('/update/:id', updateBlog);
router.patch('/status/:id', statusBlog);

module.exports = router;
