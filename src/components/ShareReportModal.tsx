import React, { useState } from 'react';
import { X, Copy, Check, Mail, Link, Share2, Users, Lock, Globe } from 'lucide-react';

interface ShareReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: any;
}

export const ShareReportModal: React.FC<ShareReportModalProps> = ({ isOpen, onClose, report }) => {
  const [shareOption, setShareOption] = useState<'link' | 'email'>('link');
  const [accessLevel, setAccessLevel] = useState<'view' | 'edit'>('view');
  const [visibility, setVisibility] = useState<'private' | 'team' | 'public'>('team');
  const [email, setEmail] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [shareComplete, setShareComplete] = useState(false);

  if (!isOpen) return null;

  const shareableLink = `https://glance.ai/shared-report/${report.id}?access=${accessLevel}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddEmail = () => {
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmails([...emails, email]);
      setEmail('');
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter(e => e !== emailToRemove));
  };

  const handleShare = () => {
    // In a real implementation, this would send the sharing request to the backend
    setShareComplete(true);
    setTimeout(() => {
      setShareComplete(false);
      onClose();
    }, 2000);
  };

  const getVisibilityIcon = () => {
    switch (visibility) {
      case 'private': return Lock;
      case 'team': return Users;
      case 'public': return Globe;
    }
  };

  const VisibilityIcon = getVisibilityIcon();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Share2 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Share Report</h2>
              <p className="text-gray-600">Share "{report.companyName}" report with your team</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!shareComplete ? (
          <>
            {/* Share Options */}
            <div className="mb-6">
              <div className="flex border border-gray-200 rounded-lg overflow-hidden mb-4">
                <button
                  onClick={() => setShareOption('link')}
                  className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 ${
                    shareOption === 'link' 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Link className="h-4 w-4" />
                  <span>Share Link</span>
                </button>
                <button
                  onClick={() => setShareOption('email')}
                  className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 ${
                    shareOption === 'email' 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </button>
              </div>

              {/* Access Level */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Level
                </label>
                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setAccessLevel('view')}
                    className={`flex-1 py-2 px-4 ${
                      accessLevel === 'view' 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    View Only
                  </button>
                  <button
                    onClick={() => setAccessLevel('edit')}
                    className={`flex-1 py-2 px-4 ${
                      accessLevel === 'edit' 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Can Edit
                  </button>
                </div>
              </div>

              {/* Visibility */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visibility
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setVisibility('private')}
                    className={`p-3 flex flex-col items-center justify-center border rounded-lg ${
                      visibility === 'private' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Lock className="h-5 w-5 mb-1" />
                    <span className="text-sm">Private</span>
                  </button>
                  <button
                    onClick={() => setVisibility('team')}
                    className={`p-3 flex flex-col items-center justify-center border rounded-lg ${
                      visibility === 'team' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Users className="h-5 w-5 mb-1" />
                    <span className="text-sm">Team</span>
                  </button>
                  <button
                    onClick={() => setVisibility('public')}
                    className={`p-3 flex flex-col items-center justify-center border rounded-lg ${
                      visibility === 'public' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Globe className="h-5 w-5 mb-1" />
                    <span className="text-sm">Public</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Share Link */}
            {shareOption === 'link' && (
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <VisibilityIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {visibility === 'private' ? 'Only specific people can access' : 
                     visibility === 'team' ? 'Anyone in your team can access' : 
                     'Anyone with the link can access'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={shareableLink}
                    readOnly
                    className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Email Sharing */}
            {shareOption === 'email' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share with people
                </label>
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 p-3 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={handleAddEmail}
                    className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>

                {/* Email List */}
                {emails.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {emails.map((e, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>{e}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveEmail(e)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <VisibilityIcon className="h-4 w-4" />
                  <span>
                    {visibility === 'private' ? 'Only these people can access' : 
                     visibility === 'team' ? 'These people and your team can access' : 
                     'These people and anyone with the link can access'}
                  </span>
                </div>
              </div>
            )}

            {/* Message */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add a message (optional)
              </label>
              <textarea
                placeholder="Enter a message to include with your shared report"
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Share Report</span>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <Check className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Report Shared!</h3>
            <p className="text-gray-600">
              Your report has been shared successfully.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};