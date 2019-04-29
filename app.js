const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const user = require('./routes/user');
const barang = require('./routes/barang');
const item = require('./routes/item');
const upload = require('./routes/upload');

const environment = require('./env.json');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(morgan('dev'));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        return res.status(200).json({});
    }
    next();
});

app.use('/api/user', user);
app.use('/api/upload', upload);
app.use('/api/barang', barang);
app.use('/api/item', item);
app.use('/api/qrcode', (req, res, next) => {
    res.redirect('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAALPSURBVO3BQa7jSAwFwUxC97/yGy+5KkCQ7OlPMMJ8sMYo1ijFGqVYoxRrlGKNUqxRijVKsUYp1ijFGqVYoxRrlGKNUqxRijXKxUMqv5SEO1S6JNyh8ktJeKJYoxRrlGKNcvGyJLxJ5USlS8IdKl0STpLwJpU3FWuUYo1SrFEuvkzljiTckYSTJHQqXRKeULkjCd9UrFGKNUqxRrkYRuUkCZMVa5RijVKsUS7+OJWTJHQqJ0n4y4o1SrFGKdYoF1+WhG9KQqdyRxKeSMK/pFijFGuUYo1y8TKVX1LpktCpdEnoVLoknKj8y4o1SrFGKdYo5oNBVE6SMFmxRinWKMUa5eIhlS4JnUqXhE6lS0Kn0iXhJAmdyolKl4Q7VLoknKh0SXhTsUYp1ijFGsV88EUqTyShU+mScKJykoROpUtCp9Il4Q6VkyQ8UaxRijVKsUa5eEilS8JJEu5QOVH5JpU7VP5PxRqlWKMUaxTzwQ+p3JGEE5VvSkKncpKEE5UuCW8q1ijFGqVYo5gPHlDpktCpdEnoVLokdCpdEk5U7khCp3JHEjqVLgmdykkSnijWKMUapVijmA/+MJUuCW9S6ZJwotIl4USlS8ITxRqlWKMUa5SLh1R+KQldEjqVLgknKl0SuiScqNyh8k3FGqVYoxRrlIuXJeFNKnckoVPpktAl4USlS0KXhCeS8KZijVKsUYo1ysWXqdyRhDtUnlDpknCHykkSTlS6JDxRrFGKNUqxRrn445JwotKpdEnoVLokdCpdEp5IwpuKNUqxRinWKBd/nMo3qTyh0iWhU+mS8ESxRinWKMUa5eLLkvBNSThROVE5SUKn0qmcJKFT6ZLwpmKNUqxRijXKxctUfknliSR0Kp3KSRJOVE5UuiQ8UaxRijVKsUYxH6wxijVKsUYp1ijFGqVYoxRrlGKNUqxRijVKsUYp1ijFGqVYoxRrlGKN8h+dsx746sV0YgAAAABJRU5ErkJggg==');
});

app.use((req, res, next) => {
    const error = new Error('Endpoint not found');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message
    });
});

mongoose.connect(environment.env.MONGODB_URI, {
    useNewUrlParser: true
}, (error, result) => {
    if (error) {
        return console.log(error);
    }
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 3000);
});
mongoose.Promise = global.Promise;