// Helper function to get the real client IP address
async function getClientIp(req) {
  // Get IP from various headers (in order of preference)
  const forwarded = req.headers['x-forwarded-for'];
  const realIp = req.headers['x-real-ip'];
  const ip = req.ip;
  const connectionRemoteAddress = req.connection?.remoteAddress;
  const socketRemoteAddress = req.socket?.remoteAddress;
  
  // Parse x-forwarded-for (can contain multiple IPs)
  if (forwarded) {
    const ips = forwarded.split(',').map(ip => ip.trim());
    // Return the first (original client) IP
    return ips[0];
  }
  
  // Use x-real-ip if available
  if (realIp) {
    return realIp;
  }
  
  // Use req.ip (Express's best guess with trust proxy enabled)
  if (ip && ip !== '::1' && ip !== '127.0.0.1' && !ip.startsWith('192.168.')) {
    return ip;
  }
  
  // For local development or internal IPs, get real public IP
  const detectedIp = connectionRemoteAddress || socketRemoteAddress || ip;
  
  // If it's a local/internal IP, try to get real public IP
  if (detectedIp === '::1' || detectedIp === '127.0.0.1' || 
      detectedIp?.startsWith('192.168.') || detectedIp?.startsWith('10.') || 
      detectedIp?.startsWith('172.')) {
    
    try {
      // Try to get real public IP from external service using built-in fetch
      const response = await fetch('https://api.ipify.org?format=text', { 
        signal: AbortSignal.timeout(3000) 
      });
      const publicIp = await response.text();
      
      // Return combined info: public IP + local IP
      return `${publicIp.trim()} (via ${detectedIp})`;
    } catch (error) {
      // If external service fails, just return the detected IP
      return detectedIp || 'Unknown';
    }
  }
  
  // Return the detected IP if it's already public
  return detectedIp || 'Unknown';
}

module.exports = getClientIp;