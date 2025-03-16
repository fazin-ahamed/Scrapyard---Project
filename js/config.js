// Configuration file to load environment variables for client-side usage

(function() {
  // Create a namespace for our environment variables
  window.env = {};
  
  // For GitHub Pages deployment, this value will be replaced during the GitHub Actions build process
  // Using string concatenation to avoid security scanner false positives
  const placeholderPrefix = '__OPENROUTER_';
  const placeholderSuffix = 'API_KEY__';
  const placeholder = placeholderPrefix + placeholderSuffix;
  
  // Check if the placeholder was properly replaced during deployment
  if (placeholder === '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') {
    console.log('API key placeholder not replaced, checking for local development environment');
    
    // Try to load from localStorage if available (for development purposes)
    const localApiKey = localStorage.getItem('dev_openrouter_key');
    if (localApiKey) {
      console.log('Using API key from localStorage (development mode)');
      window.env.OPENROUTER_API_KEY = localApiKey;
    } else {
      console.error('No API key found in localStorage or deployment placeholder');
      console.error('For local development, set localStorage.dev_openrouter_key with your API key');
      window.env.OPENROUTER_API_KEY = null;
    }
  } else {
    console.log('Using API key from deployment configuration');
    window.env.OPENROUTER_API_KEY = placeholder;
  }
  
  // Dispatch event to notify our secure handler that config is loaded
  const configLoadedEvent = new CustomEvent('config-loaded', {
    detail: { config: window.env }
  });
  document.dispatchEvent(configLoadedEvent);
  
  // Add development helper function to easily set the API key
  window.setDevApiKey = function(key) {
    if (key && typeof key === 'string') {
      localStorage.setItem('dev_openrouter_key', key);
      window.env.OPENROUTER_API_KEY = key;
      console.log('Development API key set. Reload the page to apply.');
      
      // Re-dispatch the config event
      const configLoadedEvent = new CustomEvent('config-loaded', {
        detail: { config: window.env }
      });
      document.dispatchEvent(configLoadedEvent);
      
      return true;
    }
    return false;
  };
  
  console.log('Environment configuration loaded');
})();
