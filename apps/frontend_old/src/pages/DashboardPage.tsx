import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contentService, Video } from '../services/contentService';
import { PlayIcon } from '@heroicons/react/24/solid';

const DashboardPage: React.FC = () => {
  const [trendingVideos, setTrendingVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const videos = await contentService.getTrending(10);
        setTrendingVideos(videos);
      } catch (error) {
        console.error('Failed to load trending videos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrending();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome to EduStream</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Trending Videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trendingVideos.map((video) => (
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
                  <span className="capitalize">{video.status}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {trendingVideos.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No videos available. Upload your first video to get started!
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
