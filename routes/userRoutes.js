const express = require('express')
const {getUser,
    getUserProfileImage,
    registerUser,
    mobileVerify,
    emailVerify,
    updateUser,
    approveTermsAndConditions,
    checkEmail,
    forgotPassword,
    addUser,
    getUserGroups,
    getAddUserDetails,sendEmail} = require('../controller/userController')
const {verifyUser} = require('../middleware/middleware')
const router = express.Router()

/**
 * POST Request
 * Get User Details Using user_name and password
 * Database Table Names -> it_user_temp
 */
router.post('/login', async (req, res) => {
    try {
        const result = await getUser(req, res);
        if (result == 0){
            res.status(404).json({"code":404,"message":"Not Found User"});
            return;
        }
        res.status(200).json({"code":200,"message":result});
    } catch (error) {
        res.status(500).json({"code":500,"message":"Please Try Again.."});
    }
});

/**
 * POST Request
 * Get User Profile Image User ID Using
 * Database Table Names -> it_user_temp
 */
router.post('/getUserProfileImage', async (req, res) => {
    try {
        const result = await getUserProfileImage(req, res);
        if (result == 0){
            res.status(404).json({"code":404,"message":"Not Found User"});
            return;
        }
        res.status(200).json({"code":200,"message":result});
    } catch (error) {
        res.status(500).json({"code":500,"message":"Please Try Again.."});
    }
});

/**
 * Update Terms and Conditions Using User ID
 * Database Table Name -> it_user_temp
 */
router.post('/terms&conditions', async (req, res) => {
    try {
        const result = await approveTermsAndConditions(req, res);
        if (result == 0) {
            res.status(404).json({"code":404,"message":"Not Found User"});
            return;
        }
        res.status(200).json({"code":200,"message":"Terms and condition agreed updated successfully"});
    } catch (error) {
        res.status(500).json({"code":500,"message":"Please Try Again..","error": error.message});
    }
})


/**
 * CHECK THIS CODE V 2
 * POST Request
 * User Register
 * User Database Tables -> it_user_temp
 */
router.post('/registration', async (req, res) => {
    try {
        const result1 = await registerUser(req, res);
        if (result1 == 0){
            res.status(404).json({"code":404,"message":"Not Found User"});
            return;
        }
        if (result1 == 2){
            res.status(409).json({"code":409,"message":"User Already Exist"});
            return;
        }else {
            res.status(200).json({"code":200,"message":result1});
        }
    } catch (error) {
        res.status(500).json({"code":500,"message":error.message});
    }
});

/**
 * POST Request
 * Check User Details Using user_name
 * User Database Tables -> it_user_temp
 */
router.post('/checkemail', async (req, res) => {
    try{
        const result = await checkEmail(req, res);
        if (result == 0){
            res.status(404).json({"code":404,"message":"Not Found User"});
            return;
        }
        res.status(200).json({"code":200,"message":result});
    }
    catch{
        console.error("Error:",error);
        res.status(500).json({"code":500,"message":"Please Try Again"});
    }
})


/**
 * CHECK THIS CODE V 2
 * POST Request
 * Update Forget Password
 * User Database Tables -> it_user_temp
 */
router.post('/forgotPassword', async (req, res) => {
    try{
        const result = await forgotPassword(req, res);
        if (result == 0){
            res.status(404).json({ "code": 404, "message": "User Not Found" });
            return;
        }
        res.status(200).json({ "code": 200, "message": "Password Updated Successfully!" });
    }
    catch(error){
        res.status(500).json({ "code": 500, "message": "Internal Server Error", "error": error.message });
    }
});

router.post('/updateMobileVerify', async (req, res) => {
    try {
        const result = await mobileVerify(req, res);
        if (result == 0) {
            res.status(404).json({ "code": 404, "message": "Mobile Verification Failed" });
        }
        res.status(200).json({ "code": 200, "message": "Mobile Verification Successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ "code": 500, "message": "Internal Server Error", "error": error.message });
    }
});

/**
 * Add User
 * User Database Tables -> it_user_temp, it_user_master
 */
router.post('/addUser', async (req, res) => {
    try{
        const result = await addUser(req, res);
        if (result == 0){
            res.status(404).json({ "code": 404, "message": "User Not Found" });
            return;
        }else if (result == 1){
            res.status(201).json({ "code": 404, "message": "Email Already Used." });
            return;
        }else if (result == 2){
            res.status(201).json({ "code": 404, "message": "Phone Number Already Used." });
            return;
        }
        res.status(200).json({ "code": 200, "message": "User Added Successfully" });
    }
    catch(error){
        res.status(500).json({ "code": 500, "message": "Internal Server Error", "error": error.message });
    }
});


/**
 * POST Request
 * Load All User Group
 * User Database Table it_user_group
 */
router.post('/user-groups',async (req, res) => {
    try{
        const getUserGroupResults = await getUserGroups(req,res);
        if (getUserGroupResults == 0){
            res.status(404).json({ "code": 404, "message": "User Group Level Not Found" });
            return;
        } 
        res.status(200).json({ "code": 200, "message":getUserGroupResults});
    }
    catch(error){
        res.status(500).json({ "code": 500, "message": "Internal Server Error", "error": error.message });
    }
})

/**
 * Load All User Details Business Master ID Using
 * User Database Table -> it_user_master
 */
router.post('/getUserRoleDetails', async (req, res) => {
    try{
        const results = await getAddUserDetails(req,res);
        // console.log("user groups UI cards : ",results);
        if (results == 0){
            res.status(404).json({ "code": 404, "message": "User Group Details Not Found" });
            return;
        } 
        res.status(200).json({ "code": 200, "message":results});
    }
    catch(error){
        console.error("Error:", error);
        res.status(500).json({ "code": 500, "message": "Internal Server Error", "error": error.message });
    }
})


/**
 * email Verification Update
 * User Database Table -> it_user_temp
 */
router.post('/updateEmailVerify', async (req, res) => {
    try{
        const result = await emailVerify(req, res);
        if (result == 0){
            res.status(404).json({ "code": 404, "message": "Email Verification Failed" });
            return;
        }
        res.status(200).json({ "code": 200, "message": "Email Verification Successfully" });
    }
    catch(error){
        console.error("Error:", error);
        res.status(500).json({ "code": 500, "message": "Internal Server Error", "error": error.message });
    }
});


/**
 * Update Terms And Condition Using User ID
 * Database Table Names -> it_user_temp
 */
router.put('/updateUser', async (req, res) => {
    try {
        const result = await updateUser(req, res);
        res.status(200).json({ "code": 200, "message": "User Update Success" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ "code": 500, "message": "Internal Server Error", "error": error.message });
    }
});

router.post('/sendEmail', async (req, res) => {
    try{
        const result = await sendEmail(req, res);
        if (result == 0){
            res.status(404).json({ "code": 404, "message": "Email Not Sent" });
            return;
        }
        res.status(200).json({ "code": 200, "message": "Email Sent Successfully" });
    }
    catch(error){
        console.error("Error:", error);
        res.status(500).json({ "code": 500, "message": "Internal Server Error", "error": error.message });
    }
});
module.exports = router;
