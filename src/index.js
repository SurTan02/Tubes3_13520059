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

geneRegex = /^[ACGT]+$/;
diseaseNameRegex = /[A-Za-z0-9].*/;
dateRegex =
	/(\d{1,2}\s((January)|(February)|(March)|(April)|(May)|(June)|(July)|(August)|(September)|(October)|(November)|(December)).*\d{1,4})/;
combinedRegex =
	/(\d{1,2}\s((January)|(February)|(March)|(April)|(May)|(June)|(July)|(August)|(September)|(October)|(November)|(December)).*\d{1,4})\s*([A-Za-z0-9].*)/;

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

/**
 * this function checks for similiarity between two strings
 * and returns a percentage.
 * str2.length < str1.length
 */
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
 * this function returns a percentage
 * in similiarity between two strings
 * str2.length < str1.length
 */
function autocomplete(str1, str2) {
	let idx = 0;
	for (let i = 0; i < str2.length; ++i) {
		if (str1[i] !== str2[i]) {
			break;
		}
		idx++;
	}
	return (idx * 100) / str1.length;
}

/**
 * this function will handle the POST request
 * sent by the front end and insert the disease
 * into the database
 */
app.post("/api/insert-disease", async function (req, res) {
	if (geneRegex.test(req.body.diseaseGene)) {
		let result = await dbfunction.insertNewDisease(
			mongoClient,
			req.body.diseaseName,
			req.body.diseaseGene
		);
		res.json({
			message: true,
		});
	} else {
		res.json({
			message: false,
		});
	}
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
	if (geneRegex.test(data.userGene)) {
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
			//  isInfected = true;
			// } else {
			//  isInfected = false;
			// }
			if (isInfected) {
				percentage = 100;
			} else {
				percentage = hamming(data.userGene, disease.gene);
				if (percentage >= 80) {
					isInfected = true;
				}
			}
			percentage = percentage.toFixed(4);
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
			error: false,
		});
	} else {
		res.json({
			isInfected: null,
			percentage: null,
			error: true,
		});
	}
});

/**
 * this function will handle the request from front end to
 * get list of the checks that has happened at a particular date
 * or on a specific virus name or both.
 * access the finding stuff using req.body.message
 */

app.post("/api/list-disease", async function (req, res) {
	let data = req.body;
	let type;
	if (diseaseNameRegex.test(data.message)) {
		type = "disease";
	}
	if (dateRegex.test(data.message)) {
		type = "date";
	}
	if (isNaN(data.message[data.message.length - 1])) {
		if (combinedRegex.test(data.message)) {
			type = "both";
		}
	}
	/**
	 * the request from front end is separated to different types as
	 * specified by the specification for the three methods of input
	 */
	let result;
	if (type == "date") {
		result = await dbfunction.getUserFromDate(mongoClient, data.message);
	} else if (type == "disease") {
		// result = await dbfunction.getUserFromDisease(mongoClient, data.message);
		result = [];
		let userInput = data.message;
		let tempArr = await dbfunction.getUser(mongoClient);
		for (let i = 0; i < tempArr.length; ++i) {
			let temp = tempArr[i];
			let shorter;
			let longer;
			if (userInput.length <= temp.disease.length) {
				shorter = userInput;
				longer = temp.disease;
			} else {
				shorter = temp.disease;
				longer = userInput;
			}

			console.log(longer, shorter, autocomplete(longer, shorter));
			if (autocomplete(longer, shorter) >= 80) {
				result.push(temp);
			}
		}
		/**
		 * get data from both date and disease
		 * using set to make sure that we do not have duplicate
		 */
	} else if (type == "both") {
		result = [];
		let splitMessage = data.message.split(" ");
		let dateStr =
			splitMessage[0] + " " + splitMessage[1] + " " + splitMessage[2];
		let diseaseStr = splitMessage[3];
		let tempArr = await dbfunction.getUser(mongoClient);
		for (let i = 0; i < tempArr.length; ++i) {
			let temp = tempArr[i];
			if (dateStr === temp.date) {
				let shorter;
				let longer;
				if (diseaseStr.length <= temp.disease.length) {
					shorter = diseaseStr;
					longer = temp.disease;
				} else {
					shorter = temp.disease;
					longer = diseaseStr;
				}

				if (autocomplete(longer, shorter) >= 80) {
					result.push(temp);
				}
			}
		}
		// let splitMessage = data.message.split(" ");
		// let dateStr =
		//  splitMessage[0] + " " + splitMessage[1] + " " + splitMessage[2];
		// let diseaseStr = splitMessage[3];

		// result = await dbfunction.getUserFromDateAndDisease(
		//  mongoClient,
		//  dateStr,
		//  diseaseStr
		// );
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
