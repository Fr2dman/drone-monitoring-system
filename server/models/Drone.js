import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Drone = sequelize.define("Drone", {
  id: { type: DataTypes.STRING, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "idle" },
  lat: { type: DataTypes.FLOAT },
  lng: { type: DataTypes.FLOAT },
  battery: { type: DataTypes.FLOAT },
});

export default Drone;
