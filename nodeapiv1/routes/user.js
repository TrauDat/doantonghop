const express = require("express");
const {
    userById,
    allUsers,
    getUser,
    updateUser,
    deleteUser,
    userPhoto,
    userPhotoBackground,
    addFollowing,
    addFollower,
    removeFollowing,
    removeFollower,
    findPeople,
    hasAuthorization,
    search,
    searchMethodPost
} = require("../controllers/user");
const { requireSignin } = require("../controllers/auth");

const router = express.Router();

router.put("/user/follow", requireSignin, addFollowing, addFollower);
router.put("/user/unfollow", requireSignin, removeFollowing, removeFollower);

router.get("/users", allUsers);
router.get("/user/:userId", requireSignin, getUser);
router.put("/user/:userId", requireSignin, hasAuthorization, updateUser);
router.delete("/user/:userId", requireSignin, hasAuthorization, deleteUser);
// photo
router.get("/user/photo/:userId", userPhoto);

// photoBackground
router.get("/user/photoBackground/:userId", userPhotoBackground);

// who to follow
router.get("/user/findpeople/:userId", requireSignin, findPeople);

//search
router.get("/user/search", search);
router.post("/user/searchMethodPost", searchMethodPost);

// any route containing :userId, our app will first execute userByID()
router.param("userId", userById);

module.exports = router;
