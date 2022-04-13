// import Web3Modal from 'web3modal';
const express = require('express')

const ejs = require('ejs')
const path = require('path')

app = express()
const freelancerRoutes = require('./routers/freelancer')
const userRoutes = require('./routers/user')
// Importing ABI
const freeLancerMarketPlace = require('../artifacts/contracts/freelancerMarketPlace.sol/freelancerMarketplace.json')
// Contract address
const freeLancerMarketPlaceAddress = require('../config')

// Importing blockchain req
const { ethers } = require('ethers')
const axios = require('axios')

const Web3 = require('Web3')
const web3 = new Web3("http://127.0.0.1:8545/")
const contract = new web3.eth.Contract(
    freeLancerMarketPlace.abi,
    freeLancerMarketPlaceAddress
)

const walletConnectProvider = require('@walletconnect/web3-provider')


const viewsDirectory = path.join(__dirname, "../templates/views")
const publicDirectory = path.join(__dirname, "../public")
app.set('view engine', 'ejs')
app.set('views', viewsDirectory)
app.use(express.static(publicDirectory))
app.use(express.urlencoded({ extended: false }))
// app.use('/',freelancerRoutes)
// app.use('/',userRoutes)
// Routes
app.get('/', (req, res) => {
    return res.render('index')
})

app.get('/customersignup', (req, res) => {
    return res.render('customersignup')
})

app.get('/customerlogin', (req, res) => {
    return res.render('customerlogin')
})

app.get('/freelancersignup', (req, res) => {
    return res.render('freelancersignup')
})

app.get('/freelancerlogin', (req, res) => {
    return res.render('freelancerlogin')
})

app.get('/createnewproject', (req, res) => {
    return res.render('createnewproject')
})

app.get('/customerHome', (req,res) => {
    return res.render('customerlanding')
})

app.get('/freelancerHome', async (req,res) => {

    try {
        const p = await contract.methods.retrieveIncompleteProjects().call()
        return res.render('freelancerlanding',{projects:p})
    }catch(e) {
        console.log(e)
    }
    return res.send("No error")
})

app.post('/createnewproject', async (req, res) => {

    try {
        await contract.methods.createProject(req.body.title,req.body.desc,req.body.price).call()
    } catch(e) {
        console.log(e)
    }
    return res.redirect('/donepublished')

})

app.get('/bidpage', (req,res) => {
    return res.render('free-bidding')
})

app.get('/donepublished', (req,res) => {
    return res.render('donepublished')
})

app.get('/customerbidding', (req,res) => {
    return res.render('cust-bidding')
})

app.get('/profile', (req,res) => {
    return res.render('profile')
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server up and running")
})