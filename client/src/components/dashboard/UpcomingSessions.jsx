import React from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

const UpcomingSessions = ({ sessions }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Upcoming Learning Sessions</h2>
      </div>
      <div className="p-6">
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-start">
                <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="text-md font-medium text-gray-900">{session.topic}</h3>
                  <p className="text-sm text-gray-500">
                    {format(session.date, 'MMM dd, yyyy')} • {session.duration} minutes
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No upcoming sessions scheduled.</p>
        )}
      </div>
    </div>
  );
};

export default UpcomingSessions;
