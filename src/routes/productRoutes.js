const { Router } = require('express');
const {
  createProduct,
  getAllProduct,
  getProductDetail,
  updateProduct,
  statusProduct,
} = require('../controllers/productControllers');
const { adminAuthMiddleware } = require('../middleware/adminMiddleware');
const { upload } = require('../config/multerConfig');

const router = Router();

router.post('/create', upload, createProduct);
router.get('/', getAllProduct);
router.get('/detail/:id', getProductDetail);
router.put('/update/:id', upload, updateProduct);
router.patch('/status/:id', statusProduct);

module.exports = router;
