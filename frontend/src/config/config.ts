const config = {
    firebase: {
        apiKey: 'AIzaSyCN0HVzj1sjMzfFMG1DyYobvv5yjz7XsyM',
        authDomain: 'bulletjournalproject.firebaseapp.com',
        projectId: 'bulletjournalproject',
        storageBucket: 'bulletjournalproject.appspot.com',
        messagingSenderId: '1000487121408',
        appId: '1:1000487121408:web:990618e001793cc959dee5',
        measurementId: 'G-SGNH6PWV8L'
    },
    server: {
        url: process.env.REACT_APP_API_URL ?? 'http://localhost:8001'
    }
};

export default config;
