const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const config = require('config')


// @route GET api/auth
// @desc  Test route
// @access Public 
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
})


// @route POST api/auth
// @desc  Authenticate user and get token
// @access Public 
router.post('/',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });

            // See if user exists
            if (!user) {
                return res
                    .status(400)
                    .send({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            const isMatch = bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res
                    .status(500)
                    .send({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            //Return json web tokens
            const payload = {
                user: {
                    id: user.id   //we can use id instead of _id when we use mongoose
                }
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 36000 },
                (err, token) => {
                    console.log(token);
                    if (err) throw err;
                    res.send({ token });
                }
            );
        } catch (err) {
            console.log(error.message);
            res.status(500).send('Server error');
        }
    })


module.exports = router;