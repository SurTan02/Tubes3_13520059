const path = require("path");
const express = require("express");
const history = require("connect-history-api-fallback");
const cors = require("cors");

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
app.post("/api/insert-disease", function (req, res) {
	console.log(req.body);
	res.json({
		message: "wkwk",
	});
});

/**
 * this function will handl the request from front end
 * to check if a person has disease or not
 */

app.post("/api/check-disease", function (req, res) {
	console.log(req.body);
	res.json({
		message: knp(req.body.userGene, req.body.diseaseName),
	});
});

const port = process.env.SERVER_NAME || 8000;
app.listen(port, () => {
	console.log(`Example app listening on port ${port}!`);
});
