import {Server} from 'socket.io'
import 'dotenv/config'

const port = process.env.PORT;

const io = new Server(port , {
    cors:{
        origin: process.env.CLIENT_URL
    }
})


let users = [];
const addUser = (userData , socketId) =>{
    console.log(users)
    !users?.some(user => user._id === userData._id) && users.push({...userData , socketId})
}

const removeUser = (userData , socketId)=>{
          users = users.filter((user)=>{
                 if(user._id !== userData._id){
                    return user
                 }
           })
}

const getUser = (userId)=>{
    console.log('user ' , users);
    console.log('userId ', userId)
    return users.find(user => user._id === userId)
}
io.on('connection' , (socket)=>{
    console.log('user connected')

    socket.on("addUsers" , userData=>{
        addUser(userData , socket.id)
        io.emit('getUsers',users)
    })

    socket.on('remove_user',userData=>{
            removeUser(userData , socket.id);
            io.emit('getUsers' , users)
    })
    
    socket.on('sendMessage', data=>{
        console.log('data ', data)
        const user = getUser(data.receiverId)
        // console.log('user ' , user)
        user && user.socketId && io.to(user.socketId).emit('getMessage' , data);
    })

})



