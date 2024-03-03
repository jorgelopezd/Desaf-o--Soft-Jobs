'use strict'
const jwt = require('jsonwebtoken');
const config = require('../src/config');

exports.ensureAuth = async (req, res, next) => {
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1]
    if (!token) {
        throw res.status(401).json({
            auth: false,
            message: 'No token provided'
        })
    }
    jwt.verify(token, "az_AZ");
    try {
        const payload = jwt.decode(token, "az_AZ");
        req.user = payload;
        next();
    } catch (error) {
        return res.status(404).json({
            message: 'Token is not valid'
        });
    }
}