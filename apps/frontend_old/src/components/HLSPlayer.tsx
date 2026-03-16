import React, { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';
import { streamingService } from '../services/streamingService';

interface HLSPlayerProps {
  videoId: string;
  onQualityChange?: (quality: string) => void;
  onError?: (error: Error) => void;
}

const HLSPlayer: React.FC<HLSPlayerProps> = ({ videoId, onQualityChange, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [currentQuality, setCurrentQuality] = useState<string>('360p');
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  const [bandwidth, setBandwidth] = useState<number>(1000);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const manifestUrl = streamingService.getMasterManifestUrl(videoId);

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90,
      });

      hlsRef.current = hls;

      hls.loadSource(manifestUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const levels = hls.levels;
        setAvailableQualities(levels.map((level) => `${level.height}p`));
        video.play();
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              onError?.(new Error('Fatal error occurred'));
              break;
          }
        }
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        const quality = `${hls.levels[data.level]?.height}p`;
        setCurrentQuality(quality);
        onQualityChange?.(quality);
      });

      // Monitor bandwidth
      const updateBandwidth = () => {
        if (hls.levels.length > 0) {
          const currentLevel = hls.levels[hls.currentLevel];
          if (currentLevel) {
            setBandwidth(currentLevel.bitrate / 1000); // Convert to kbps
          }
        }
      };

      const bandwidthInterval = setInterval(updateBandwidth, 5000);

      return () => {
        clearInterval(bandwidthInterval);
        if (hls) {
          hls.destroy();
        }
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = manifestUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
      return () => {
        // Cleanup for native HLS if needed
      };
    } else {
      onError?.(new Error('HLS is not supported in this browser'));
      return () => {
        // No cleanup needed
      };
    }
  }, [videoId, onQualityChange, onError]);

  const changeQuality = (quality: string) => {
    if (hlsRef.current) {
      const levelIndex = availableQualities.indexOf(quality);
      if (levelIndex !== -1) {
        hlsRef.current.currentLevel = levelIndex;
        setCurrentQuality(quality);
        onQualityChange?.(quality);
      }
    }
  };

  return (
    <div className="relative w-full">
      <video
        ref={videoRef}
        controls
        className="w-full h-auto rounded-lg"
        playsInline
      />
      <div className="mt-2 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Quality: {currentQuality} | Bandwidth: {bandwidth.toFixed(0)} kbps
        </div>
        {availableQualities.length > 1 && (
          <select
            value={currentQuality}
            onChange={(e) => changeQuality(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            {availableQualities.map((quality) => (
              <option key={quality} value={quality}>
                {quality}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default HLSPlayer;
