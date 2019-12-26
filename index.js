const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const stock = require('./stock.js')

let gold = {
    name: "Guld",
    rate: 1.001,
    variance: 0.40,
    startingPoint: 30,
};

let silver = {
    name: "Silver",
    rate: 1.001,
    variance: 0.4,
    startingPoint: 20,
};

let bronze = {
    name: "Bronset",
    rate: 1.001,
    variance: 0.4,
    startingPoint: 10,
};

let metals = [gold, silver, bronze];

app.use(cors());

io.origins(['https://project-react.christianfjsramverk.me:443', 'http://localhost:3000']);

io.on('connection', socket => {
    socket.on('disconnect', () => {
        console.log('disconnected')
    });
});

setInterval(()=> {
    metals.map(metal => {
        metal['startingPoint'] = stock.getStockPrice(metal);
        if (metal['startingPoint'] < 1) {
          metal['startingPoint'] = 5;
        }
        if (metal['startingPoint'] > 100) {
          metal['startingPoint'] = 80;
        }
        return metal;
    })
    io.emit('stocks', metals);
}, 5000)


server.listen(8009, () => console.log('port is running on 8009'));
