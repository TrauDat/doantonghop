const _ = require("lodash");
const User = require("../models/user");
const formidable = require("formidable");
const fs = require("fs");
const async = require("async");

exports.userById = (req, res, next, id) => {
    User.findById(id)
        // populate followers and following users array
        .populate("following", "_id name")
        .populate("followers", "_id name")
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: "User not found"
                });
            }
            req.profile = user; // adds profile object in req with user info
            next();
        });
};

exports.hasAuthorization = (req, res, next) => {
    let sameUser = req.profile && req.auth && req.profile._id == req.auth._id;
    let adminUser = req.profile && req.auth && req.auth.role === "admin";

    const authorized = sameUser || adminUser;

    // console.log("req.profile ", req.profile, " req.auth ", req.auth);
    console.log("SAMEUSER", sameUser, "ADMINUSER", adminUser);

    if (!authorized) {
        return res.status(403).json({
            error: "User is not authorized to perform this action"
        });
    }
    next();
};

exports.allUsers = (req, res) => {
    User.find((err, users) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json(users);
    }).select("name email updated created role");
};

exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

// exports.updateUser = (req, res, next) => {
//     let user = req.profile;
//     user = _.extend(user, req.body); // extend - mutate the source object
//     user.updated = Date.now();
//     user.save(err => {
//         if (err) {
//             return res.status(400).json({
//                 error: "You are not authorized to perform this action"
//             });
//         }
//         user.hashed_password = undefined;
//         user.salt = undefined;
//         res.json({ user });
//     });
// };

exports.updateUser = (req, res, next) => {
    let form = new formidable.IncomingForm();
    // console.log("incoming form data: ", form);
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded"
            });
        }
        // save user
        let user = req.profile;
        // console.log("user in update: ", user);
        user = _.extend(user, fields);

        user.updated = Date.now();
        // console.log("USER FORM DATA UPDATE: ", user);

        if (files.photo) {
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;
        }

        if (files.photoBackground) {
            user.photoBackground.data = fs.readFileSync(files.photoBackground.path);
            user.photoBackground.contentType = files.photoBackground.type;
        }

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            // console.log("user after update with formdata: ", user);
            res.json(user);
        });
    });
};

exports.userPhoto = (req, res, next) => {
    if (req.profile.photo.data) {
        res.set(("Content-Type", req.profile.photo.contentType));
        return res.send(req.profile.photo.data);
    }
    next();
};

exports.userPhotoBackground = (req, res, next) => {
    if (req.profile.photoBackground.data) {
        res.set(("Content-Type", req.profile.photoBackground.contentType));
        return res.send(req.profile.photoBackground.data);
    }
    next();
};

exports.deleteUser = (req, res, next) => {
    let user = req.profile;
    user.remove((err, user) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({ message: "User deleted successfully" });
    });
};

// follow unfollow
exports.addFollowing = (req, res, next) => {
    User.findByIdAndUpdate(
        req.body.userId,
        { $push: { following: req.body.followId } },
        (err, result) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            next();
        }
    );
};

exports.addFollower = (req, res) => {
    User.findByIdAndUpdate(
        req.body.followId,
        { $push: { followers: req.body.userId } },
        { new: true }
    )
        .populate("following", "_id name")
        .populate("followers", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            result.hashed_password = undefined;
            result.salt = undefined;
            res.json(result);
        });
};

// remove follow unfollow
exports.removeFollowing = (req, res, next) => {
    User.findByIdAndUpdate(
        req.body.userId,
        { $pull: { following: req.body.unfollowId } },
        (err, result) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            next();
        }
    );
};

exports.removeFollower = (req, res) => {
    User.findByIdAndUpdate(
        req.body.unfollowId,
        { $pull: { followers: req.body.userId } },
        { new: true }
    )
        .populate("following", "_id name")
        .populate("followers", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            result.hashed_password = undefined;
            result.salt = undefined;
            res.json(result);
        });
};

exports.findPeople = (req, res) => {
    let following = req.profile.following;
    following.push(req.profile._id);
    User.find({ _id: { $nin: following } }, (err, users) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json(users);
    }).select("name");
};

exports.search = (req, res) => {
    //req.user.username
    let username = req.body.username;
    User.find({username: new RegExp(username)}, function(err, result) {
    //Do your action here..
        if (err) {
            return res.status(400).json({
                error: err
                });
               }
        res.json(result);
    });
}

exports.searchMethodPost = (req, res) => {
    let username = req.body.username;

    // if (username === req.user.username) {
    //     username= null;
    //     }
    User.find({username: new RegExp(username)}, (err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json(result);
    });
   async.parallel([
    function(callback) {
        if(req.body.receiverName) {
                User.update({
                    'username': req.body.receiverName,
                    'request.userId': {$ne: req.user._id},
                    'friendsList.friendId': {$ne: req.user._id}
                }, 
                {
                    $push: {request: {
                    userId: req.user._id,
                    username: req.user.username
                    }},
                    $inc: {totalRequest: 1}
                    },(err, count) =>  {
                        console.log(err);
                        callback(err, count);
                    })
        }
    },
    function(callback) {
        if(req.body.receiverName){
                User.update({
                    'username': req.user.username,
                    'sentRequest.username': {$ne: req.body.receiverName}
                },
                {
                    $push: {sentRequest: {
                    username: req.body.receiverName
                    }}
                    },(err, count) => {
                    callback(err, count);
                    })
        }
    }],
(err, results)=>{
    res.redirect('/search');
});

        async.parallel([
            // this function is updated for the receiver of the friend request when it is accepted
            function(callback) {
                if (req.body.senderId) {
                    User.update({
                        '_id': req.user._id,
                        'friendsList.friendId': {$ne:req.body.senderId}
                    },{
                        $push: {friendsList: {
                            friendId: req.body.senderId,
                            friendName: req.body.senderName
                        }},
                        $pull: {request: {
                            userId: req.body.senderId,
                            username: req.body.senderName
                        }},
                        $inc: {totalRequest: -1}
                    }, (err, count)=> {
                        callback(err, count);
                    });
                }
            },
            // this function is updated for the sender of the friend request when it is accepted by the receiver	
            function(callback) {
                if (req.body.senderId) {
                    User.update({
                        '_id': req.body.senderId,
                        'friendsList.friendId': {$ne:req.user._id}
                    },{
                        $push: {friendsList: {
                            friendId: req.user._id,
                            friendName: req.user.username
                        }},
                        $pull: {sentRequest: {
                            username: req.user.username
                        }}
                    }, (err, count)=> {
                        callback(err, count);
                    });
                }
            },
            function(callback) {
                if (req.body.user_Id) {
                    User.update({
                        '_id': req.user._id,
                        'request.userId': {$eq: req.body.user_Id}
                    },{
                        $pull: {request: {
                            userId: req.body.user_Id
                        }},
                        $inc: {totalRequest: -1}
                    }, (err, count)=> {
                        callback(err, count);
                    });
                }
            },
            function(callback) {
                if (req.body.user_Id) {
                    User.update({
                        '_id': req.body.user_Id,
                        'sentRequest.username': {$eq: req.user.username}
                    },{
                        $pull: {sentRequest: {
                            username: req.user.username
                        }}
                    }, (err, count)=> {
                        callback(err, count);
                    });
                }
            } 		
        ],(err, results)=> {
            res.redirect('/search');
        });
};
