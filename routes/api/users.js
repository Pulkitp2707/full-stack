const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const config = require('config')

// @route POST api/users
// @desc  Test route
// @access Public 
router.post('/' ,
[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min:6 })
],
async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { name,email,password } = req.body;
    try{
        console.log(req.body)
        let user = await User.findOne({ email }); 

        // See if user exists
        if(user){
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }

        //Get users gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        user = new User({
            name,
            email,
            avatar,
            password
        });
        //Encrypt password

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password , salt);
        await user.save();

        //Return json web tokens
        const payload = {
            user : {
                id: user.id   //we can use id instead of _id when we use mongoose
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            { expiresIn: 36000 },
            (err,token) => {
                console.log(token);
                if(err) throw err;
                res.send(token);
            }
        );

        res.send('User registered');
    }catch(err){
        console.log(error.message);
        res.status(500).send('Server error');
    }
})

module.exports = router;