const Express               = require('express') //for RESTFUL API
const hbs                   = require('express-handlebars') //handlers
const session               = require('express-session') //for keep logged in 
const mongoose              = require('mongoose') //mongoDB database
const passport              = require('passport') //middleware authentication
const passport_strategy     = require('passport-local').Strategy //simplifies username and password for login
const bcrypt                = require('bcrypt') //generates hash against the password

const app = Express()
const port = process.env.port || 3000
//middlewares
app.use(Express.urlencoded({extended: false}))
app.use(Express.static(__dirname + '/public'))
app.engine('hbs', hbs.engine({extname: '.hbs'}))
app.set('view engine', 'hbs')
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
            type: String,
            required: true
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
    model.findOne({username: username}, (err,user)=>
    {
        if(err) return done(err)
        if(!user) {return done(null, false, {message: 'Incorrect Username'})}

        bcrypt.compare(password, model.password, (res,err)=>
        {
            if(err) return done(err)
            if(res == false) return done(null, false, {message: 'Password Invalid'})
            
            //if there's everything correct, we pass the user
            return done(null,user)
        })
    })
}))

app.get('/', (req,res)=>
{
    res.render('index', {title: "Home"})
})
app.get('/login', (req,res)=>
{
    res.render('login', {title: "Login"})
})

app.listen(port, ()=> console.log(`Listening to port ${port}....`))