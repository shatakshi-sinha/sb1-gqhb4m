import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Trophy } from 'lucide-react';

export function RewardPoints() {
  const users = useLiveQuery(() => 
    db.users.orderBy('points').reverse().limit(5).toArray()
  );

  if (!users) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-semibold">Top Contributors</h2>
      </div>
      
      <div className="space-y-4">
        {users.map((user, index) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`w-6 h-6 flex items-center justify-center rounded-full ${
                index === 0 ? 'bg-yellow-100 text-yellow-800' :
                index === 1 ? 'bg-gray-100 text-gray-800' :
                index === 2 ? 'bg-orange-100 text-orange-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {index + 1}
              </span>
              <span className="font-medium">{user.name}</span>
            </div>
            <span className="text-sm font-semibold text-blue-600">{user.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}