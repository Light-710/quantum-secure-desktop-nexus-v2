
import api from './api';

export interface ReportResponse {
  message: string;
}

export const reportService = {
  generateReport: async (projectId: string): Promise<ReportResponse> => {
    const formData = new FormData();
    formData.append('project_id', projectId);
    
    const response = await api.post('/report/generate-report', formData);
    return response.data;
  },
  
  downloadReport: async (projectId: string): Promise<Blob> => {
    const response = await api.get('/report/download-report', {
      params: { project_id: projectId },
      responseType: 'blob'
    });
    
    return response.data;
  }
};
