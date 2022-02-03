const express = require('express');
const app = express();
const path = require('path');
const fetch = require('node-fetch');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

let city = 'Tartu'

app.get('/', function (req, res){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=3f68bed6ed513095148620e7453abb2e`)
        .then((response)=>{
            return response.json();
        })
        .then((data)=>{
            let desc = data.weather[0].description;
            let city = data.name;
            let temp = Math.round(parseFloat(data.main.temp - 273.15));

            res.render('index', {
                desc: desc,
                city: city,
                temp: temp

            });
        })


})
app.listen(3069);