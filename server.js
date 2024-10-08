const express = require('express'),
    cors = require('cors'),
    path = require('path'),
    jsonfile = require('jsonfile'),
    port = 5555;

var app = express();

app.use(express.static(__dirname + '/dist'))
    .use(express.static(__dirname + '/json'))
    .use(cors())


app.get('/:type/:id', (req, res) => {
    const type = req.params.type;
    var fileName = `json/${type}/${req.params.id}.json`;
    var file = path.normalize(__dirname + '/' + fileName);
    //console.log('path: ' + file);

    jsonfile.readFile(file, function (err, obj) {
        if (err) {
            res.json({ status: 'error', reason: err.toString() });
            return;
        }

        res.json(obj);
    });
});

console.log(`Listening on http://localhost:${port}`);
app.listen(port);
