const express = require('express');
const router = express.Router();
const users = require('../services/users')


function usersValidator(req, res, next){
    next() //TODO
}


router.post('/',usersValidator, async (req,res) =>{
    // create new user

    const new_user = {
        //create user from request
    }


    try {
        const user = users.createNewUser(user)
        //user creater

        res.status(200).json({
            //"username" : user.username//jne

        })

        
    } catch (error) {
        // User not created error
        //examble username exist


    }




} )

router.post('/login',usersValidator,(req, res)=> { 

    //login and return jwt





})
router.get('/', (req, res) => {
    res.send('Hello Users!')
  })










module.exports = router