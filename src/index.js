const path=require('path')
const http=require('http')
const express=require('express')
const socketio=require('socket.io')
const Filter=require('bad-words')
const {generateMessgae}=require('./utils/messages')
const {generateLocationMessage}=require('./utils/locationMessage')
const {adduser,removeUser,getuser,getusersintheroom}=require('./utils/users')
const app=express()
const server=http.createServer(app)
const io=socketio(server)

const port=process.env.PORT || 3000
const publicDirPath=path.join(__dirname,'../public')
var qs = require('qs');

app.use(express.static(publicDirPath))
io.on('connection',(socket)=>{
    // console.log('New Connection Detected')
    
    socket.on('join',({Username,Room},fn)=>{
        const {error,user}=adduser({id:socket.id,Username,Room})
        if(error){
            return fn(error) 
        }
        socket.join(user.Room)
        socket.emit('=>',generateMessgae('Admin','Welcome'))
        socket.to(user.Room).broadcast.emit('=>',generateMessgae('',`${user.Username} has joined`))
        io.to(user.Room).emit('roomData',{
            Room:user.Room,
            users:getusersintheroom(user.Room)
        })
        fn()
    })
    
    socket.on('messageUser',(message,fn)=>{
        const filter = new Filter()
        const user=getuser(socket.id)
        if(!user){
            return fn('User not found')
        }
        if(filter.isProfane(message)){
            io.emit('=>',generateMessgae(user.Username,filter.clean(message)))
            return fn('Profanity is not allowed :)')
        }
        io.to(user.Room).emit('=>',generateMessgae(user.Username,message)) 
        fn('The message was Delivered')  
    })
    socket.on('UserLocation',(latitude,longitude,fn)=>{
        const user=getuser(socket.id)
        if(!user){
            return fn('User not found')
        }
        io.to(user.Room).emit('location=>',generateLocationMessage(user.Username,`https://google.com/maps?q=${latitude},${longitude}`))
        fn('Location Shared')
    })
    socket.on('disconnect',()=>{
        const user=removeUser(socket.id)
        if(user){
            io.to(user.Room).emit('=>',generateMessgae('',`${user.Username} has left`))
            io.to(user.Room).emit('roomData',{
                Room:user.Room,
                users:getusersintheroom(user.Room)
            })
        }
    })
})


server.listen(port,()=>{
    console.log('Server s up on port:'+port)
})
