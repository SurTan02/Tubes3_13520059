const path = require("path");
const express = require("express");
const history = require("connect-history-api-fallback");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const dbfunction = require("./dbfunctions.js");
const { kmp } = require("./kmp.js");
const { bm } = require("./boyerMoore.js");

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

/**
 * calculate the table in order to be used for
 * the KMP algorithm.
 * The function returns an array containing the values in the table
 */
// function computeTable(param) {
// 	let result = [];
// 	let pos = 2;
// 	let cnd = 0;

// 	result[0] = -1;
// 	result[1] = 0;

// 	while(pos < param.length) {
// 		if(param[pos - 1] == param[cnd]) {
// 			cnd += 1;
// 			result[pos] = cnd;
// 			pos += 1;
// 		} else if(cnd > 0) {
// 			cnd = result[cnd];
// 		} else {
// 			result[pos] = 0;
// 			pos += 1;
// 		}
// 	}

// 	return result;
// }

/**
 * the KMP algorithm
 * returns -1 if the string aren't the same
 * returns 0 if the strings are the same
 */
// function kmp(userGene, diseaseGene) {
// 	let ind = -1;
// 	let m = 0;
// 	let i = 0;
// 	let table = computeTable(diseaseGene);

// 	while(m + i < diseaseGene.length) {
// 		if(diseaseGene[i] == userGene[m+i]) {
// 			if(i == diseaseGene.length - 1) {
// 				return m;
// 			}
// 			i += 1;
// 		} else {
// 			m += i - table[i];
// 			if(table[i] > -1) {
// 				i = table[i];
// 			} else {
// 				i = 0;
// 			}
// 		}
// 	}

// 	return ind;
// }

// function hamming(userGenetic, diseaseGenetic) {
// 	let i = 0;
// 	let same = 0;
// 	while(i < diseaseGenetic.length) {
// 		if(userGenetic[i] == diseaseGenetic[i]) {
// 			same += 1;
// 		}
// 		i += 1;
// 	}
// 	let percent = same / userGenetic.length;
// 	percent *= 100;
// 	percent = percent.toFixed(3);
// 	return percent;
// }

/**
 * str2.length < str1.length
 */

function getMatch(str1, str2) {
	let result = 0;
	for (let i = 0; i < str2.length; ++i) {
		if (str1[i] === str2[i]) {
			result += 1;
		}
	}
	return result;
}

function hamming(str1, str2) {
	let index = 0;
	let strLen = str2.length;
	let matchNum = 0;
	while (matchNum !== strLen && index + strLen <= str1.length) {
		let temp = getMatch(str1.substring(index, index + strLen), str2);
		if (temp > matchNum) {
			matchNum = temp;
		}
		index++;
	}

	return (matchNum * 100) / strLen;
}

/**
 * this function will handle the POST request
 * sent by the front end and insert the disease
 * into the database
 */
app.post("/api/insert-disease", async function (req, res) {
	let result = await dbfunction.insertNewDisease(
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
	let disease = await dbfunction.getDiseaseGene(
		mongoClient,
		data.diseaseName
	);
	let isInfected = null;
	let percentage = null;
	if (disease) {
		if (kmp(data.userGene, disease.gene) !== -1) {
			isInfected = true;
		} else {
			isInfected = false;
		}
		// if(bm(data.userGene, disease.geme) !== -1) {
		// 	isInfected = true;
		// } else {
		// 	isInfected = false;
		// }
		if (isInfected) {
			percentage = 100;
		} else {
			percentage = hamming(data.userGene, disease.gene);
			if (percentage > 80) {
				isInfected = true;
			}
		}
		dbfunction.insertNewUser(
			mongoClient,
			data.date,
			data.username,
			data.diseaseName,
			isInfected,
			percentage
		);
	}
	res.json({
		isInfected: isInfected,
		percentage: percentage,
	});
});

/**
 * this function will handle the request from front end to
 * get list of the checks that has happened at a particular date
 * or on a specific virus name or both.
 * access the finding stuff using req.body.message
 */

app.post("/api/list-disease", async function (req, res) {
	let data = req.body;
	/**
	 * the request from front end is separated to different types as
	 * specified by the specification for the three methods of input
	 */
	let result;
	if (data.type == "date") {
		result = await dbfunction.getUserFromDate(mongoClient, data.message);
	} else if (data.type == "disease") {
		result = await dbfunction.getUserFromDisease(mongoClient, data.message);
		/**
		 * get data from both date and disease
		 * using set to make sure that we do not have duplicate
		 */
	} else if (data.type == "both") {
		let splitMessage = data.message.split(" ");
		let dateStr =
			splitMessage[0] + " " + splitMessage[1] + " " + splitMessage[2];
		let diseaseStr = splitMessage[3];

		result = await dbfunction.getUserFromDateAndDisease(
			mongoClient,
			dateStr,
			diseaseStr
		);
	}

	let hasResult = false;

	if (result != null) {
		console.log("has result");
		hasResult = true;
	}
	res.json({
		hasResult: hasResult,
		userArr: result,
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
