const Express               = require('express') //for RESTFUL API
const handlebars            = require('express-handlebars') //handlers
const Express_session       = require('express-session') //for keep logged in 
const mongoose              = require('mongoose') //mongoDB database
const passport              = require('passport') //middleware authentication
const passport_strategy     = require('passport-local').Strategy //simplifies username and password for login

const app = Express()
const port = process.env.port || 3000
//middlewares
app.use(Express.urlencoded({extended: false}))
app.use(Express.static(__dirname + '/public'))
app.engine('hbs',handlebars({ extname: '.hbs' }))
app.set('View Engine', 'hbs')
app.use(session({
    secret: "YES",
    resave: false,
    
}))

//initialize passport
app.use(passport.initialize())
app.use(passport.session()) //this will keep logged in even if you refresh


//connect to mongoose

mongoose.connect('mongodb://localhost:27017/my_account',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//creating schema
const schema = new mongoose.Schema({
        username: {
            type: String,
            required: true
        },
        password: {
            type: String
        }
})

//creating model
const model = mongoose.model('userdata', schema)

//lets work with passport here....

passport.serializeUser((user,done) =>
{
    done(null,user.id)
})

passport.deserializeUser((id,done)=>{
    model.findById(id,(err,user)=>{
        done(err,user)
    })
})

passport.use(new passport_strategy((username,password,done)=>
{
    //morning......
}))
