// Convert backend learning path format to frontend format
export const parseLearningPath = (backendData) => {
  if (!backendData || !backendData.learning_path) return null;
  
  // Parse the JSON string from backend
  const pathData = JSON.parse(backendData.learning_path);
  
  // Convert to frontend format
  return {
    project: "Your Learning Path",
    generatedOn: new Date(backendData.created_at),
    estimatedHours: parseInt(pathData.total_estimated_hours),
    topics: pathData.subjects.map(subject => ({
      id: subject.subject_name.toLowerCase().replace(/\s+/g, '-'),
      name: subject.subject_name,
      status: subject.is_completed === "true" ? "completed" : "not-started",
      estimatedHours: parseInt(subject.estimated_hours),
      resources: [
        {
          id: '1',
          title: 'Official Documentation',
          url: pathData.official_docs
        }
      ],
      subtopics: subject.topics.map(topic => ({
        name: topic.topic_name,
        completed: topic.is_completed === "true"
      })),
      assessment: {
        threshold: parseInt(subject.assessment.threshold),
        score: subject.assessment.score === 'null' ? null : parseInt(subject.assessment.score),
        status: subject.assessment.status
      }
    }))
  };
};

// Calculate schedule based on estimated hours
export const generateSchedule = (topics) => {
  const schedule = [];
  let currentDate = new Date();
  
  topics.forEach(topic => {
    if (topic.status !== 'completed') {
      // Split topic hours into 2-hour blocks
      const blocks = Math.ceil(topic.estimatedHours / 2);
      for (let i = 0; i < blocks; i++) {
        currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); // Add 1 day
        schedule.push({
          date: currentDate,
          topics: [topic.name],
          hours: Math.min(2, topic.estimatedHours - (i * 2))
        });
      }
    }
  });
  
  return schedule;
};
