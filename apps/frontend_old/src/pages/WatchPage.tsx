import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contentService, Video } from '../services/contentService';
import { streamingService } from '../services/streamingService';
import HLSPlayer from '../components/HLSPlayer';
import { useAuthStore } from '../store/authStore';

const WatchPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuality, setCurrentQuality] = useState<string>('360p');

  useEffect(() => {
    if (!videoId) {
      navigate('/');
      return;
    }

    const loadVideo = async () => {
      try {
        const videoData = await contentService.getVideo(videoId);
        setVideo(videoData);

        // Start streaming session
        if (user) {
          const session = await streamingService.startSession({
            videoId,
            quality: currentQuality as any,
          });
          setSessionId(session.id);
        }
      } catch (error) {
        console.error('Failed to load video:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [videoId, navigate, user, currentQuality]);

  useEffect(() => {
    if (!sessionId) return;

    // Send heartbeat every 30 seconds
    const heartbeatInterval = setInterval(async () => {
      try {
        await streamingService.updateSession(sessionId, { quality: currentQuality });
      } catch (error) {
        console.error('Failed to update session:', error);
      }
    }, 30000);

    return () => {
      clearInterval(heartbeatInterval);
      // End session on unmount
      if (sessionId) {
        streamingService.endSession(sessionId).catch(console.error);
      }
    };
  }, [sessionId, currentQuality]);

  const handleQualityChange = async (quality: string) => {
    setCurrentQuality(quality);
    if (sessionId) {
      await streamingService.updateSession(sessionId, { quality });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading video...</div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Video not found</p>
      </div>
    );
  }

  if (video.status !== 'ready') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Video is not ready for streaming. Status: {video.status}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 hover:text-indigo-800 mb-4"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{video.title}</h1>
        {video.description && (
          <p className="text-gray-600 mt-2">{video.description}</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <HLSPlayer
          videoId={videoId!}
          onQualityChange={handleQualityChange}
          onError={(error) => {
            console.error('Player error:', error);
          }}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
        <div>
          <span className="font-semibold">Duration:</span> {Math.floor(video.duration / 60)}:
          {(video.duration % 60).toString().padStart(2, '0')}
        </div>
        <div>
          <span className="font-semibold">File Size:</span> {(video.fileSize / 1024 / 1024).toFixed(2)} MB
        </div>
        {video.resolution && (
          <div>
            <span className="font-semibold">Resolution:</span> {video.resolution}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchPage;
