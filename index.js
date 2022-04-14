const path = require("path");
const express = require("express");
const history = require("connect-history-api-fallback");
const cors = require("cors");
const { MongoClient } = require("mongodb");

require("dotenv").config();

/**
 * this variable will be used to connect to mongoDB
 * It will be initialized in the .listen function
 */
var mongoClient;

/**
 * wrapper function in order to insert new disease
 */
async function insertNewDisease(diseaseName, diseaseGene) {
	const result = await mongoClient
		.db("myFirstDatabase")
		.collection("disease")
		.insertOne({
			name: diseaseName,
			gene: diseaseGene,
		});
	return result;
}

/**
 * wrapper function in order to
 * insert new user into db with the following data:
 * date, name, disease, isinfected, percentage
 */
async function insertNewUser(date, name, disease, isInfected, percentage) {
	const result = await mongoClient
		.db("myFirstDatabase")
		.collection("user")
		.insertOne({
			date: date,
			name: name,
			disease: disease,
			isInfected: isInfected,
			percentage: percentage,
		});
	return result;
}

/**
 * wrapper function in order to get
 * list disease with the name x.
 * The function returns array of strings with the disease gene
 */
async function getDiseaseGene(name) {
	const result = await mongoClient
		.db("myFirstDatabase")
		.collection("disease")
		.findOne({ name: name });
	return result;
}

const app = express();

const staticFileMiddleware = express.static(path.join(__dirname, "dist"));

/**
 * setting up the middlewares that
 * expressjs uses
 */

app.use(express.json());
app.use(cors());
app.use(staticFileMiddleware);
app.use(
	history({
		disableDotRule: true,
		verbose: true,
	})
);
app.use(staticFileMiddleware);

let knp = (userGenetic, diseasePrediction) => {
	// userGenetic bisa langsung diolah, karena udah dibaca
	// mis file yang diupload adalah test1.txt
	// dan, isi test1.txt adalah ADGC
	// maka userGenetic = ADGC

	// untuk diseasePrediction nanti harus di connect ke db dulu
	// untuk baca DNA sesuai dengan prediksi penyakit yang
	// diinput user

	return {
		hasDisease: true,
		percentage: 70,
	};
};

/**
 * this function will handle the POST request
 * sent by the front end and insert the disease
 * into the database
 */
app.post("/api/insert-disease", async function (req, res) {
	let result = await insertNewDisease(
		req.body.diseaseName,
		req.body.diseaseGene
	);
	res.json({
		message: true,
	});
});

/**
 * this function will handl the request from front end
 * to check if a person has disease or not
 */

app.post("/api/check-disease", async function (req, res) {
	let result = await getDiseaseGene(req.body.diseaseName);
	if (result) {
		console.log(result);
	}
	res.json({
		message: knp(req.body.userGene, req.body.diseaseName),
	});
});

const port = process.env.PORT || 8000;
app.listen(port, async () => {
	console.log(`Example app listening on port ${port}!`);
	try {
		mongoClient = new MongoClient(process.env.MONGO_KEY);
		await mongoClient.connect();
	} catch (e) {
		console.error(e);
	}
});
