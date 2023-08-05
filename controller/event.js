const Event = require("../models/event.js");
const Attendee = require("../models/attendee.js");

const createEvent= async (req,res) => {
    const {name,date} = req.body;
    const creator = req.user._id;
    const event =  new Event({name,date,creator});
    await event.save();
    res.json({
        sucess:"true",
        message:"Event is created successfulluy",
    })
}
const getEvents = async (req,res) =>{
    const params = req.query;
    const queryObject ={
        name:{
            $regex:new RegExp(params.searchKey),
            $option:'i',
        }
    }
    const events = await Event.find({})
    res.json({
        sucess:true,
        result:events,
    })
};

const joinEvents = async(req,res)=>{
    const alreadyJoined = await Attendee.findOne({
    eventId:req.body.eventId,
    userId:req.user._id
    });
    if(alreadyJoined){
        return res.status(404).json({
            success:false,
            message:"user has already joined this event"
        })
    }
    const attendee = new Attendee({
        eventId:req.body.eventId,
        userId:req.user._id
    });
    await attendee.save();
    res.json({
        success:true,
            message:"Event joined Successfuly"
    })
}

module.exports ={
    createEvent,
    getEvents,
    joinEvents,
};