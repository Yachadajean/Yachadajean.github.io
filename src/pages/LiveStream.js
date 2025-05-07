// Fetch fall detection status
useEffect(() => {
  const checkFallStatus = async () => {
    try {
      const res = await fetch('https://api.falldetection.me/status');  // Change to HTTPS
      if (!res.ok) throw new Error(`Status check failed: ${res.status}`);
      const data = await res.json();
      console.log('Status:', data);
      setFallDetected(data.status === "Camera online");
    } catch (err) {
      console.error('Error fetching fall status:', err);
    }
  };

  checkFallStatus(); // Initial check
  const intervalId = setInterval(checkFallStatus, 3000); // Repeat every 3s

  return () => clearInterval(intervalId);
}, []);

// Setup video stream
useEffect(() => {
  if (!paramIpAddress) {
    setError('No IP address or domain provided');
    return;
  }

  try {
    const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(paramIpAddress);
    const streamUrl = isIp
      ? `https://${paramIpAddress}/stream.m3u8`  // Use HTTPS
      : `https://${paramIpAddress}/stream.m3u8`;

    console.log('Attempting to play:', streamUrl);

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;

      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => setError(null));

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError('Network error - trying to recover');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError('Media error - trying to recover');
              hls.recoverMediaError();
              break;
            default:
              setError('Unrecoverable error');
              hls.destroy();
              break;
          }
        }
      });
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = streamUrl;
      videoRef.current.addEventListener('loadedmetadata', () => setError(null));
    }

    setVideoUrl(streamUrl);
  } catch (err) {
    console.error('Stream setup error:', err);
    setError('Failed to setup video stream');
  }
}, [paramIpAddress]);
