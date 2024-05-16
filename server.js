const express = require("express")
const app = express()

const router = express.Router()

app.set("view engine", "ejs")
// app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get("/", (req,res) => {
    // res.sendStatus(500, "test error")
    // res.download("server.js")
    // res.json({message : "test json"})
    // res.send("Hello world")
    res.render("index", {name : "Ali"})
})

app.post('/', (req, res) => {
    console.log(req.body.name)
});
// const userRouter = require("./routes/users")

// app.use("/users", userRouter)
module.exports = router
app.listen(3000)