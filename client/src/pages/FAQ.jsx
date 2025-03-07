import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState({});
  
  // Toggle FAQ item
  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // FAQ data organized by categories
  const faqData = [
    {
      category: 'General',
      items: [
        {
          id: 'general-1',
          question: 'What is LearnPro AI?',
          answer: 'LearnPro AI is an intelligent learning management platform that uses artificial intelligence to create personalized learning paths for employees. Our platform analyzes individual skills, knowledge gaps, and learning preferences to deliver tailored content that maximizes engagement and knowledge retention.'
        },
        {
          id: 'general-2',
          question: 'How does AI personalize my learning experience?',
          answer: 'Our AI analyzes multiple data points including your prior knowledge, learning style, career goals, and performance on assessments to create a customized learning path. As you progress, the AI adapts to your pace and performance, adjusting content difficulty and suggesting additional resources as needed.'
        },
        {
          id: 'general-3',
          question: 'Is my data secure on LearnPro AI?',
          answer: 'Yes, data security is our top priority. We use industry-standard encryption, regular security audits, and strict access controls to protect your data. Our platform is GDPR compliant and we never share your personal information with third parties without explicit consent.'
        }
      ]
    },
    {
      category: 'Account Management',
      items: [
        {
          id: 'account-1',
          question: 'How do I reset my password?',
          answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page. You will receive an email with instructions to create a new password. If you don\'t receive the email, please check your spam folder or contact support.'
        },
        {
          id: 'account-2',
          question: 'Can I change my profile information?',
          answer: 'Yes, you can update your profile information including your name, email, and profile picture by going to the user settings page. Some information may require approval from your administrator depending on your organization\'s policies.'
        },
        {
          id: 'account-3',
          question: 'How do I update my learning preferences?',
          answer: 'You can update your learning preferences in the "Settings" section of your profile. This includes preferred learning formats (video, text, interactive), pace of learning, and areas of interest. These preferences help our AI better personalize your learning experience.'
        }
      ]
    },
    {
      category: 'Learning Paths',
      items: [
        {
          id: 'learning-1',
          question: 'How are learning paths created?',
          answer: 'Learning paths are created based on a combination of your current skill level (assessed through initial evaluations), your career goals, your organization\'s requirements, and industry best practices. Our AI continuously refines your path based on your progress and performance.'
        },
        {
          id: 'learning-2',
          question: 'Can I customize my learning path?',
          answer: 'While the AI automatically creates an optimized learning path, you can request modifications through your profile settings. You can prioritize certain skills or topics, adjust the learning pace, or add specific courses you\'re interested in. Your manager or administrator may need to approve significant changes.'
        },
        {
          id: 'learning-3',
          question: 'How long does it take to complete a learning path?',
          answer: 'The time required to complete a learning path varies based on its complexity, your prior knowledge, and the time you dedicate to learning. Most paths include an estimated completion time, but remember that quality of learning is more important than speed.'
        },
        {
          id: 'learning-4',
          question: 'Can I access my learning path on mobile devices?',
          answer: 'Yes, LearnPro AI is fully responsive and works on smartphones, tablets, and desktop computers. We also offer native mobile apps for iOS and Android that allow for offline learning and progress synchronization when you reconnect.'
        }
      ]
    },
    {
      category: 'Technical Support',
      items: [
        {
          id: 'support-1',
          question: 'What browsers are supported by LearnPro AI?',
          answer: 'LearnPro AI supports all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of these browsers. Internet Explorer is not supported.'
        },
        {
          id: 'support-2',
          question: 'How do I report a technical issue?',
          answer: 'You can report technical issues by clicking on the "Help" button in the navigation menu and selecting "Report an Issue." Please provide as much detail as possible, including screenshots if applicable. Our support team typically responds within 24 business hours.'
        },
        {
          id: 'support-3',
          question: 'Is internet connection required to use LearnPro AI?',
          answer: 'An internet connection is required for most features of LearnPro AI. However, our mobile apps allow you to download certain content for offline learning. Your progress will sync automatically when you reconnect to the internet.'
        }
      ]
    }
  ];
  
  // Filter FAQ items based on search term
  const filteredFAQs = searchTerm
    ? faqData.map(category => ({
        ...category,
        items: category.items.filter(item =>
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.items.length > 0)
    : faqData;

  return (
    <div className="space-y-6">
      {/* FAQ Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <HelpCircle className="h-6 w-6 text-indigo-600 mr-2" />
          <h1 className="text-2xl font-semibold text-gray-900">Frequently Asked Questions</h1>
        </div>
        <p className="text-gray-600 leading-relaxed">
          Find answers to the most common questions about LearnPro AI. If you can't find what you're looking for,
          please visit our <a href="/contact" className="text-indigo-600 hover:text-indigo-800">Contact page</a> for additional support.
        </p>
        
        {/* Search */}
        <div className="mt-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search questions or keywords"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* FAQ Content */}
      {filteredFAQs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">No results found for "{searchTerm}". Try a different search term.</p>
        </div>
      ) : (
        filteredFAQs.map((category, index) => (
          <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-indigo-50 p-4 border-b border-indigo-100">
              <h2 className="text-lg font-medium text-indigo-800">{category.category}</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {category.items.map((item) => (
                <div key={item.id} className="p-4">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="flex justify-between items-center w-full text-left"
                  >
                    <h3 className="text-md font-medium text-gray-900">{item.question}</h3>
                    {openItems[item.id] ? (
                      <ChevronUp className="h-5 w-5 text-indigo-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-indigo-500" />
                    )}
                  </button>
                  {openItems[item.id] && (
                    <div className="mt-2 text-gray-600 text-sm">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
      
      {/* Contact CTA */}
      <div className="bg-indigo-50 rounded-lg shadow p-6 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-indigo-800">Still have questions?</h2>
          <p className="text-indigo-600 mt-1">Our support team is ready to help you.</p>
        </div>
        <a 
          href="/contact" 
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
};

export default FAQ;
