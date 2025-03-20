const io = require('socket.io-client');
const socket = io('http://localhost:3000');

function generateDummyData() {
    return {
        position: {
            lat: 37.7749 + (Math.random() - 0.5) * 0.01,
            lng: -122.4194 + (Math.random() - 0.5) * 0.01
        },
        speed: Math.floor(Math.random() * 20),
        battery: Math.floor(Math.random() * 100)
    };
}

setInterval(() => {
    const data = generateDummyData();
    socket.emit('droneData', data);
    console.log("Sent drone data:", data);
}, 2000);
