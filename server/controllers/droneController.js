const getDroneStatus = (req, res) => {
    res.json({ position: { lat: 37.7749, lng: -122.4194 }, speed: 10, battery: 80 });
};

const setTargetPoint = (req, res) => {
    const { lat, lng } = req.body;
    console.log(`Target set to: ${lat}, ${lng}`);
    res.status(200).json({ message: 'Target set successfully' });
};

export default { getDroneStatus, setTargetPoint };