const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs')
let storedNotes;
let parsedNotes = require('./db/db.json')
let createNote
const notesArray = []
const {v4 : uuidv4} = require('uuid')

const PORT = process.env.port || 3001;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
})

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'))
})

app.get("/api/notes", (req, res) => {

  storedNotes = fs.readFile("./db/db.json", 'utf-8', (err, data) => {
    if (err) {
      console.log(err)
     res.json(err)
    } else{
      parsedNotes = JSON.parse(data)
      res.json(parsedNotes)
    }

  });
  


 });
 
 app.post('/api/notes/', (req, res) => {
  console.log(req.body)
   if (req.body.title && req.body.text) {
     createNote = {
       title: req.body.title,
       text: req.body.text,
       id: uuidv4()
     }
     parsedNotes.push(createNote);
   fs.writeFile('./db/db.json', JSON.stringify(parsedNotes), err => {
     if (err) {
       res.status(500).json(parsedNotes)
     }
     else {
       res.status(200).json(parsedNotes)
     }
   })
   } else {
   res.json("Please enter title and text.")
  }
   })


   app.delete('/api/notes/:id', (req, res) => {
     let id = req.params.id;
     
     fs.readFile("./db/db.json", 'utf-8', (err, data) => {
      if (err) {
        console.log(err)
       res.json(err)
      } else{
        parsedNotes = JSON.parse(data)
      }
     })

     const filteredNotes = parsedNotes.filter(note => {
       note.id !== id 
     })
     fs.writeFile("db/db.json", JSON.stringify(filteredNotes), (err, data) => {
      console.error(err);
     })

   }) 

app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);