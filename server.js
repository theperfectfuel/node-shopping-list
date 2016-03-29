var express = require('express');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
	console.log("adding");
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.delete = function(id) {
	console.log("deleting: " + id);
	for (var i = 0; i < this.items.length; i++) {
		if (this.items[i].id == id) {
			this.items.splice(i, 1);
		}
	}

	return this.items;

};

Storage.prototype.update = function(itemName, itemId) {
	console.log("updating: " + itemName + " " +itemId);
	for (var i = 0; i < this.items.length; i++) {
		if (this.items[i].id == itemId) {
			this.items[i] = {name: itemName, id: itemId};
		}
	}

	return this.items;

};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

app.delete('/items/:id', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var items = storage.delete(req.params.id);
    res.status(201).json(items);
});

app.put('/items/:id', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var items = storage.update(req.body.name, req.params.id);
    res.status(201).json(items);
});


app.listen(process.env.PORT || 8080);

exports.app = app;
exports.storage = storage;