const path = require("path");
const express = require("express");
const history = require("connect-history-api-fallback");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const {
	insertNewDisease,
	insertNewUser,
	getDiseaseGene,
} = require("./dbfunctions.js");

require("dotenv").config();

/**
 * this variable will be used to connect to mongoDB
 * It will be initialized in the .listen function
 */
var mongoClient;

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
	result = {
		isInfected: false,
		percentage: 0,
	};

	if (diseasePrediction === "tifus") {
		result.isInfected = false;
		result.percentage = 10;
	}
	if (diseasePrediction === "hiv") {
		result.isInfected = false;
		result.percentage = 40;
	}
	if (diseasePrediction == "covid") {
		result.isInfected = true;
		result.percentage = 90;
	}

	return result;
};

/**
 * this function will handle the POST request
 * sent by the front end and insert the disease
 * into the database
 */
app.post("/api/insert-disease", async function (req, res) {
	let result = await insertNewDisease(
		mongoClient,
		req.body.diseaseName,
		req.body.diseaseGene
	);
	res.json({
		message: true,
	});
});

/**
 * this function will handl the request from front end
 * to check if a person has disease or not.
 * The response received by this function is in json
 * in the form of
 * {
 * date mengandung tanggal pengecekkan
 * userGene mengandung string genetic
 * username mengandung nama pengecek
 * diseaseName mengandung nama disease
 * }
 * yang diakses dengan cara
 * req.body.userGene, req.body.username, req.body.diseaseName, req.body.date
 */

app.post("/api/check-disease", async function (req, res) {
	let data = req.body;
	let result = await getDiseaseGene(mongoClient, data.diseaseName);
	if (result) {
		console.log(result);
	}
	let knpResult = knp(data.userGene, data.diseaseName);
	insertNewUser(
		mongoClient,
		data.date,
		data.username,
		data.disease,
		knpResult.isInfected,
		knpResult.percentage
	);
	res.json({
		isInfected: knpResult.isInfected,
		percentage: knpResult.percentage,
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
