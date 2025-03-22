import { register } from "../../controllers/auth-controller.js";
import { login } from "../../controllers/auth-controller.js";

export default async function handler(req, res) {
  // Handle POST request for register and login
  if (req.method === "POST") {
    const { type } = req.body;

    if (type === "register") {
      // Call the register function
      await register(req, res);
    } else if (type === "login") {
      // Call the login function
      await login(req, res);
    } else {
      res.status(400).json({ message: "Invalid request type" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
