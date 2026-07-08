import React from 'react';
import { Clock, User, Calendar, DollarSign } from 'lucide-react';

interface Activity {
  id: string;
  type: 'checkin' | 'checkout' | 'booking' | 'payment';
  description: string;
  time: Date;
  user?: string;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'checkin',
    description: 'Alice Smith checked into Room 101',
    time: new Date('2024-01-15T14:30:00'),
    user: 'Mike Johnson',
  },
  {
    id: '2',
    type: 'booking',
    description: 'New booking for Room 301 (3 nights)',
    time: new Date('2024-01-15T13:45:00'),
    user: 'Sarah Wilson',
  },
  {
    id: '3',
    type: 'payment',
    description: 'Payment received for Booking #1234',
    time: new Date('2024-01-15T12:20:00'),
    user: 'Mike Johnson',
  },
  {
    id: '4',
    type: 'checkout',
    description: 'John Doe checked out from Room 205',
    time: new Date('2024-01-15T11:00:00'),
    user: 'Mike Johnson',
  },
];

const activityIcons = {
  checkin: User,
  checkout: User,
  booking: Calendar,
  payment: DollarSign,
};

const activityColors = {
  checkin: 'text-green-600 bg-green-100 dark:bg-green-900/50',
  checkout: 'text-blue-600 bg-blue-100 dark:bg-blue-900/50',
  booking: 'text-purple-600 bg-purple-100 dark:bg-purple-900/50',
  payment: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/50',
};

export default function ActivityLog() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {mockActivities.map((activity) => {
          const Icon = activityIcons[activity.type];
          
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activityColors[activity.type]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.description}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time.toLocaleTimeString()} • {activity.user}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}