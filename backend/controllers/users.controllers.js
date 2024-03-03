const { runQuery } = require('../src/db');
const config = require('../src/config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const getUsers = async (req, res) => {
    try {
        const { email } = req.user;
        const sql = "SELECT * FROM usuarios WHERE email = $1 LIMIT 1"
        const { rows: [user], rowCount } = await runQuery(sql, [email]);
        if (!rowCount) throw {
            code: 404,
            message: "No se encontró usuario con estas credenciales"
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(error.code || 500).send(error)
    }
}

const createUser = async (req, res) => {
    try {
        let { email, password, rol, lenguage } = req.body;
        const sql = "INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4)";
        const salt = await bcrypt.genSalt(10);
        const passwordEncripted = await bcrypt.hash(password, salt);
        password = passwordEncripted;
        await runQuery(sql, [email, passwordEncripted, rol, lenguage]);
        res.status(200).json("inserted")
    } catch (error) {
        res.status(500).json(error.message || error);
    }
}

const validateUser = async (req, res) => {
    try {
        const sql = "SELECT * FROM usuarios WHERE email = $1";
        const { email, password } = req.body;
        const { rows: [user], rowCount } = await runQuery(sql, [email]);
        const { password: passwordEncripted } = user;
        const passwordIsRigh = await bcrypt.compare(password, passwordEncripted);
        if (!passwordIsRigh || !rowCount) throw "User or password incorrect"
        const token = jwt.sign({ email }, "az_AZ")
        res.status(200).json(token);
    } catch (error) {
        console.log(error.message);
        res.status(error.code || 500).json(error);
    }
}

exports.methods = {
    createUser,
    validateUser,
    getUsers
}