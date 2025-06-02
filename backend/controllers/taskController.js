//for managing CRUD operation :
import Task from "../model/taskModel";

//CREATE
export const createTask = async(req , res) => {
    try {
        const task = await Task.create({...req.body , userId: req.user.id});
        res.status(201).json(task);
    }catch(err){
        res.status(400).json({msg : err.message});
    }
};

//GET
export const getTasks = async(req , res) =>{
    try{
        const tasks = await Task.find({userId: req.user.id});
        res.status(200).json(tasks);
    }catch(err){
        res.status(400).json({msg : err.message});
    }
};

//UPDATE
export const updateTask = async(req , res) =>{
    try{
        const task  = await Task.findOneAndUpdate(
            {
                _Id: req.params.id , 
                userId: req.user.id
            },
            req.body,
            {new: true}
        );
        res.status(200).json(task);
    }catch(err){
        res.status(400).json({msg: err.message});
    }
};

//DELETE
export const deleteTask = async(req ,res) =>{
    try{
        const task = Task.findOneAndDelete({
            _id : req.params.id,
            userId : req.user.id
        });
        res.status(204).send();
    }catch(err){
        res.status(500).json({msg: err.message});
    }
};


