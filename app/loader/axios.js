const axios = require("axios");

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  const status = error.response ? Number(error.response.status) : 0;
  if (status >= 500) {
    error.canLogAxiosError = true;
  }

  return Promise.reject(error);
});
