const statusTypeEnum = {
    ERROR : 500,
    OK : 200
}

const sendFormattedResponse =  async (res, message, statusTypeEnum) => {
    return res.json({
        data: message,
        status: statusTypeEnum
    })
}

module.exports = {
    statusTypeEnum,
    sendFormattedResponse
}

