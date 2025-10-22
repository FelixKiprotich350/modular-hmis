export const requestLogger = (req: any, res: any, next: any) => {
  const requestsLogEnabled = process.env.CUSTOM_REQUESTS_LOG === 'true';
  
  if (requestsLogEnabled) {
    res.on('finish', () => {
      const getStatusColor = (code: number) => {
        if (code >= 200 && code < 300) return '\x1b[32m'; // Green
        if (code >= 300 && code < 400) return '\x1b[33m'; // Yellow
        if (code >= 400 && code < 500) return '\x1b[31m'; // Red
        if (code >= 500) return '\x1b[35m'; // Magenta
        return '\x1b[0m'; // Reset
      };
      const color = getStatusColor(res.statusCode);
      console.log(`${new Date().toISOString()} ${req.method} ${req.url} ${color}${res.statusCode}\x1b[0m`);
    });
  }
  
  next();
};