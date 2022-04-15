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
 * The function returns the disease gene
 */
async function getDiseaseGene(mongoClient, name) {
	const result = await mongoClient
		.db("myFirstDatabase")
		.collection("disease")
		.findOne({ name: name });
	return result;
}

module.exports = {
	insertNewDisease: insertNewDisease,
	insertNewUser: insertNewUser,
	getDiseaseGene: getDiseaseGene,
};
