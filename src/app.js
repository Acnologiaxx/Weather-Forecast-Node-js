const path = require('path')
const express = require('express')
const hbs = require('hbs')
const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')

//define paths for express config
const app = express()
const port = process.env.PORT || 3000 

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res)=>{
    res.render('index', {
        title: 'Weather Status',
        name: 'Jason Ronda'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Jason Ronda'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help tab',
        name: 'JASON JASON'
    })
})

app.get('/weather', (req, res)=> {
    const value = req.query.address
    if(!value){
        return res.send({
            title: 'Weather Status',
            error: 'Please provide an address'
         })
    } 

    geocode(value, (error, { latitude, longitude, location} = {}) => {
        if(error){
            return res.send({
                error
            })
        }
        forecast(latitude, longitude, (error, forecastData)=>{
            if(error){
                return res.send({
                    error
                })
            }
            res.send({
                title: 'Weather Status',
                forecast: forecastData,
                location,
                address: value
            })
        })
    })
})

app.get('/products', (req, res)=> {
    if(!req.query.search){
       return res.send({
            error: 'you must provide a search term'
        })
    }


    console.log(req.query)
    res.send({
        products: []
    })
})

app.get('/help/*',(req,res)=>{
    res.render('404',{
        title: '404',
        name: 'Jason Ronda',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Jason Ronda',
        errorMessage: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})