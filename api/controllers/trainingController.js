const {
    statusTypeEnum,
    sendFormattedResponse
} = require('../utils/utils')

const trainingsJSON = require('../models/data.training.json')
let tData = {}

const trainingIds = () => {
    trainingsJSON.map(x => {
        tData[x.id] = x.file
    })
}

trainingIds();

const courseJSON = (courseId) => {
    if(courseId == "") throw new Error('Training id is blank')
    if(Object.keys(tData).indexOf(courseId) == -1) throw new Error(`Training id ${courseId} does not exist`)
    const file = tData[courseId] 
    const data = require(`../models/${file}`)
    return JSON.stringify(data)
}

// PUBLIC Methods
/////////////////
const getListOfTraining = (req, res) => {
    try{
        const data = JSON.stringify(trainingsJSON)
        return sendFormattedResponse(res, data, statusTypeEnum.OK);
    }catch(e){
        return sendFormattedResponse(res, e.message, statusTypeEnum.ERROR);
    }
}


const getTrainingContent = (req, res) => {
    try{
        const courseId = req.query.id
        const data = courseJSON(courseId)
        return sendFormattedResponse(res, data, statusTypeEnum.OK);
    }catch(e){
        return sendFormattedResponse(res, e.message, statusTypeEnum.ERROR);
    }
}

module.exports = {
    getListOfTraining,
    getTrainingContent
}