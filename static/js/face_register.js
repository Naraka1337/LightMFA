const video = document.getElementById('video');
const captureBtn = document.getElementById('captureBtn');
const enableFaceBtn = document.getElementById('enableFaceBtn');
const faceContainer = document.getElementById('face-container');
const statusSpan = document.getElementById('status');
const faceEmbeddingInput = document.getElementById('face_embedding');

let modelsLoaded = false;

enableFaceBtn.addEventListener('click', async () => {
    faceContainer.style.display = 'block';
    enableFaceBtn.style.display = 'none';
    statusSpan.innerText = 'Loading models...';

    await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/static/face-api/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/static/face-api/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/static/face-api/models')
    ]);

    modelsLoaded = true;
    statusSpan.innerText = 'Models loaded. Starting video...';
    startVideo();
});

function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => console.error(err));
}

captureBtn.addEventListener('click', async () => {
    if (!modelsLoaded) return;

    statusSpan.innerText = 'Detecting face...';

    const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

    if (detections) {
        const descriptor = Array.from(detections.descriptor);
        faceEmbeddingInput.value = JSON.stringify(descriptor);
        statusSpan.innerText = 'Face captured! You can now register.';
        statusSpan.style.color = 'green';
        // Stop video
        video.srcObject.getTracks().forEach(track => track.stop());
    } else {
        statusSpan.innerText = 'No face detected. Try again.';
        statusSpan.style.color = 'red';
    }
});
