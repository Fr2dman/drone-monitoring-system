const MissionRecord = sequelize.define("MissionRecord", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  droneId: { type: DataTypes.STRING },
  missionType: { type: DataTypes.STRING },
  targetLat: { type: DataTypes.FLOAT },
  targetLng: { type: DataTypes.FLOAT },
  status: { type: DataTypes.STRING, defaultValue: "pending" },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

export default MissionRecord;
