import sequelize from './src/config/sequelize.js';
import Catalog, { CatalogVariant } from './src/models/catalogModel.js';
import Cart, { CartItem } from './src/models/keranjangModel.js';
import UserAdmin from './src/models/userAdminModel.js'; // Ensure models are loaded
import UserCustomer from './src/models/userCustomerModel.js';

async function testAddToCart() {
  try {
    const t = await sequelize.transaction();
    try {
      // Find a variant
      const variant = await CatalogVariant.findOne({ transaction: t });
      if (!variant) { throw new Error('No variant found'); }
      
      console.log('Variant sizes before update:', typeof variant.sizes, variant.sizes);

      // Attempt what keranjangController does
      await variant.update({ stock: variant.stock - 1 }, { transaction: t });
      console.log('SUCCESS variant update');

      // find or create cart
      const [cart] = await Cart.findOrCreate({
        where: { userId: 2 },
        defaults: { userId: 2, totalPrice: 0, status: 'active' },
        transaction: t
      });

      console.log('SUCCESS cart creation', cart.id);

      await CartItem.create({
        cartId: cart.id,
        productId: variant.catalogId,
        variantId: variant.id,
        selectedColor: variant.color || 'Red',
        selectedSize: Array.isArray(variant.sizes) ? variant.sizes[0] : 'S',
        quantity: 1
      }, { transaction: t });

      console.log('SUCCESS CartItem creation');

      await t.rollback();
    } catch (err) {
      console.log('ERROR:', err.name);
      if (err.errors) {
        console.log('VALIDATION ERRORS:', JSON.stringify(err.errors, null, 2));
      } else {
        console.log(err.message);
      }
      await t.rollback();
    }
  } catch(e) { console.error('Outer error:', e); }
  process.exit(0);
}

testAddToCart();
