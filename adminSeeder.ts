import { envConfig } from "./src/config/config.js";
import User from "./src/database/models/userModel.js";

const adminSeeder = async () => {
  const [data] = await User.findAll({
    where: {
      email: envConfig.adminEmail,
    },
  });
  if (!data) {
    await User.create({
      username: envConfig.adminUsername,
      password: envConfig.adminPassword,
      email: envConfig.adminEmail,
      role: "admin",
    });
    console.log("Admin seeded");
  } else {
    console.log("Admin already seeded");
  }
};

export default adminSeeder;
