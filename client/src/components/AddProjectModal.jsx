import React, { useState } from 'react';
import { X, Trash, PlusCircle } from 'lucide-react';
import { createProject } from '../services/projectService';

const AddProjectModal = ({ show, onClose, onProjectAdded }) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [subjects, setSubjects] = useState([{ subject_name: '', topics: [''] }]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddSubject = () => {
    setSubjects([...subjects, { subject_name: '', topics: [''] }]);
  };

  const handleAddTopic = (subjectIndex) => {
    const newSubjects = [...subjects];
    newSubjects[subjectIndex].topics.push('');
    setSubjects(newSubjects);
  };

  const handleSubjectChange = (index, value) => {
    const newSubjects = [...subjects];
    newSubjects[index].subject_name = value;
    setSubjects(newSubjects);
  };

  const handleTopicChange = (subjectIndex, topicIndex, value) => {
    const newSubjects = [...subjects];
    newSubjects[subjectIndex].topics[topicIndex] = value;
    setSubjects(newSubjects);
  };

  const handleDeleteSubject = (index) => {
    const newSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(newSubjects);
  };

  const handleDeleteTopic = (subjectIndex, topicIndex) => {
    const newSubjects = [...subjects];
    newSubjects[subjectIndex].topics = newSubjects[subjectIndex].topics.filter((_, i) => i !== topicIndex);
    setSubjects(newSubjects);
  };

  const handleFormSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const projectData = {
        project_name: projectName,
        project_description: projectDescription,
        subjects: subjects.map(subject => ({
          subject_name: subject.subject_name,
          topics: subject.topics.filter(topic => topic.trim() !== '')
        }))
      };
      
      await createProject(projectData);
      
      // Clear form
      setProjectName('');
      setProjectDescription('');
      setSubjects([{ subject_name: '', topics: [''] }]);
      
      // Close modal and notify parent
      onClose();
      if (onProjectAdded) {
        onProjectAdded();
      }
    } catch (err) {
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Add New Project</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter project name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              placeholder="Enter project description"
            />
          </div>
          {subjects.map((subject, subjectIndex) => (
            <div key={subjectIndex} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={subject.subject_name}
                  onChange={(e) => handleSubjectChange(subjectIndex, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter subject name"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteSubject(subjectIndex)}
                  className="text-sm text-red-600 hover:text-red-500"
                >
                  <Trash />
                </button>
              </div>
              {subject.topics.map((topic, topicIndex) => (
                <div key={topicIndex} className="ml-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => handleTopicChange(subjectIndex, topicIndex, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter topic"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteTopic(subjectIndex, topicIndex)}
                      className="text-sm text-red-600 hover:text-red-500"
                    >
                      <Trash />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddTopic(subjectIndex)}
                className="ml-4 text-sm text-indigo-600 hover:text-indigo-500"
              >
                + Add Topic
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSubject}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            + Add Subject
          </button>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleFormSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Save Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProjectModal;
