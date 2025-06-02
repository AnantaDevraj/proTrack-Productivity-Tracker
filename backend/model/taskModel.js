import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
    },
    status:{
        type: String,
        enum:['pending' , 'in-progress' , 'completed'],
        default: 'pending',
    },
    userId:{
        //refering to the User Schema 
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true,
    },
    //mark whether this task is today's goal or not
    goalForToday:{
        type: Boolean,
        default: false,
    },
    timeSpent:{
        type: Number,
        default: 0,
    },
    completedAt:{
        type: Date,
    },

}, 
{timestamps : true});

const Task = mongoose.model('Task' , taskSchema);
export default Task;

