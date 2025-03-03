import React from 'react';
import { ExternalLink } from 'lucide-react';

const ResourcesList = ({ resources }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Official Documentation</h2>
      </div>
      <div className="p-6">
        {resources.length > 0 ? (
          <div className="space-y-4">
            {resources.map((resource) => (
              <div key={resource.id} className="flex items-start">
                <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
                  <ExternalLink className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="text-md font-medium text-gray-900">{resource.title}</h3>
                  <p className="text-sm text-gray-500">{resource.topic}</p>
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-800 mt-1 inline-block"
                  >
                    View Documentation
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No resources available.</p>
        )}
      </div>
    </div>
  );
};

export default ResourcesList;
