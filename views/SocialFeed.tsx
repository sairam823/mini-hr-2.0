
import React, { useState } from 'react';
import { MOCK_POSTS, MOCK_CURRENT_USER } from '../constants';
import { Heart, MessageCircle, Share2, MoreHorizontal, ShieldCheck, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { Button } from '../components/Button';

export const SocialFeed: React.FC = () => {
  const [posts, setPosts] = useState(MOCK_POSTS);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Create Post */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex gap-4 mb-4">
          <img src={MOCK_CURRENT_USER.avatar} className="w-12 h-12 rounded-2xl object-cover" alt="Me" />
          <textarea 
            placeholder="Share an achievement or insight..."
            className="flex-1 bg-gray-50 rounded-2xl p-4 text-sm border-none focus:ring-2 focus:ring-indigo-100 outline-none resize-none min-h-[100px]"
          />
        </div>
        <div className="flex justify-between items-center border-t border-gray-50 pt-4">
          <div className="flex gap-4 text-gray-400">
            <button className="hover:text-indigo-600"><ImageIcon size={20} /></button>
            <button className="hover:text-indigo-600"><LinkIcon size={20} /></button>
          </div>
          <Button size="sm">Post Update</Button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={post.authorAvatar} className="w-12 h-12 rounded-2xl object-cover" alt={post.authorName} />
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className="font-bold text-gray-900">{post.authorName}</h4>
                    {post.isVerified && <ShieldCheck size={16} className="text-indigo-600" />}
                  </div>
                  <p className="text-xs text-gray-400 font-medium">{post.authorRole} • {post.timestamp}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:bg-gray-50 p-2 rounded-xl">
                <MoreHorizontal size={20} />
              </button>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>
            
            {post.image && (
              <img src={post.image} className="w-full h-80 object-cover rounded-[24px] mb-4" alt="Post content" />
            )}

            <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
              <button className="flex items-center gap-2 text-gray-500 hover:text-rose-500 transition-colors">
                <Heart size={20} />
                <span className="text-sm font-semibold">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors">
                <MessageCircle size={20} />
                <span className="text-sm font-semibold">{post.comments}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 ml-auto transition-colors">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
