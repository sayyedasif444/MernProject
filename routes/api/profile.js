const express = require('express')
const router = express.Router()
const axios = require('axios');
const request = require('request')
const config = require('config')
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')

const { check, validationResult } = require('express-validator')


//@route  GET api/Profile/me
//@desc   Get Current User profile
//@access Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar'])
        if(!profile){
            return res.status(400).json({msg:'There is no profile for this user'})
        }
        res.json(profile);
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server Error')
    }
});


//@route  POST api/Profile/create
//@desc   Create or update  user
//@access Private

router.post('/create', [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
]],
async (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()})
    }
   
    const {company,website,location,bio,status,githubusername,skills,youtube,facebook,twitter,instagram,linkedin} = req.body;
    const profileFields = {}
    profileFields.user = req.user.id
    if(company) profileFields.company = company
    if(website) profileFields.website = website
    if(location) profileFields.location = location
    if(bio) profileFields.bio = bio
    if(status) profileFields.status = status
    if(githubusername) profileFields.githubusername = githubusername
    if(skills) profileFields.skills = skills.split(',').map(skill => skill.trim())
    profileFields.social = {}
    if(youtube) profileFields.social.youtube = youtube
    if(facebook) profileFields.social.facebook = facebook
    if(twitter) profileFields.social.twitter = twitter
    if(instagram) profileFields.social.instagram = instagram
    if(linkedin) profileFields.social.linkedin = linkedin
    try {
        let profile = await Profile.findOne({user: req.user.id})
        if(profile){
            profile = await Profile.findOneAndUpdate({user:req.user.id}, {$set:profileFields}, {new:true})
            return res.json(profile)
        }
        profile = new Profile(profileFields)
        await profile.save()
        return res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("server error")
    }

})


//@route  GET api/Profile/all
//@desc   Get All Prfile
//@access Public


router.get('/all', async (req, res)=>{
    try {
        const profile = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

//@route  GET api/Profile/user/:user_id
//@desc   Get  Profile by id
//@access Public


router.get('/user/:user_id', async (req, res)=>{
    try {
        const profile = await Profile.findOne({user:req.params.user_id}).populate('user', ['name', 'avatar'])
        if(!profile) return res.status(400).json({msg: "No profile Found"})
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        if(err.kind == 'ObjectId')  return res.status(400).json({msg: "No profile Found"})
        res.status(500).send('Server Error')
    }
})


//@route  Delete api/Profile/
//@desc   Delete profile, user and post
//@access private


router.delete('/', auth, async (req, res)=>{
    try {
        //remove user post
        await Post.deleteMany({user: req.user.id})

        //remove profile
       let abc = await Profile.findOneAndRemove({user:req.user.id})
        //remove user
        await User.findOneAndRemove({_id:req.user.id})
        res.status(200).json({msg: 'Profile Deleted'})
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

//@route  Put api/Profile/experience
//@desc   Add profile experience
//@access private

router.put('/experience', [auth, 
[
    check('title', "Title is required").not().isEmpty(),
    check('company', "Company is required").not().isEmpty(),
    check('from', "From Date is required").not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const {title, company, location, from, to, current, description} = req.body;

    const newExp = {
        title, company, location, from, to, current, description
    }
    try {
        const profile = await Profile.findOne({user: req.user.id})
        profile.experience.unshift(newExp)
        await profile.save()
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})


//@route  Delete api/Profile/experience/:exp_id
//@desc   Delete profile experience
//@access private

router.delete('/experience/:exp_id', auth, async(req,res)=>{
    try {
        const profile = await Profile.findOne({user: req.user.id})
        const removeIndex = profile.experience.map(item=> item.id).indexOf(req.params.exp_id)
        profile.experience.splice(removeIndex, 1);
        await profile.save()
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error') 
    }
})
//@route  Put api/Profile/education
//@desc   Add profile education
//@access private

router.put('/education', [auth, 
[
    check('school', "School is required").not().isEmpty(),
    check('degree', "Degree is required").not().isEmpty(),
    check('fieldofstudy', "Field of Study is required").not().isEmpty(),
    check('from', "From Date is required").not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const {school, degree, fieldofstudy, from, to, current, description} = req.body;

    const newEdu = {
        school, degree, fieldofstudy, from, to, current, description
    }
    try {
        const profile = await Profile.findOne({user: req.user.id})
        profile.education.unshift(newEdu)
        await profile.save()
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})


//@route  Delete api/Profile/education/:edu_id
//@desc   Delete profile education
//@access private

router.delete('/education/:edu_id', auth, async(req,res)=>{
    try {
        const profile = await Profile.findOne({user: req.user.id})
        const removeIndex = profile.education.map(item=> item.id).indexOf(req.params.edu_id)
        profile.education.splice(removeIndex, 1);
        await profile.save()
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error') 
    }
})



// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get('/github/:username', async (req, res) => {
    try {
      const uri = encodeURI(
        `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
      );
      const headers = {
        'user-agent': 'node.js',
      };
  
      const gitHubResponse = await axios.get(uri, { headers });
      return res.json(gitHubResponse.data);
    } catch (err) {
      console.error(err.message);
      return res.status(404).json({ msg: 'No Github profile found' });
    }
  });


module.exports = router