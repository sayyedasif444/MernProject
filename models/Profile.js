const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    company:  {
        type: String
    },
    website:  {
        type: String
    },
    location:  {
        type: String
    },
    status:  {
        type: String
    },
    skills:  {
        type: [String],
        required:true
    },
    bio:  {
        type: String
    },
    githubusername:  {
        type: String
    },
    experience:  [
        {
            title: {
                type:String,
                required: true
            },
            company: {
                type:String,
                required: true
            },
            location: {
                type:String
            },
            from: {
                type:Date,
                required: true
            },
            to: {
                type:Date
            },
            current: {
                type:Boolean,
                default: false
            },
            description: {
                type:String,
            }
        }
    ],
    education:[{
        school: {
            type: String,
            requried: true
        },
        degree: {
            type: String,
            requried: true
        },
        fieldofstudy: {
            type: String,
            requried: true
        },
        from: {
            type:Date,
            required: true
        },
        to: {
            type:Date
        },
        current: {
            type:Boolean,
            default: false
        },
        description: {
            type:String,
        }
    }],
    social: {
        youtube: {
            type:String
        },
        twitter: {
            type:String
        },
        facebook: {
            type:String
        },
        linkedin: {
            type:String
        },
        instagram: {
            type:String
        }
    },
    data: {
        type: Date,
        default: Date.now11
    }
})

module.exports = Profile = mongoose.model('profile', ProfileSchema)