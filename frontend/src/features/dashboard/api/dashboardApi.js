import api from '../../../api/axios';

export async function fetchDashboardStats() {
  const [pilotsRes, itemsRes, logsRes] = await Promise.all([
    api.get('/pilots'),
    api.get('/checklist-items'),
    api.get('/worklogs'),
  ]);
  return {
    pilots: pilotsRes.data,
    items: itemsRes.data,
    worklogs: logsRes.data,
  };
}
