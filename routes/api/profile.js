const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const {check , validationResult} = require('express-validator')
const request = require('request')
const config = require('config')


// @route GET api/profile/me
// @desc  Test route
// @access Private
router.get('/me' , auth, async (req,res) => {
    try{
        const profile = await Profile.findOne({ user: req.user.id }).populate('user' , ['name', 'avatar']);     //user is the name of the field and in the profile model it has been referenced to the user model
        if(!profile){
            return res.status(400).json({ msg: 'There is no profile' });
        }
        console.log(profile)
        res.send(profile)
    }catch(err){
        return res.status(400).send('Server error')
    }
})



// @route POST api/profile
// @desc  Test route
// @access Private
router.post('/' , [ auth , [
    check('status' , 'Status is required').not().isEmpty(),
    check('skills' , 'Skills is required').not().isEmpty()
], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(500).send({ errors: errors.array() });
    }
    const{
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    //Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location; 
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    //Build social profile
    profileFields.social = {}
    if(youtube) profileFields.social.youtube = youtube;
    if(youtube) profileFields.social.twitter = twitter;
    if(youtube) profileFields.social.facebook = facebook;
    if(youtube) profileFields.social.linkedin = linkedin;
    if(youtube) profileFields.social.instagram = instagram;


    try{
        let profile = await Profile.findOne({ user: req.user.id })
        if(profile){
            //Update
            profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
            return res.send(profile)
        }
        //Create profile
        profile = new Profile(profileFields);
        await profile.save();
        res.send(profile)
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
} ])


// @route GET api/profile
// @desc  GET all profiles
// @access Public
router.get('/',async (req,res) => {
    try{
        const profiles = await Profile.find().populate('user' , ['name' , 'avatar']);   
        res.send(profiles)
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server Error');
    }
})


// @route GET api/profile/user/:user_id
// @desc  GET user by id
// @access Public
router.get('/user/:user_id',async (req,res) => {
    try{
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user' , ['name' , 'avatar']);   
        if(!profile){
            return res.status(400).send({ msg:'There is no user with this profile' })
        }
        res.send(profile)
    }catch(err){
        console.error(err.message)
        if(err.kind == 'ObjectId'){
            return res.status(400).send({ msg:'There is no user with this profile' })
        }
        res.status(500).send('Server Error');
    }
})


// @route PUT api/profile/experience
// @desc  ADD experience
// @access Private
router.put('/experience' , [ auth , [
    check('title' , 'Title is required').not().isEmpty(),
    check('company','Company is required').not().isEmpty(),
    check('from', 'from date is required').not().isEmpty()
] ],
async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).send({ Errors: errors.array() })
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }  = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({ user:req.user.id })
        profile.experience.unshift(newExp)
        await profile.save();
        res.send(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }

})




// @route DELETE api/profile/experience/:exp_id
// @desc  DELETE experience
// @access Private
router.delete('/experience/:exp_id', auth , async (req,res) => {
    try {
        const profile = await Profile.findOne({ user:req.user.id });
        const experience_id = req.params.exp_id
        const experience = profile.experience.filter((exper) => {
            return exper.id !== experience_id 
        })
        profile.experience = experience
        await profile.save()
        res.send(profile)
    } catch (error) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})







// @route PUT api/profile/education
// @desc  ADD education
// @access Private
router.put('/education' , [ auth , [
    check('school' , 'School is required').not().isEmpty(),
    check('degree','Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty()
] ],
async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).send({ Errors: errors.array() })
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }  = req.body;

    const newEducation = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({ user:req.user.id })
        profile.education.unshift(newEducation)
        await profile.save();
        res.send(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }

})




// @route DELETE api/profile/education/:edu_id
// @desc  DELETE education
// @access Private
router.delete('/education/:edu_id', auth , async (req,res) => {
    try {
        const profile = await Profile.findOne({ user:req.user.id });
        const education_id = req.params.edu_id
        const education = profile.education.filter((edu) => {
            return edu.id !== education_id 
        })
        profile.education = education
        await profile.save()
        res.send(profile)
    } catch (error) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})


// @route GET api/profile/github/:username
// @desc  get user repos from Github
// @access Public
router.get('/github/:username' , (req,res) => {
    try {
        const options = {
            uri: 'https://api.github.com/users/'+req.params.username+'/repos?per_page=5&sort=created:asc&client_id='+config.get('githubClientId')+'&client_secret='+config.get('githubSecret'),
            method: 'GET',
            headers: { 'user-agent' : 'node-js'}
        }

        request(options , (error,response,body) => {
            if(error) console.error(error)
            if(response.statusCode !== 200){
                return res.status(404).send({ msg: 'No github account found' })
            }
            res.json(JSON.parse(body))
        })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})






// @route DELETE api/profile
// @desc  delete user by id
// @access Private
router.delete('/', auth, async (req,res) => {
    try{
        await Profile.findOneAndRemove({ user: req.user.id })
        await User.findOneAndRemove({ id: req.user.id })
    }
    catch(err){
        console.error(err.message)
        res.status(500).send('Server Error');    
    }

})


module.exports = router;