const generateMessgae=(Username,message)=>{
    return {
        Username,
        message,
        createdAt:new Date().getTime()
    }
}

module.exports={
    generateMessgae
}