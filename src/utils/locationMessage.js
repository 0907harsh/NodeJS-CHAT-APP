const generateLocationMessage=(Username,url)=>{
    return {
        Username,
        url,
        createdAt:new Date().getTime()
    }
}

module.exports={
    generateLocationMessage
}