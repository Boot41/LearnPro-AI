import React, { useState, useRef } from 'react';
import { X, Trash, Upload, FileText } from 'lucide-react';

const AddProjectModal = ({ show, onClose, onSubmit }) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [subjects, setSubjects] = useState([{ subject_name: '', topics: [''] }]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [definitionMethod, setDefinitionMethod] = useState('manual'); // 'manual' or 'file'
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  const submitHandler = async () => {
    setLoading(true);
    setError(null);
    
    if (!projectName || !projectDescription) {
      setError('Project name and description are required');
      setLoading(false);
      return;
    }
    
    if (definitionMethod === 'manual') {
      await onSubmit({
        projectName,
        projectDescription,
        subjects,
        definitionMethod
      });
    } else if (definitionMethod === 'file') {
      if (!uploadedFile) {
        setError('Please upload a package.json or requirements.txt file');
        setLoading(false);
        return;
      }
      
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('projectName', projectName);
      formData.append('projectDescription', projectDescription);
      formData.append('definitionMethod', definitionMethod);
      
      await onSubmit(formData, true);
    }
    
    setLoading(false);
  };

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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      if (fileName === 'package.json' || fileName === 'requirements.txt') {
        setUploadedFile(file);
        setError(null);
      } else {
        setError('Only package.json or requirements.txt files are allowed');
        setUploadedFile(null);
        e.target.value = null;
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  if (!show) return null;

  return (
    <div className="fixed overflow-y-auto inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
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
          
          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">How would you like to define your project?</label>
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                onClick={() => setDefinitionMethod('manual')}
                className={`flex-1 py-2 px-4 rounded-md border ${
                  definitionMethod === 'manual' 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Define Manually
              </button>
              <button
                type="button"
                onClick={() => setDefinitionMethod('file')}
                className={`flex-1 py-2 px-4 rounded-md border ${
                  definitionMethod === 'file' 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Upload File
              </button>
            </div>
          </div>
          
          {definitionMethod === 'manual' ? (
            <>
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
            </>
          ) : (
            <div className="mt-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json,.txt"
                className="hidden"
              />
              
              {!uploadedFile ? (
                <div 
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                >
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Click to upload package.json or requirements.txt</p>
                  <p className="text-xs text-gray-500">Only package.json or requirements.txt files are allowed</p>
                </div>
              ) : (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-6 w-6 text-indigo-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">{uploadedFile.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-sm text-red-600 hover:text-red-500"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Uploading a file will automatically extract project structure from your package.json or requirements.txt
              </p>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          {loading && (
            <button
              type="button"
              disabled={true}
              className="px-4 flex w-32 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md disabled:bg-indigo-400 disabled:cursor-not-allowed hover:bg-indigo-700"
            >
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </button>
          )}
          {!loading && (
            <button
              onClick={submitHandler}
              className="px-4 py-2 w-32 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Save Project
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProjectModal;
