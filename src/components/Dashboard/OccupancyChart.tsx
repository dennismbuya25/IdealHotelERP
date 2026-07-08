import React from 'react';
import { Room } from '../../types';

interface OccupancyChartProps {
  rooms: Room[];
}

export default function OccupancyChart({ rooms }: OccupancyChartProps) {
  const statusCounts = rooms.reduce((acc, room) => {
    acc[room.status] = (acc[room.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusColors = {
    available: 'bg-green-500',
    occupied: 'bg-blue-500',
    dirty: 'bg-yellow-500',
    maintenance: 'bg-red-500',
    'out-of-order': 'bg-gray-500',
  };

  const statusLabels = {
    available: 'Available',
    occupied: 'Occupied',
    dirty: 'Dirty',
    maintenance: 'Maintenance',
    'out-of-order': 'Out of Order',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Room Status Overview</h3>
      
      <div className="space-y-4">
        {Object.entries(statusCounts).map(([status, count]) => {
          const percentage = (count / rooms.length) * 100;
          
          return (
            <div key={status} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {statusLabels[status as keyof typeof statusLabels]}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {count} rooms ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${statusColors[status as keyof typeof statusColors]}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="text-center">
            <div className={`w-4 h-4 ${statusColors[status as keyof typeof statusColors]} rounded-full mx-auto mb-1`} />
            <p className="text-xs text-gray-600 dark:text-gray-400">{count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}