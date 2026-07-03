import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        const jwtSecret = process.env.SECRET_KEY || process.env.JWT_SECRET;
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            })
        }
        if (!jwtSecret) {
            return res.status(500).json({
                message: "JWT secret is not configured",
                success: false,
            });
        }

        const decode = await jwt.verify(token, jwtSecret);
        if(!decode){
            return res.status(401).json({
                message:"Invalid token",
                success:false
            })
        };
        req.id = decode.userId;
        next();
    } catch (error) {
        console.log(error);
    }
}
export default isAuthenticated;