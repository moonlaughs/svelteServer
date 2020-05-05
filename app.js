let express = require("express")
let app = express()

let Memchached = require("memcached")
let memcached = new Memchached("localhost:11211")

let userLogged = 1

// ############################################
//populate database / seed
memcached.set("user:1:friends", "[2,3]", 3600, function(err){
    if(err){console.log("error - seeding");return}
    console.log("friends saved")
})

memcached.set("user:2:status", 1, 3600, function(err){
    if(err){console.log("error - seeding");return}
    console.log("user:2:status saved")
})

memcached.set("user:3:status", 0, 3600, function(err){
    if(err){console.log("error - seeding");return}
    console.log("user:3:status saved")
})
// ############################################
app.get("/statuses", (req, res) => {
    console.log('x')
    res.set("Content-Type", "text/event-stream")
    res.set("Connection", "Keep-alive")
    res.set("Cache-Control", "no-cache")
    res.set("Access-Control-Allow-Origin", "*")
    setInterval(function(){

        memcached.get("user:2:status", function(err, data){
            if(err || !data){console.log("error - reading");return}
            console.log(`user:2:status: ${data}`)
            res.status(200).write(`data: [2,${data}]\n\n`)
        })
        
    }, 1000)
})


// ############################################
app.listen(90, err => {
    if(err){console.log("error - server cannot listen");return}
    console.log("server listening...")
})


/*
    relationl db
    joins joins joins......

    mongodb / document db
    repeated status
    friend 1000 friends...status all 1000, 1000 updates

    good for friends/facebook/instagram: memchched
*/

/*
    key
    user:1:friends
    [2,3,4]

    user:1:status
    1

    user:2:status
    0

    user:3:status
    1
*/

/*
memcached.set("name", "a", 10, function(err){
    if(err){console.log("error - saving");return}
    console.log("name saved")
})

memcached.get("name", function(err, data){
    if(err || !data){console.log("error - reading");return}
    console.log(`name: ${data}`)
})
*/

