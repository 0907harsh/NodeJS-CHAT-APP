const users=[]

//adduser
const adduser= ({id,Username,Room})=>{
    //Clean The data
    Username=Username.trim().toLowerCase()
    Room=Room.trim().toLowerCase()
    //validating user
    if(!Username || !Room){
        console.log(' fsfs')
        return {
            error:'Username And Room must beprovided'
        }
    }
    //check for existing user
    const existinguser = users.find((user)=>{
        return user.Room===Room && user.Username === Username
    })

    if(existinguser){
        return {
            error: 'Username is in use'
        }
    }

    //Store user
    const user={id,Username,Room}
    users.push(user)
    return {user}
}

//removeuser
const removeUser=(id)=>{
    const index=users.findIndex((user)=>{
        return user.id===id
        
    })
    if(index!==-1){
        return users.splice(index,1)[0]
    }
}


//getuser
const getuser=(id)=>{
    return users.find((user)=> user.id===id)
}

//getusersinroom
const getusersintheroom=(room)=>{
    room=room.trim().toLowerCase()
    return users.filter((user)=>{
        return user.Room===room})
}

module.exports={
    adduser,
    removeUser,
    getuser,
    getusersintheroom
}
