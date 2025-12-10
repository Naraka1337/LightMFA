#!/bin/bash
BASE_URL="https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"
DEST="static/face-api/models"

mkdir -p $DEST

# Tiny Face Detector
curl -L -o $DEST/tiny_face_detector_model-weights_manifest.json $BASE_URL/tiny_face_detector_model-weights_manifest.json
curl -L -o $DEST/tiny_face_detector_model-shard1 $BASE_URL/tiny_face_detector_model-shard1

# Face Landmark 68
curl -L -o $DEST/face_landmark_68_model-weights_manifest.json $BASE_URL/face_landmark_68_model-weights_manifest.json
curl -L -o $DEST/face_landmark_68_model-shard1 $BASE_URL/face_landmark_68_model-shard1

# Face Recognition
curl -L -o $DEST/face_recognition_model-weights_manifest.json $BASE_URL/face_recognition_model-weights_manifest.json
curl -L -o $DEST/face_recognition_model-shard1 $BASE_URL/face_recognition_model-shard1
curl -L -o $DEST/face_recognition_model-shard2 $BASE_URL/face_recognition_model-shard2

echo "Models downloaded."
