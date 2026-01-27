import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contentService, Video } from '../services/contentService';
import { useAuthStore } from '../store/authStore';
import { PlayIcon, PlusIcon } from '@heroicons/react/24/solid';

const LibraryPage: React.FC = () => {
  const { user } = useAuthStore();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const videoList = await contentService.getVideos({
          search: searchQuery || undefined,
          limit: 50,
        });
        setVideos(videoList);
      } catch (error) {
        console.error('Failed to load videos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Video Library</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          <PlusIcon className="h-5 w-5 mr-2" />
          Upload Video
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <Link
            key={video.id}
            to={`/watch/${video.id}`}
            className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {video.thumbnail ? (
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <PlayIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 truncate">
                {video.title}
              </h3>
              {video.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{video.description}</p>
              )}
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>{Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</span>
                <span className={`capitalize px-2 py-1 rounded ${
                  video.status === 'ready' ? 'bg-green-100 text-green-800' :
                  video.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {video.status}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {searchQuery ? 'No videos found matching your search.' : 'No videos available.'}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
