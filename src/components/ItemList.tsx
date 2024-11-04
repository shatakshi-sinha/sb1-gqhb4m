import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Calendar, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export function ItemList() {
  const items = useLiveQuery(() => db.items.toArray());

  const handleClaim = async (id: number) => {
    try {
      await db.items.update(id, { status: 'claimed' });
      // Add points to user who reported the found item
      const item = await db.items.get(id);
      if (item) {
        const user = await db.users.where('email').equals(item.contactInfo).first();
        if (user) {
          await db.users.update(user.id!, { points: user.points + 100 });
          toast.success('Item claimed! Reporter awarded 100 points!');
        }
      }
    } catch (error) {
      toast.error('Failed to claim item');
    }
  };

  if (!items) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.status === 'lost' ? 'bg-red-100 text-red-800' :
                item.status === 'found' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
            </div>
            
            <p className="mt-2 text-gray-600">{item.description}</p>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-2" />
                {item.location}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <User className="w-4 h-4 mr-2" />
                {item.reportedBy}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Phone className="w-4 h-4 mr-2" />
                {item.contactInfo}
              </div>
            </div>

            {item.status === 'found' && (
              <button
                onClick={() => item.id && handleClaim(item.id)}
                className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Claim Item
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}