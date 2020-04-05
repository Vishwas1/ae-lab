

const statusTypeEnum = {
    ERROR : 500,
    OK : 200
}



const sendFormattedResponse =  async (res, message, statusTypeEnum) => {
    return res.JSON({
        data: message,
        status: statusTypeEnum
    })
}