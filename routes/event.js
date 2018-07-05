const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const { Events, validateEvent } = require('../models/event');
const {Sessions, validateSessions} = require('../models/session');
 
router.get('/', async (req, res) => {
    const events = await Events.find().sort('eventName');
    res.send(events);
});

router.post('/', async (req, res) => {
    const { error } = validateEvent(req.body);
    if (error) return res.status(400).send(error.details[0].message);

   var event = new Events(_.pick(req.body,['eventName','venue','description','startDate','endDate']))
     
    event = await event.save();
    res.send(event);
})

router.put('/:id', async(req ,res)=>{

    const { error } = validateEvent(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    event = await Events.findByIdAndUpdate(req.params.id,
      _.pick(req.body,['eventName','venue','description','startDate','endDate'])
    , {new : true})
   
   if(!event) return res.status(404).send('The Event with the given ID was not found.');

   res.send(event)
})

router.get('/:id', async(req ,res)=>{
    const event = await Events.findById(req.params.id);
    if(!event) return res.status(404).send('The Event with the given ID was not found.');
    res.send(event);
})

router.delete('/:id', async(req,res)=>{
     const event = await Events.findByIdAndRemove(req.params.id);
     if(!event) return res.status(404).send('The Event with the given ID was not found.');

      session =await Sessions.deleteMany({eventId: req.params.id});
      
      res.send(event);
})
module.exports = router;