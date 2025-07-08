/*****  IMPORTS  *****/
const express = require("express")
const cors = require("cors")
const app = express()

const Blague = require("./models/blague")

const swaggerUI = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc")


/*****  Swagger Init  *****/

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Carambar Blagues API",
      version: "1.0.0",
      description: "Une API simple pour afficher, ajouter ou supprimer des blagues Carambar grâce à une DB"
    },
    servers: [
      {
        url: "https://carambar-back-akss.onrender.com"
      }
    ],
  },
  apis: ["./index.js"]
}

const specs = swaggerJsDoc(options)

/**
 * @swagger
 * components:
 *  schemas:
 *    Blague:
 *      type: object
 *      required:
 *        - question
 *        - reponse
 *      properties:
 *        id:
 *          type: number
 *          description: Identifiant unique auto-généré
 *        question:
 *          type: string
 *          description: Première partie de la blague
 *        reponse:
 *          type: string
 *          description: Deuxième partie de la blague
 *      example:
 *        id: 1
 *        question: Quelle est la femelle du hamster ?
 *        reponse: L'amsterdam
*/

/**
 * @swagger
 * tags:
 *  name: Blagues
 *  description: Section Blagues
 */


/*****  Main  *****/

app.use(cors())
app.use(express.json())
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))


/**
 * @swagger
 * /blagues:
 *  post:
 *    summary: Ajoute une nouvelle blague dans la DB
 *    tags: [Blagues]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - question
 *              - reponse
 *            properties:
 *              question:
 *                type: string
 *                description: Première partie de la blague
 *              reponse:
 *                type: string
 *                description: Deuxième partie de la blague
 *    responses:
 *      200:
 *        description: Blague ajoutée
*/

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


/**
 * @swagger
 * /blagues:
 *   get:
 *     summary: Retourne toutes les blagues de la DB
 *     tags: [Blagues]
 *     responses:
 *       200:
 *         description: Liste des blagues
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blague'
 *       404:
 *         description: La blague n'a pas été trouvée
 *       500:
 *         description: Erreur serveur
*/

app.get('/blagues', function(request, response) {
  try {
    Blague.findAll().then((blagues) => {
      response.json(blagues)
    })
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
})


/**
 * @swagger
 * /blagues/random:
 *   get:
 *     summary: Retourne une blague aléatoire
 *     tags: [Blagues]
 *     responses:
 *       200:
 *         description: Affiche une blague aléatoire
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blague'
 *       404:
 *         description: La blague n'a pas été trouvée
 *       500:
 *         description: Erreur serveur
*/

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


/**
 * @swagger
 * /blagues/{id}:
 *   get:
 *     summary: Retourne une blague précise grâce à son id
 *     tags: [Blagues]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *        required: true
 *        description: L'identifiant de la blague
 *     responses:
 *       200:
 *         description: Affiche une blague précise
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blague'
 *       404:
 *        description: La blague n'a pas été trouvée
 *       500:
 *        description: Erreur serveur
*/

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


/**
 * @swagger
 * /blagues/{id}:
 *   delete:
 *     summary: Supprime une blague précise grâce à son id
 *     tags: [Blagues]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *        required: true
 *        description: L'identifiant de la blague
 *     responses:
 *       200:
 *         description: Blague supprimée
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blague'
 *       404:
 *        description: La blague n'a pas été trouvée
 *       500:
 *        description: Erreur serveur
*/

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