const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')
const Post = require('../../models/Post')
const User = require('../../models/User')
const Profile = require('../../models/Profile')



//@route  POST api/Posts/create-update
//@desc   Create a post
//@access private
router.post('/create', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try {
        const user = await User.findById(req.user.id).select('-password')

        const newPost = new Post({
            text:req.body.text,
            name:user.name,
            avatar: user.avatar,
            user: req.user.id
        })  

        const post = await newPost.save()
        return res.json(post)
    } catch (err) {
        console.error(err.message)
        return res.status(500).send('Server Error')
    }

   
});



//@route  GET api/Posts/all
//@desc  Get All posts
//@access private

router.get('/all', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({date:-1})
        return res.json(posts)
    } catch (err) {
        console.error(err.message)
        return res.status(500).send('Server Error')
    }
})


//@route  GET api/Posts/:post_id'
//@desc  Get All posts
//@access private

router.get('/:post_id', auth, async (req, res) => {
    try {
        const posts = await Post.findById(req.params.post_id)
        if(!posts) return res.status(404).json({msg: "post not found"})
        return res.json(posts)
    } catch (err) {
        console.error(err.message)
        if(err.kind === 'ObjectId') return res.status(404).json({msg: "post not found!"})
        return res.status(500).send('Server Error')
    }
})


//@route  Delete api/Posts/delete
//@desc  Delete a post
//@access private

router.delete('/delete/:post_id', auth, async (req, res) => {
    try {
        const posts = await Post.findById(req.params.post_id)

        if(!posts) return res.status(404).json({msg: "post not found"})
        //check the owner

        if(posts.user.toString() !== req.user.id){
            return res.status(401).json({msg:'User Not authorized'})
        }
        await posts.remove()
        return res.json({msg: 'Post Removed'})
    } catch (err) {
        console.error(err.message)
        if(err.kind === 'ObjectId') return res.status(404).json({msg: "post not found!"})
        return res.status(500).send('Server Error')
    }
})


//@route  PUT api/Posts/like/:post_id
//@desc  like a post
//@access private

router.put('/like/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id)

        //if post already liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({msg: "post already liked"})
        } 
        post.likes.unshift({user: req.user.id})

        await post.save();
        res.json(post.likes)
    } catch (err) {
        console.error(err.message)
        return res.status(500).send('Server Error')
    }
})


//@route  PUT api/Posts/unlike/:post_id
//@desc  unlike a post
//@access private

router.put('/unlike/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id)

        //if post already liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
            return res.status(400).json({msg: "post not liked yet"})
        } 

        const removeIndex = post.likes.map(like=>like.user.toString()).indexOf(req.user.id)
        post.likes.splice(removeIndex, 1)
        await post.save();
        res.json(post.likes)
    } catch (err) {
        console.error(err.message)
        return res.status(500).send('Server Error')
    }
})


//@route  POST api/Posts/comment/:post_id
//@desc   Create a post comment
//@access private
router.post('/comment/:post_id', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try {
        const user = await User.findById(req.user.id).select('-password')
        const post = await Post.findById(req.params.post_id);


        const newComment = {
            text:req.body.text,
            name:user.name,
            avatar: user.avatar,
            user: req.user.id
        }

        post.comments.unshift(newComment)
        await post.save(post.comment)
        return res.json(post)
    } catch (err) {
        console.error(err.message)
        return res.status(500).send('Server Error')
    }
  
});


//@route  Delete api/Posts/comment/:post_id/:comment_id
//@desc   DELETE a post comment
//@access private

router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        //pull out comment

        const comment = post.comments.find(comment => comment.id === req.params.comment_id)
        if(!comment){
            return res.status(404).json({msg: "comment not exists"})
        }
        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({msg: "User Not Autherized"})
        }

        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id)
        post.comments.splice(removeIndex,1)
        await post.save()
        res.json(post.comments  )
    } catch (err) {
        console.error(err.message)
        return res.status(500).send('Server Error')
    }
})


module.exports = router