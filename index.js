/*****  IMPORTS  *****/
const express = require("express")
const cors = require("cors")
const app = express()

const Blague = require("./models/blague")


/*****  Main  *****/

app.use(cors())
app.use(express.json())

app.post('/blagues', async (request, response) => {
  try {
    const { question, reponse } = request.body

    if (!question || !reponse) {
      return response.status(400).json({ error: "Missing question or answer" });
    }

    const nouvBlague = await Blague.create({question, reponse})
    response.status(201).json(nouvBlague)

  } catch (error) {
    console.error("Error creating blague:", error)
    response.status(500).json({ error: "Server Error" })
  }
})

app.get('/blagues', function(request, response) {
  Blague.findAll().then((blagues) => {
    response.json(blagues)
  })
})

app.get('/blagues/random', async (request, response) => {
  try {
    const count = await Blague.count();
    if (count === 0) return response.status(404).json({ error: 'No blagues in DB' });

    const randomOffset = Math.floor(Math.random() * count);

    const blagues = await Blague.findAll({ limit: 1, offset: randomOffset });
    const blague = blagues[0];

    response.json(blague);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
});

app.get('/blagues/:id', async (request, response) => {
  try {
    const id = request.params.id;
    const blague = await Blague.findByPk(id);

    if (!blague) {
      return response.status(404).json({ error: "Blague not found" });
    }
    response.json(blague);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Server error" });
  }
})

app.delete('/blagues/:id', async (request, response) => {
  try {
    const id = request.params.id;
    const blague = await Blague.findByPk(id);

    if (!blague) {
      return response.status(404).json({ error: "Blague not found" });
    }
    blague.destroy();
    response.status(200).json({ "message": "Blague deleted successfully." });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Server error" });
  }
})


app.listen(3000)