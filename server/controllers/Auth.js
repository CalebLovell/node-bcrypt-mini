const bcrypt = require('bcryptjs');

module.exports = {
    register: async (req, res) => {
        // user input their info: name, email, password
        // check if email ya está in db. If yes => send status(409)
        // create a salt
        // create a hash from the password and salt
        // store name, email, hash into db

        const db = req.app.get('db');
        const { name, email, password } = req.body;

        let userResponse = await db.getUserByEmail(email);
        let user = userResponse[0];

        if (user) {
            return res.status(409).send(`email ya usado`);
        };

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        let createUserResponse = await db.createUser({ name, email, password: hash });
        let newUser = createUserResponse[0];

        req.session.user = newUser;
        res.send(req.session.user);
    },
    login: async (req, res) => {
        // user input: email, password
        // get user by email from database
        // if no user, send(401) status (wrong email dummy)
        // compare the password and hash using bcrypt
        // if they don't match, send 403 status
        // if they do match => add user to session
        
        const db = req.app.get('db');
        const { email, password } = req.body;

        let userResponse = await db.getUserByEmail(email);
        let user = userResponse[0];

        if (!user) {
            return res.status(401).send('ur email don work')
        }

        const isAuthenticated = bcrypt.compareSync(password, user.password);

        if(!isAuthenticated) {
            return res.status(403).send('incorrect password')
        }

        delete user.password;
        req.session.user = user;
        res.send(req.session.user);
    },
    logout: (req, res) => {
        req.session.destroy();
        res.sendStatus(200);  
    },
};