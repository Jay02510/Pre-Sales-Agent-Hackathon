import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Edit3, Settings } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface InsightBlockProps {
  id: string;
  title: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  content: string[] | string;
  type: 'list' | 'text' | 'grid';
  isEditable?: boolean;
  onEdit?: (id: string, newContent: string[] | string) => void;
  onFeedback?: (id: string, feedback: 'positive' | 'negative', comment?: string) => void;
}

const InsightBlock: React.FC<InsightBlockProps> = ({
  id,
  title,
  icon: Icon,
  iconColor,
  bgColor,
  content,
  type,
  isEditable = false,
  onEdit,
  onFeedback
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleSave = () => {
    onEdit?.(id, editContent);
    setIsEditing(false);
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    onFeedback?.(id, type, feedbackComment);
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setShowFeedback(false);
      setFeedbackSubmitted(false);
      setFeedbackComment('');
    }, 2000);
  };

  const renderContent = () => {
    if (isEditing) {
      if (type === 'list' && Array.isArray(editContent)) {
        return (
          <div className="space-y-2">
            {editContent.map((item, index) => (
              <input
                key={index}
                type="text"
                value={item}
                onChange={(e) => {
                  const newContent = [...editContent];
                  newContent[index] = e.target.value;
                  setEditContent(newContent);
                }}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              />
            ))}
            <button
              onClick={() => setEditContent([...editContent as string[], ''])}
              className="text-blue-600 text-sm hover:text-blue-700"
            >
              + Add item
            </button>
          </div>
        );
      } else {
        return (
          <textarea
            value={editContent as string}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none"
            rows={4}
          />
        );
      }
    }

    if (type === 'list' && Array.isArray(content)) {
      return (
        <ul className="space-y-3">
          {content.map((item, index) => (
            <li key={index} className="flex items-start space-x-3">
              <div className={`w-1.5 h-1.5 ${iconColor.replace('text-', 'bg-')} rounded-full mt-2 flex-shrink-0`}></div>
              <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    if (type === 'grid' && Array.isArray(content)) {
      return (
        <div className="grid md:grid-cols-2 gap-4">
          {content.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 text-sm">{item}</p>
            </div>
          ))}
        </div>
      );
    }

    return <p className="text-gray-700 leading-relaxed text-sm">{content as string}</p>;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 relative group">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 ${bgColor} rounded-lg`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
        
        {/* Controls */}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {isEditable && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit content"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setShowFeedback(!showFeedback)}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Provide feedback"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
          <button
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        {renderContent()}
      </div>

      {/* Edit Controls */}
      {isEditing && (
        <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setEditContent(content);
            }}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Feedback Panel */}
      {showFeedback && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-10">
          {!feedbackSubmitted ? (
            <>
              <h4 className="font-semibold text-gray-900 mb-3">How helpful was this insight?</h4>
              <div className="flex items-center space-x-3 mb-3">
                <button
                  onClick={() => handleFeedback('positive')}
                  className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-sm">Helpful</span>
                </button>
                <button
                  onClick={() => handleFeedback('negative')}
                  className="flex items-center space-x-2 bg-red-50 text-red-700 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span className="text-sm">Not helpful</span>
                </button>
              </div>
              <textarea
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="Optional: Tell us how we can improve this insight..."
                className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none"
                rows={2}
              />
            </>
          ) : (
            <div className="text-center py-2">
              <div className="text-green-600 font-medium text-sm">Thank you for your feedback!</div>
              <div className="text-gray-500 text-xs mt-1">This helps us improve our insights</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InsightBlock;