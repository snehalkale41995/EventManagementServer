const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const { Helpdesk , validateHelpDesk } = require('../models/staticPages');
 
router.get('/', async (req, res) => {
    try {
        const helpDeskInfo = await Helpdesk.find().populate('event');
        res.send(helpDeskInfo);
    } catch (error) {
        res.send(error.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const { error } = validateHelpDesk(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        var helpDeskInfo = new Helpdesk(_.pick(req.body, ['event', 'eventSupportEmail', 'eventSupportContact', 'techSupportEmail', 'techSupportContact']));
        helpDeskInfo = await helpDeskInfo.save();
        
        res.send(helpDeskInfo);
    } catch (error) {
        res.send(error.message);
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { error } = validateHelpDesk(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        helpDeskInfo = await Helpdesk.findByIdAndUpdate(req.params.id,
            _.pick(req.body, ['event', 'eventSupportEmail', 'eventSupportContact', 'techSupportEmail', 'techSupportContact'])
            , { new: true })

        if (!helpDeskInfo) return res.status(404).send('The Helpdesk Information with the given ID was not found.');

        res.send(helpDeskInfo)
    } catch (error) {
        res.send(error.message);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const helpDeskInfo = await Helpdesk.findById(req.params.id);
        if (!helpDeskInfo) return res.status(404).send('The Helpdesk Information with the given ID was not found.');
        res.send(helpDeskInfo);
    } catch (error) {
        res.send(error.message);
    }
})

router.delete('/:id', async(req,res)=>{
    try {
        const helpDeskInfo = await Helpdesk.findByIdAndRemove(req.params.id);
        if (!helpDeskInfo) return res.status(404).send('The Helpdesk Information with the given ID was not found.');
        res.send(helpDeskInfo);
    } catch (error) {
        res.send(error.message);
    }
})
module.exports = router;