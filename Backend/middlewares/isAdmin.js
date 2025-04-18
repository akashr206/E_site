const isAdmin = async (req, res, next) => {
    try {
        if (req.user && req.user.isAdmin) {
            return next();
        } else {
            return res
                .status(403)
                .json({ message: "Access denied: Admins only" });
        }
    } catch (error) {
        console.error(error);
        res.status(400).send("Unauthenticated");
    }
};
