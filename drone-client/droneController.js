import axios from 'axios';

async function setTarget(lat, lng) {
    try {
        const response = await axios.post('http://localhost:3000/api/drone/target', { lat, lng });
        console.log(response.data);
    } catch (error) {
        console.error("Error setting target:", error);
    }
}

export default { setTarget };
