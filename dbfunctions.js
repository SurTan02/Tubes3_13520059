/**
 * wrapper function in order to insert new disease
 */
async function insertNewDisease(mongoClient, diseaseName, diseaseGene) {
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
async function insertNewUser(
	mongoClient,
	date,
	name,
	disease,
	isInfected,
	percentage
) {
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
 * The function returns the disease gene.
 * Returns null if there is no such disease in db
 */
async function getDiseaseGene(mongoClient, name) {
	const result = await mongoClient
		.db("myFirstDatabase")
		.collection("disease")
		.findOne({ name: name });
	return result;
}

/**
 * wrapper function in order to get
 * list of user that at a certain date.
 * returns the result in an array.
 * Returns empty array if there is nothing at the date
 */
async function getUserFromDate(mongoClient, date) {
	let result = [];
	const resultCursor = await mongoClient
		.db("myFirstDatabase")
		.collection("user")
		.find({ date: date })
		.forEach((data) => {
			result.push(data);
		});
	return result;
}

/**
 * wrapper function in order to get
 * list of user with the disease name
 * returns the result in an array.
 * Returns empty array if there is no disease in the user
 */
async function getUserFromDisease(mongoClient, diseaseName) {
	let result = [];
	const resultCursor = await mongoClient
		.db("myFirstDatabase")
		.collection("user")
		.find({ disease: diseaseName })
		.forEach((data) => {
			result.push(data);
		});
	return result;
}

/**
 * wrapper fucntion in order to get
 * list of user with both disease name and date
 * returns the result in an array
 * returns empty array if there is no disease checked at the date
 */

async function getUserFromDateAndDisease(mongoClient, date, diseaseName) {
	let result = [];
	const resultCursor = await mongoClient
		.db("myFirstDatabase")
		.collection("user")
		.find({ date: date, disease: diseaseName })
		.forEach((data) => {
			result.push(data);
		});
	return result;
}

module.exports = {
	insertNewDisease: insertNewDisease,
	insertNewUser: insertNewUser,
	getDiseaseGene: getDiseaseGene,
	getUserFromDate: getUserFromDate,
	getUserFromDisease: getUserFromDisease,
	getUserFromDateAndDisease: getUserFromDateAndDisease,
};
