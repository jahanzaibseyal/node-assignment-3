const faker = require('faker');
const mongoose = require('mongoose');

// Models
const Product = require('./models/product');
const Category = require('./models/category');
const Cart = require('./models/cart');

// Generate a random category ID
const generateCategoryId = () => {
  return new mongoose.Types.ObjectId();
};

// Generate a random user ID
const generateUserId = () => {
  return new mongoose.Types.ObjectId();
};

// Generate dummy data for products
const generateProducts = (numProducts) => {
  const products = [];
  for (let i = 0; i < numProducts; i++) {
    const product = {
      title: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      price: faker.commerce.price(),
      availableQuantity: faker.random.number({ min: 10, max: 100 }),
      category: generateCategoryId(),
      otherProperties: {
        // Customize based on the specific properties needed for each product
      },
    };
    products.push(product);
  }
  return products;
};

// Generate dummy data for categories
const generateCategories = (numCategories, parentCategoryId = null) => {
  const categories = [];
  for (let i = 0; i < numCategories; i++) {
    const category = {
      name: faker.commerce.department(),
      parent: parentCategoryId,
    };
    categories.push(category);
  }
  return categories;
};

// Generate dummy data for cart items
const generateCartItems = (products) => {
  const cartItems = [];
  for (const product of products) {
    const quantity = faker.random.number({ min: 1, max: 5 });
    const cartItem = {
      product: product._id,
      quantity,
    };
    cartItems.push(cartItem);
  }
  return cartItems;
};

// Generate dummy data for products, categories, and cart
const saveDummyData = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://seyaljahanzaib:bZHsiORMNP1txQ8h@cluster0.dtkknyf.mongodb.net/?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );

    // Generate and save dummy data for products
    const numProducts = 10;
    const products = generateProducts(numProducts);
    await Product.insertMany(products);
    console.log('Dummy data for products saved successfully.');

    // Generate and save dummy data for categories
    const numCategories = 5;
    const categories = generateCategories(numCategories);
    await Category.insertMany(categories);

    // Generate and save dummy data for sub-categories with parent
    const parentCategories = await Category.find({ parent: null });
    for (const parentCategory of parentCategories) {
      const numSubCategories = 3;
      const subCategories = generateCategories(
        numSubCategories,
        parentCategory._id,
      );
      await Category.insertMany(subCategories);
    }

    console.log('Dummy data for categories saved successfully.');

    // Generate and save dummy data for cart
    const numCartItems = 3;
    const cartItems = generateCartItems(products.slice(0, numCartItems));
    const user = generateUserId();
    const cart = { user, items: cartItems };
    await Cart.create(cart);
    console.log('Dummy data for cart saved successfully.');

    mongoose.disconnect();
  } catch (error) {
    console.error('Error saving dummy data:', error);
    mongoose.disconnect();
  }
};

saveDummyData();
