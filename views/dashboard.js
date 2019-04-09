const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const mongoose = require('mongoose');
const mongoClient = require('mongodb').MongoClient;

const https = require('https');
const fs = require('fs');


const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem');

const options = {
    key: sslkey,
    cert: sslcert
};

const app = express();
var imageData = []

//Selain osaa accessaa tätä kansiota
app.use(express.static('views'));
app.use('/upload-images', express.static('upload-images'));

connectToDatabase()
fetchImages()

//Connectaa databaseen
function connectToDatabase() {
    mongoose.connect('mongodb://localhost/week1images');

    mongoose.connection.once('open',function () {
        console.log('connection has been made');
    }).on('error',function (error) {
        console.log(error)
    });
}



//Pohja upload-schemalle
const Schema = mongoose.Schema;
const formSchema = new Schema({
    category: String,
    title: String,
    description: String,
    imagePath: String,
    thumbnailPath: String,
    coordinates: {
        latitude: String,
        longitude: String
    }
});
const Demo = mongoose.model('Demo', formSchema);

//Kuvapolku kondikseen
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload-images/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + file.originalname);
    }
});

//Upload-setit valueen nimeltä upload
const upload = multer({storage: imageStorage});


//Post-methodi kuvan uploadaamiselle
app.post('/upload', upload.single('image'),(req, res, next) => {
    console.log(req.body);
    connectToDatabase()
    next();
});

//Thumbnaili
app.use('/upload', (req, res) => {
    const body = req.body;
    const file = req.file;
    sharp(file.path).resize(350,350).toFile(file.destination + 'thumbnail/' + file.filename, (err) => {
        if (err === !null) {
            console.log(err);
        }
    });

//Tehään schema joka lähetetään databaselle
    const uploadSchema = {
        category: body.category,
        title: body.title,
        description: body.description,
        imagePath: file.path,
        thumbnailPath: file.destination + 'thumbnail/' + file.filename,
        coordinates: {
            latitude: body.latitude,
            longitude: body.longitude
        }
    };
    Demo.create(uploadSchema).then( () => {
        console.log(uploadSchema.toString())
    });

    fetchImages()
    connectToDatabase()
    res.redirect('/');
});

//Noudetaan kuvapolut databasesta
function fetchImages() {
    imageData = [];
    mongoClient.connect('mongodb://localhost/week1images', (err, client) => {
        if (err) console.log(err);

        const db = client.db('week1images');

        db.collection('demos').find({}).toArray((err, data) => {
            if (err) console.log(err)
            else {
                data.forEach(
                    (doc) => {
                        //console.log(doc)
                        if (!imageData.includes(doc)) {
                            imageData.push(doc);
                        }
                    }
                );
                console.log(imageData);

            }
        });
    });
}

//Lähetetään kuvien tiedostosijainnit servulta fronttiin
app.get('/photos', (req, res) => {
    res.send(imageData)
});

//Poistetaan kuva
app.get('/delete/:id', (req, res) => {
    Demo.findByIdAndDelete({_id: req.params.id}, (err) => {
        if (err) console.log(err);
    });
    connectToDatabase();
    fetchImages();
    res.redirect('/');
});

//Updatetaan kuva




https.createServer(options, app).listen(3000);