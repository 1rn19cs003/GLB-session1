const checkAcess = (req, res, next) => {
    // console.log({req});
    const token = req.headers['authorization'];
    // const loggedInUser=decodeToken(token);
    console.log("Token received:", token);
    // if(!loggedInUser || loggedInUser.role !== 'admin') {
        // return res.status(403).json({ message: 'Access denied. Admins only.' });
    // }
    console.log("checkAcess middleware called");
    next();
}

module.exports = { checkAcess };