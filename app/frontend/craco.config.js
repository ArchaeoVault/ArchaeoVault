module.exports = {
  devServer: {
    allowedHosts: 'all',  // This allows all hosts
    port: 3000, // Ensure it's using the expected port
    proxy: {
      '/api': 'http://localhost:8000',  // Ensure this is pointing to the right backend
    }
  },
};
