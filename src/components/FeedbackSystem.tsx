import React, { useState } from 'react';
import { MessageSquare, Star, Send, CheckCircle } from 'lucide-react';

interface FeedbackSystemProps {
  reportId: string;
  onFeedbackSubmit?: (feedback: {
    reportId: string;
    rating: number;
    comment: string;
    helpful: boolean;
  }) => void;
}

const FeedbackSystem: React.FC<FeedbackSystemProps> = ({ reportId, onFeedbackSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const feedback = {
      reportId,
      rating,
      comment,
      helpful: rating >= 4
    };
    
    onFeedbackSubmit?.(feedback);
    setSubmitted(true);
    
    // Auto-close after 3 seconds
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
      setRating(0);
      setComment('');
    }, 3000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 z-50"
        title="Provide feedback"
      >
        <MessageSquare className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-80 z-50">
      {!submitted ? (
        <>
          <div className="flex items-center space-x-2 mb-4">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Rate this report</h3>
          </div>
          
          {/* Star Rating */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">How helpful was this research report?</p>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-1 transition-colors ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                  }`}
                >
                  <Star className="h-6 w-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you think or how we can improve..."
              className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Submit</span>
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Thank you!</h3>
          <p className="text-sm text-gray-600">Your feedback helps us improve our AI insights</p>
        </div>
      )}
    </div>
  );
};

export default FeedbackSystem;