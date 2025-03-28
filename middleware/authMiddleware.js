import jwt from "jsonwebtoken"

export const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token required" })
    }

    const token = authHeader.split(" ")[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Add user info to request
    req.user = decoded

    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" })
  }
}

