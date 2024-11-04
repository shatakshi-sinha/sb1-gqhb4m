import Dexie, { type Table } from 'dexie';

export interface Item {
  id?: number;
  name: string;
  description: string;
  location: string;
  category: string;
  status: 'lost' | 'found' | 'claimed';
  date: Date;
  reportedBy: string;
  contactInfo: string;
  imageUrl?: string;
  userId: number;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  points: number;
}

export class LostAndFoundDB extends Dexie {
  items!: Table<Item>;
  users!: Table<User>;

  constructor() {
    super('LostAndFoundDB');
    this.version(1).stores({
      items: '++id, name, category, status, date, userId',
      users: '++id, email, points'
    });
  }
}

export const db = new LostAndFoundDB();