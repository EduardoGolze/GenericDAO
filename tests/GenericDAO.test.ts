import db from '../src/database';
import { GenericDAO } from '../src/dao/GenericDAO';
import { User, Product, Order } from '../src/models';
import { initializeDatabase } from '../src/database';

describe('GenericDAO', () => {
  let userDAO: GenericDAO<User>;
  let productDAO: GenericDAO<Product>;
  let orderDAO: GenericDAO<Order>;

  beforeAll(async () => {
    await initializeDatabase();
    userDAO = new GenericDAO<User>(db, 'users');
    productDAO = new GenericDAO<Product>(db, 'products');
    orderDAO = new GenericDAO<Order>(db, 'orders');
  });

  afterAll(() => {
    db.close();
  });

  describe('User DAO', () => {
    test('criar e ler usuário com data válida', async () => {
      const newUser = {
        name: `Usuario-${Date.now()}`,
        email: `teste-${Date.now()}@exemplo.com`,
        age: 25,
        createdAt: new Date() // Data atual
      };

      const id = await userDAO.create(newUser);
      const createdUser = await userDAO.read(id);

      // Verificações básicas
      expect(createdUser).toBeTruthy();
      expect(createdUser?.id).toBe(id);

      // Verificação da data
      if (createdUser) {
        expect(createdUser.createdAt instanceof Date).toBe(true);
        expect(createdUser.createdAt.getTime()).not.toBeNaN();
        
        const diferenca = Math.abs(
          createdUser.createdAt.getTime() - newUser.createdAt.getTime()
        );
        expect(diferenca).toBeLessThan(1000);
      }
    }, 10000); // Timeout de 10 segundos
  });

  describe('Product DAO', () => {
    test('criar e ler produto', async () => {
      const newProduct = {
        name: `Produto-${Date.now()}`,
        price: 99.99,
        category: 'Eletrônicos',
        stock: 10
      };

      const id = await productDAO.create(newProduct);
      const createdProduct = await productDAO.read(id);

      expect(createdProduct).toMatchObject({
        name: newProduct.name,
        price: newProduct.price,
        category: newProduct.category,
        stock: newProduct.stock
      });
    });
  });

  describe('Order DAO', () => {
    test('criar e ler pedido', async () => {
      const newOrder = {
        userId: 1,
        productId: 1,
        quantity: 2,
        total: 199.98
      };

      const id = await orderDAO.create(newOrder);
      const createdOrder = await orderDAO.read(id);

      expect(createdOrder).toMatchObject({
        userId: newOrder.userId,
        productId: newOrder.productId,
        quantity: newOrder.quantity,
        total: newOrder.total
      });
    });
  });
});