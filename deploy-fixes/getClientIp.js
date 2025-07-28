// Helper function to get the real client IP address
function getClientIp(req) {
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
  if (ip) {
    return ip;
  }
  
  // Fallback to connection addresses
  return connectionRemoteAddress || socketRemoteAddress || 'Unknown';
}

module.exports = getClientIp;