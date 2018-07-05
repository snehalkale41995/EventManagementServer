const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Attendee , validateAuthUser , generatePassword , sendPasswordViaEmail} = require('../models/attendee');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const generator = require('generate-password');

//authenticate user to portal
router.post('/', async (req, res) => {
    try {
        const { error } = validateAuthUser(req.body);
        if (error) return res.status(404).send(error.details[0].message);

        let user = await Attendee.findOne({email : req.body.email});
        if(!user) return res.status(404).send("Invalid Email/Password...");
        
        const validPassword = await bcrypt.compare(req.body.password, user.password);  //return a boolean
        if(!validPassword) return res.status(404).send("Invalid Email/Password...");

        //steps remaining
        //1. generate token and store in headers
    
        //const token = user.generateAuthToken(); 

        res.send(validPassword);
    }
    catch (error) {
        console.log('error', error)
    }
});

router.post('/forgotPassword/:email' , async (req, res) => {
    try {
        let user = await Attendee.findOne({email : req.params.email});
        if(!user) return res.status(404).send("Invalid Email !!! no user registered ..");

        const { password , hashedPassword } = await generatePassword();
        const result = await Attendee.update({ _id : user._id},{ 
            $set : {
               password : hashedPassword
            }
        });
        let name =  user.firstName + ' ' + user.lastName;
        res.send(result);
        const emailResult = await sendPasswordViaEmail(password, user.email, name);
    }
    catch (error) {
        console.log(error);
    }
})

module.exports = router;