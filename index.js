const express = require('express');
const app = express();
const path = require('path');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const {render} = require("ejs");
const {response} = require("express");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

let city = 'Tartu'

const getWeatherData = (url) =>{
    return new Promise((resolve, reject)=>{
        fetch(url)
            .then(response =>{
                return response.json()
            })
            .then(data =>{
                let result = {
                    desc: data.weather[0].description,
                    city: data.name,
                    temp: Math.round(parseFloat(data.main.temp - 273.15)),
                    error: null,
                }
                resolve(result)
            })
            .catch(error =>{
                reject(error);
            })
    })
}

app.all('/', function (req, res){
    let city;
    if(req.method === "GET"){
        city = "tartu";
    }
    if (req.method === "POST"){
        city = req.body.cityname
    }
    let url =`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=3f68bed6ed513095148620e7453abb2e`;
    getWeatherData(url)
        .then(data =>{
            res.render('index', data);
        })
        .catch(error =>{
            res.render('index', {error: "Oops! Something went wrong, try again"})
        })
})

app.get("*", function (req,res){
    res.render('404')
})

app.listen(3069, ()=>{
    console.log("Server started on http://localhost:3069");
});