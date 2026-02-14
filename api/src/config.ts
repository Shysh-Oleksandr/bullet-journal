export default () => ({
  port: parseInt(process.env.PORT || '8001', 10),
  jwtSecret: process.env.JWT_SECRET,
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  },
  mongo: {
    url: process.env.MONGO_URL,
  },
  security: {
    charCodeShiftNumber: process.env.CHAR_CODE_SHIFT_NUMBER,
  },
  s3: {
    bucket: process.env.BUCKET || 'bullet-journal',
    region: process.env.AWS_REGION || 'eu-north-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    /** Base URL for public image URLs (e.g. https://bucket.s3.region.amazonaws.com or CloudFront). */
    imageBaseUrl: process.env.S3_IMAGE_BASE_URL,
  },
});
