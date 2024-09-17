const base_url = process.env.BASE_URL_API || 'http://localhost:8000/api';

export const fetchEventData = async () => {
  const res = await fetch(`${base_url}/users/dashboard`);
  const data = await res.json();

  return {
    monthly: {
      labels: data.monthly.labels,
      data: data.monthly.data,
    },
    daily: {
      labels: data.daily.labels,
      data: data.daily.data,
    },
  };
};
