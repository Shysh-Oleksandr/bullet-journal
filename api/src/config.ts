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
});
