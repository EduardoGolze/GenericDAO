import { Database } from 'sqlite3';

type Criteria = {
  field: string;
  op: '=' | '!=' | '>' | '<' | '>=' | '<=';
  value: any;
};

export class GenericDAO<T extends { id?: number }> {
  private db: Database;
  public tableName: string;

  constructor(db: Database, tableName: string) {
    this.db = db;
    this.tableName = tableName;
  }

  private parseRow(row: any): T {
    return Object.entries(row).reduce((acc, [key, value]) => {
      if (key === 'createdAt' && typeof value === 'string') {
        acc[key as keyof T] = new Date(value) as any;
      } else {
        acc[key as keyof T] = value as any;
      }
      return acc;
    }, {} as T);
  }

  async create(entity: Omit<T, 'id'>): Promise<number> {
    const keys = Object.keys(entity).join(', ');
    const placeholders = Object.keys(entity).map(() => '?').join(', ');
    const values = Object.values(entity).map(value => 
      value instanceof Date ? value.toISOString() : value
    );

    const query = `INSERT INTO ${this.tableName} (${keys}) VALUES (${placeholders})`;
    
    return new Promise((resolve, reject) => {
      this.db.run(query, values, function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  }

  async read(id: number): Promise<T | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    return new Promise((resolve, reject) => {
      this.db.get(query, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row ? this.parseRow(row) : null);
      });
    });
  }

  async update(id: number, entity: Partial<T>): Promise<void> {
    const updates = Object.keys(entity)
      .map(key => `${key} = ?`)
      .join(', ');
    const values = [...Object.values(entity), id];

    const query = `UPDATE ${this.tableName} SET ${updates} WHERE id = ?`;
    return new Promise((resolve, reject) => {
      this.db.run(query, values, function (err) {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async delete(id: number): Promise<void> {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    return new Promise((resolve, reject) => {
      this.db.run(query, [id], function (err) {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async findAll(): Promise<T[]> {
    const query = `SELECT * FROM ${this.tableName}`;
    return new Promise((resolve, reject) => {
      this.db.all(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(row => this.parseRow(row)));
      });
    });
  }

  async findByCriteria(criteria: Criteria): Promise<T[]> {
    const { field, op, value } = criteria;
    const query = `SELECT * FROM ${this.tableName} WHERE ${field} ${op} ?`;
    return new Promise((resolve, reject) => {
      this.db.all(query, [value], (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(row => this.parseRow(row)));
      });
    });
  }
}