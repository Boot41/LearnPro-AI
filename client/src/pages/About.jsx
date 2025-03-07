import React from 'react';
import { Info, Users, Award, BookOpen, Target } from 'lucide-react';

const About = () => {
  return (
    <div className="space-y-6">
      {/* About Us Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Info className="h-6 w-6 text-indigo-600 mr-2" />
          <h1 className="text-2xl font-semibold text-gray-900">About LearnPro AI</h1>
        </div>
        <p className="text-gray-600 leading-relaxed">
          LearnPro AI is a cutting-edge learning management platform that leverages artificial intelligence 
          to create personalized learning paths tailored to each employee's unique skills, goals, and learning style.
          Founded in 2022, our mission is to revolutionize corporate training by making it more effective,
          engaging, and measurable.
        </p>
      </div>

      {/* Our Mission */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Target className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Our Mission</h2>
        </div>
        <p className="text-gray-600 leading-relaxed mb-4">
          At LearnPro AI, we believe that learning should be personalized, engaging, and directly applicable to real-world challenges.
          Our mission is to empower organizations and individuals to reach their full potential through AI-driven learning experiences
          that adapt to each learner's unique needs.
        </p>
        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <p className="text-indigo-700 italic">
            "Our vision is a world where every employee has access to personalized learning that unlocks their full potential."
          </p>
          <p className="text-gray-500 text-sm mt-2">— Sarah Johnson, CEO & Founder</p>
        </div>
      </div>

      {/* Our Team */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Users className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Our Team</h2>
        </div>
        <p className="text-gray-600 mb-6">
          LearnPro AI brings together experts in machine learning, educational psychology, and enterprise software
          to create a truly transformative learning experience.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Team Member 1 */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-indigo-600 text-2xl font-bold">SJ</span>
            </div>
            <h3 className="font-medium text-gray-900">Sarah Johnson</h3>
            <p className="text-gray-500 text-sm">CEO & Founder</p>
          </div>
          
          {/* Team Member 2 */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-indigo-600 text-2xl font-bold">MT</span>
            </div>
            <h3 className="font-medium text-gray-900">Michael Thompson</h3>
            <p className="text-gray-500 text-sm">CTO</p>
          </div>
          
          {/* Team Member 3 */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-indigo-600 text-2xl font-bold">RP</span>
            </div>
            <h3 className="font-medium text-gray-900">Rebecca Patel</h3>
            <p className="text-gray-500 text-sm">Head of Learning Design</p>
          </div>
        </div>
      </div>

      {/* Our Approach */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <BookOpen className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Our Approach</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">AI-Powered Personalization</h3>
            <p className="text-gray-600">
              Our proprietary algorithms analyze learner performance, preferences, and goals to create 
              truly personalized learning experiences.
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Microlearning Focus</h3>
            <p className="text-gray-600">
              We break complex topics into digestible modules that fit into busy schedules
              and optimize knowledge retention.
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Real-World Application</h3>
            <p className="text-gray-600">
              Every learning path includes practical exercises that connect theory to on-the-job challenges.
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Continuous Improvement</h3>
            <p className="text-gray-600">
              Our platform evolves based on learner feedback and performance data to constantly improve outcomes.
            </p>
          </div>
        </div>
      </div>

      {/* Awards and Recognition */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center mb-4">
          <Award className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Awards & Recognition</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-bold">1</span>
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-gray-900">Best Learning Platform of 2024</h3>
              <p className="text-gray-500 text-sm">HR Tech Awards</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-bold">2</span>
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-gray-900">Most Innovative AI Implementation</h3>
              <p className="text-gray-500 text-sm">Future of Work Summit 2023</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-bold">3</span>
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-gray-900">Top 50 EdTech Companies</h3>
              <p className="text-gray-500 text-sm">TechCrunch Recognition, 2023</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
