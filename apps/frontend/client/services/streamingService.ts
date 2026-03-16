import api from './api';

export interface StreamingSession {
  id: string;
  userId: string;
  videoId: string;
  quality: string;
  startedAt: string;
  endedAt?: string;
}

export interface StartSessionData {
  videoId: string;
  quality: '240p' | '360p' | '480p' | '720p';
}

export const streamingService = {
  getMasterManifestUrl(videoId: string): string {
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
    return `${baseUrl}/streaming/${videoId}/manifest.m3u8`;
  },

  async startSession(data: StartSessionData): Promise<StreamingSession> {
    const response = await api.post<StreamingSession>('/streaming/session/start', data);
    return response.data;
  },

  async updateSession(sessionId: string, data: { quality?: string; bandwidth?: number }): Promise<void> {
    await api.post('/streaming/session/heartbeat', { sessionId, ...data });
  },

  async endSession(sessionId: string): Promise<void> {
    await api.post('/streaming/session/end', { sessionId });
  },

  async getRecommendedQuality(bandwidth: number): Promise<{ quality: string }> {
    const response = await api.get<{ quality: string }>('/streaming/quality/recommend', {
      params: { bandwidth },
    });
    return response.data;
  },
};
