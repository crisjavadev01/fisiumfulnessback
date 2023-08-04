const fs = require('fs');
const Product = require('../models/Product');
const {
  cloudinary,
  productsUploadOptions,
} = require('../config/cloudinaryConfig.js');

// exports.createProduct = async (req, res) => {
//   const { name, price, stock, category, description } = req.body;
//   try {
//     const newImage = req.file.path;
//     const nameImageDelete = req.file.filename;
//     const { public_id, url } = await cloudinary.uploader.upload(
//       newImage,
//       productsUploadOptions
//     );
//     const newProduct = {
//       name,
//       price,
//       stock,
//       category,
//       description,
//       image: url,
//       id_image: public_id,
//     };

//     const routeImageDelete = `../fisiumfulnessback/uploads/${nameImageDelete}`;
//     await fs.promises.unlink(routeImageDelete);

//     const product = new Product(newProduct);
//     await product.save();

//     return res.status(200).json({ message: 'Create Product', product });
//   } catch (error) {
//     return res.status(400).json({ message: error.message });
//   }
// };

exports.createProduct = async (req, res) => {
  const { name, price, stock, category, description } = req.body;
  try {
    const images = []
    let public_id1 = ""
    let public_id2 = ""
    let public_id3 = ""
    let public_id, url;
    let nameImageDelete = []
    console.log(req.files)
    if (req.files && req.files) {
      const result = await cloudinary.uploader.upload(
        req.files[0].path,
        productsUploadOptions,
        
      );
      public_id = result.public_id;
      url = result.url;
      public_id1 = public_id
      images.push({image1: url, id_image1: public_id});
      nameImageDelete.push(req.files[0].filename)
    }

    if (req.files && req.files) {
      const result = await cloudinary.uploader.upload(
        req.files[1].path,
        productsUploadOptions,
        
      );
      public_id = result.public_id;
      url = result.url;
      public_id2 = public_id
      images.push({ image2: url, id_image2: public_id });
      nameImageDelete.push(req.files[1].filename)
    }

    if (req.files && req.files) {
      const result = await cloudinary.uploader.upload(
        req.files[2].path,
        productsUploadOptions,
        
      );
      public_id = result.public_id;
      url = result.url;
      public_id3 = public_id
      images.push({ image3: url, id_image3: public_id });
      nameImageDelete.push(req.files[2].filename)
    }
    console.log(images)
    const newProduct = {
      name,
      price,
      stock,
      category,
      description,
      image: images,
      id_image1: public_id1,
      id_image2: public_id2,
      id_image3: public_id3,
    };

    const routeImageDelete1 = `../fisiumfulnessback/uploads/${nameImageDelete[0]}`;
    const routeImageDelete2 = `../fisiumfulnessback/uploads/${nameImageDelete[1]}`;
    const routeImageDelete3 = `../fisiumfulnessback/uploads/${nameImageDelete[2]}`;
    await fs.promises.unlink(routeImageDelete1);
    await fs.promises.unlink(routeImageDelete2);
    await fs.promises.unlink(routeImageDelete3);

    const product = new Product(newProduct);
    await product.save();

    return res.status(200).json({ message: 'Create Product', product });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}


exports.getAllProduct = async (req, res) => {
  const { title } = req.query;
  try {
    const products = await Product.find({ status: true }).populate(
      'category',
      'name'
    );

    if (!title) return res.status(200).json({ products });

    const productFilter = products.filter((product) =>
      product.title.toLowerCase().includes(title.toLowerCase())
    );
    if (!productFilter.length) throw new Error('no product found');

    return res.status(200).json({ productFilter });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const id = req.params.id;
  const { name, price, stock, category, description, id_image } = req.body;
  try {
    const hasFile = !!req.file;
    let newImage = undefined;
    let newIdImage = undefined;

    if (hasFile) {
      const newImageUrl = req.file.path;
      const nameImageDelete = req.file.filename;
      await cloudinary.uploader.destroy(id_image);

      const { public_id, url } = await cloudinary.uploader.upload(newImageUrl, {
        ...productsUploadOptions,
      });
      const routeImageDelete = `../fisiumfulnessback/uploads/${nameImageDelete}`;
      await fs.promises.unlink(routeImageDelete);
      newImage = url;
      newIdImage = public_id;
    }

    const newData = {
      name,
      price,
      stock,
      category,
      description,
      image: newImage,
      id_image: newIdImage,
    };

    const condition = await Product.findByIdAndUpdate({ _id: id }, newData);
    if (!condition) throw new Error('product not found');

    return res.status(200).json({ message: 'Product has been updated' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.statusProduct = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const product = await Product.findById(id);
    if (!product) throw new Error('the product does not exist');

    product.status = status;
    await product.save();

    return res
      .status(200)
      .json({ message: `the product with id ${id} has been removed` });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getProductDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).populate('category','name')

    return res.status(200).json({ product });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new Error('the product does not exist');
    await cloudinary.uploader.destroy(product.id_image);

    return res
      .status(200)
      .json({ message: `the product with id ${id} has been removed` });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getProductRemodev = async (req, res) => {
  try {
    const productsRemoved = await Product.find({ status: false }).populate('category','name');

    return res.status(200).json({ productsRemoved });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
