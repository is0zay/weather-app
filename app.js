// Weather App
const express = require('express');
const app = express();
const https = require('https');
const bodyParser = require('body-parser');

// Here created route for url to page.html
app.use(bodyParser.urlencoded({extended:true}));
app.get("/", function(req,res){
	res.sendFile(__dirname + "/page.html")
});



//Implement API call to our URL
app.post("/", (req,res) => {
	const cityName = req.body.cityName;
	const stateCode = req.body.stateCode;
	// const zipCode = req.body.zipCode;
	// const countryCode = req.body.countryCode;
	let lat = '';
	let lon = '';
	
	
	if(cityName.length > 0 && isNaN(cityName) === true) {
		const url2 = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName},nc,{country code}&limit=5&appid=0c533c7deadf932af115f677dad9cf18`;
		https.get(url2, function(response) {
			response.on("data", (data) => {
				const data1JSON = JSON.parse(data);
				lat = data1JSON[0].lat;
				lon = data1JSON[0].lon;
				
				const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=0c533c7deadf932af115f677dad9cf18&units=imperial`;
				https.get(url, function(response) {
					response.on("data", function(data) {
					const dataJSON = JSON.parse(data);
					console.log(dataJSON);
					const temp = dataJSON.main.temp;
					const desc = dataJSON.weather[0].description;
					const icon = dataJSON.weather[0].icon;
					const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
					res.write(`<h1>The temp in ${cityName} is ${temp} degrees</h1>`);
					res.write(`<p>The weather description is ${desc} </p>`);
					res.write("<img src =" + imageURL + ">" )
					});
				});
				
			});
		});
	} else if (cityName.length === 5 && isNaN(cityName) !== true) {
		const url3 = `https://api.openweathermap.org/data/2.5/weather?zip=${cityName},us&appid=0c533c7deadf932af115f677dad9cf18`;
		https.get(url3, function(response) {
			response.on("data", (data) => {
				const data2JSON = JSON.parse(data);
				
				lat = data2JSON.coord.lat;
				lon = data2JSON.coord.lon;
				

				const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=0c533c7deadf932af115f677dad9cf18&units=imperial`;
				https.get(url, function(response) {
					response.on("data", function(data) {
					const dataJSON = JSON.parse(data);
					console.log(dataJSON);
					const temp = dataJSON.main.temp;
					const desc = dataJSON.weather[0].description;
					const icon = dataJSON.weather[0].icon;
					const name = dataJSON.name;
					const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
					res.write(`<h1>The temp in ${name} is ${temp} degrees</h1>`);
					res.write(`<p>The weather description is ${desc} </p>`);
					res.write("<img src =" + imageURL + ">" )
					});
				});

			});
		});
	} else {
		console.log('Enter valid input');
	}
	

	
});

app.listen(9000);


