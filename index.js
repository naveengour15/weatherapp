const fs = require("fs");
const http = require("http");
var requests = require("requests");
const homeFile = fs.readFileSync("home.html", "UTF-8");

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

const server = http.createServer((req, res) => {
    console.log("in server");
    try{
        if (req.url == "/") {
            console.log("url");
            requests(
            "http://api.openweathermap.org/data/2.5/weather?q=Bhopal&units=metric&appid=API_KEY"
            )
            .on("data", (chunk) => {
                const objData = JSON.parse(chunk);
                
                const arrData = [objData];
                const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
                res.write(realTimeData);
            })
            .on("end", (error) => {
                if(error) {
                    console.log(" connection closed due to errors "+ error);
                }
                console.log("end");
            });
        }
    } catch (error) {
        console.error("Error occurred:", error);
    }
});

server.listen(8000, "127.0.0.1");
