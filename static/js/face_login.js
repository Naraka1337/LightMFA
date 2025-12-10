const video = document.getElementById('video');
const statusSpan = document.getElementById('status');

async function start() {
    statusSpan.innerText = 'Loading models...';
    await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/static/face-api/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/static/face-api/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/static/face-api/models')
    ]);

    statusSpan.innerText = 'Models loaded. Starting video...';

    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
            video.srcObject = stream;
            // Wait for video to play
            video.addEventListener('play', () => {
                const canvas = faceapi.createCanvasFromMedia(video);
                // document.body.append(canvas); // Optional: show canvas
                const displaySize = { width: video.width, height: video.height };
                faceapi.matchDimensions(canvas, displaySize);

                // Try to detect face every 1 second
                const interval = setInterval(async () => {
                    const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
                        .withFaceLandmarks()
                        .withFaceDescriptor();

                    if (detections) {
                        statusSpan.innerText = 'Face detected. Verifying...';
                        const descriptor = Array.from(detections.descriptor);

                        // Send to backend
                        fetch('/mfa/face', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ descriptor: descriptor })
                        })
                            .then(res => res.json())
                            .then(data => {
                                if (data.success) {
                                    statusSpan.innerText = 'Verified! Redirecting...';
                                    statusSpan.style.color = 'green';
                                    clearInterval(interval);
                                    window.location.href = data.redirect;
                                } else {
                                    statusSpan.innerText = 'Face not recognized. Retrying...';
                                }
                            });
                    }
                }, 1000);
            });
        })
        .catch(err => {
            console.error(err);
            statusSpan.innerText = 'Camera error: ' + err;
        });
}

start();
