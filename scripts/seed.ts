import db from '../src/database';
import { User, Product, Order } from '../src/models';
import { initializeDatabase } from '../src/database';

const seed = async () => {
  await initializeDatabase();

  const users: User[] = Array.from({ length: 50 }, (_, i) => ({
    name: `Usuario ${i + 1}`,
    email: `usuario${i + 1}@exemplo.com`,
    age: 18 + (i % 50),
    createdAt: new Date()
  }));

  const products: Product[] = Array.from({ length: 50 }, (_, i) => ({
    name: `Produto ${i + 1}`,
    price: 10 + (i * 0.5),
    category: ['Eletrônicos', 'Livros', 'Roupas'][i % 3],
    stock: 100 - i
  }));

  const orders: Order[] = Array.from({ length: 50 }, (_, i) => ({
    userId: (i % 50) + 1,
    productId: (i % 50) + 1,
    quantity: (i % 10) + 1,
    total: 50 + (i * 2)
  }));

  for (const user of users) {
    await new Promise<void>((resolve, reject) => {
      db.run(
        'INSERT INTO users (name, email, age, createdAt) VALUES (?, ?, ?, ?)',
        [user.name, user.email, user.age, user.createdAt.toISOString()],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  for (const product of products) {
    await new Promise<void>((resolve, reject) => {
      db.run(
        'INSERT INTO products (name, price, category, stock) VALUES (?, ?, ?, ?)',
        [product.name, product.price, product.category, product.stock],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  for (const order of orders) {
    await new Promise<void>((resolve, reject) => {
      db.run(
        'INSERT INTO orders (userId, productId, quantity, total) VALUES (?, ?, ?, ?)',
        [order.userId, order.productId, order.quantity, order.total],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  db.close();
};

seed().then(() => {
  console.log('Banco de dados populado com sucesso!');
  process.exit(0);
}).catch((err) => {
  console.error('Erro ao popular o banco de dados:', err);
  process.exit(1);
});