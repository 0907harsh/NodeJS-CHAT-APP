const socket=io()
//Elements
const incrementor=document.querySelector('#submitButton')
const textMessage=document.querySelector('#messageForm')
const messageShower=document.querySelector('#message-shower')
const sidebar=document.querySelector('#sidebar')

//Templates
const messageTemplates=document.querySelector('#message-template').innerHTML
const locationtemplates=document.querySelector('#location-template').innerHTML
const sidebartemplate=document.querySelector('#sidebar-template').innerHTML

//options
const {Username,Room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

incrementor.addEventListener('click',(e)=>{
    e.preventDefault()

    incrementor.setAttribute('disabled','disabled')
    const message=textMessage.value
    socket.emit('messageUser',message,(messag)=>{
        incrementor.removeAttribute('disabled')
        textMessage.value=''
        textMessage.focus()
        textMessage.placeholder=messag
        // console.log(messag)
    })
    
})
//auto-scrolling
const autoscroll=()=>{
    const $newMessage = messageShower.lastElementChild

    const newMessageStyles=getComputedStyle($newMessage)
    const newMessageMargn=parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargn
    
    //visible-height
    const visibleHeight=messageShower.offsetHeight
    
    //Height of message COntaner
    const containerHeight=messageShower.scrollHeight

    //How far am i scrolled
    const scrolledHeight=messageShower.scrollTop+visibleHeight

    if(containerHeight - 3*newMessageHeight <= scrolledHeight){
        messageShower.scrollTop=messageShower.scrollHeight
    }
}


//message
socket.on('=>',(message)=>{
    const html=Mustache.render(messageTemplates,{
        Username:message.Username,
        message:message.message,
        timestamp:moment(message.createdAt).format("dddd, h:mm a")
    })
    messageShower.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

//location-message
socket.on('location=>',(message)=>{
    // console.log('locatio=>',message.url)
    const html=Mustache.render(locationtemplates,{
        Username:message.Username,
        URL:message.url,
        timestamp:moment(message.createdAt).format("dddd, h:mm a")
    })
    messageShower.insertAdjacentHTML('beforeend',html)
    // autoscroll()
})

socket.on('roomData',({Room,users})=>{
    console.log(users,Room)
    const html=Mustache.render(sidebartemplate,{
        Room,
        users
    })
    sidebar.innerHTML=html
})


const LocationSharer=document.querySelector('#Send-Location')
LocationSharer.addEventListener('click',(e)=>{
    e.preventDefault()
    if(!navigator.geolocation){
        return alert('Geolocation is not supportted by your browser')
    }
    LocationSharer.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        
        const latitude=position.coords.latitude
        const longitude=position.coords.longitude
        socket.emit('UserLocation',latitude,longitude,(donee)=>{
            LocationSharer.removeAttribute('disabled')
        })
    })
})


socket.emit('join',{Username,Room},(error)=>{
    if(error){
        alert(error)
        location.href="/"
    }
})

