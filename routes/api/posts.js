const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const Profile = require('../../models/Profile')
const Post = require('../../models/Post')


// @route POST api/posts
// @desc  Create a post
// @access Public 
router.post('/' , [auth , [
    check('text' , 'Text is required').not().isEmpty()
]], 
async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).send({ errors: errors.array() })
    }

    try {

        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text : req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });
        const post = await newPost.save()
        res.send(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }

})


// @route GET api/posts
// @desc  Get all posts
// @access Private
router.get('/' , auth, async (req,res) => {
    try {
        const posts = await Post.find().sort({date:-1});
        res.send(posts)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})


// @route GET api/posts/:id
// @desc  Get post by id
// @access Private
router.get('/:id' , auth, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(500).send({ msg:'Post not found' })
        }
        res.send(post)
    } catch (error) {
        console.error(error.message);
        if(error.kind  == 'ObjectId'){               //post id is not written well
            return res.status(500).send({ msg:'Post not found' })
        }
        res.status(500).send('Server Error');
    }
})



// @route PUT api/posts/like/:id
// @desc  Like post
// @access Private
router.put('/like/:id' , auth, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(500).send({ msg:'Post not found' })
        }
        if((post.likes.filter((like) => {return like.user.toString() === req.user.id})).length > 0){
            return res.status(400).send({ msg: 'Post already been liked' })
        }
        post.likes.unshift({ user: req.user.id })
        await post.save();
        res.send(post.likes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
        }
    }
)




// @route PUT api/posts/unlike/:id
// @desc  Unlike post
// @access Private
router.put('/unlike/:id' , auth, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(500).send({ msg:'Post not found' })
        }
        if((post.likes.filter((like) => {return like.user.toString() === req.user.id})).length === 0){
            return res.status(400).send({ msg: 'Post has not been liked' })
        }
        const updatedPost = post.likes.filter((like) => {
            return like.user.toString() !== req.user.id 
        })
        post.likes = updatedPost
        await post.save()
        res.send(post.likes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
        }
    }
)






// @route DELETE api/posts/:id
// @desc  Delete post by id
// @access Private
router.delete('/:id' , auth, async (req,res) => {
    try {
        const post = await Post.findOne(req.params.id)
        if(!post){
            return res.status(401).send({ msg:'Post not found' })
        }
        if(post.user.toString() !== req.user.id ){
            return res.status(401).send({  msg:'User not authenticated' })
        }
        
    } catch (error) {
        console.error(error.message);
        if(error.kind  == 'ObjectId'){
            return res.status(500).send({ msg:'Post not found' })
        }
        res.status(500).send('Server Error');
    }
})




module.exports = router;