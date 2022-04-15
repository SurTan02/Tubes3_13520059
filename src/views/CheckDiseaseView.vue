<script>
import axios from "axios";

export default {
	data() {
		return {
			userGene: "",
			username: "",
			diseaseName: "",
			hasResult: false,
			date: undefined,
			isInfected: false,
			precentage: 0,
		};
	},
	methods: {
		receiveUserGene(e) {
			let file = e.target.files[0];

			let reader = new FileReader();

			reader.onload = () => {
				this.userGene = reader.result;
			};

			reader.readAsText(file);
		},
		/**
		 * method in order to pass the data to backend
		 */
		async submitCheckDisease() {
			let apiLink = this.$store.state.apiProxy;
			let monthNames = this.$store.state.monthNames;

			let dateObj = new Date();

			this.date =
				dateObj.getDate() +
				" " +
				monthNames[dateObj.getMonth()] +
				" " +
				dateObj.getFullYear();

			const response = await axios.post(apiLink + "check-disease", {
				date: this.date,
				userGene: this.userGene,
				username: this.username,
				diseaseName: this.diseaseName,
			});

			this.hasResult = true;

			console.log(response);

			this.isInfected = response.data.isInfected;
			this.percentage = response.data.percentage;
		},
	},
};
</script>

<template>
	<div class="container-fluid">
		<div class="box">
			<div class="row justify-content-center mt-5">
				<div class="col-5 text-center">
					<div class="heading">Tes DNA</div>
				</div>
			</div>
			<div class="row justify-content-center mt-5">
				<div class="col-4 justify-content-center">
					<div class="row justify-content-center">
						<div class="col-auto">Nama Pengguna</div>
					</div>
					<div class="row justify-content-center">
						<div class="col-auto">
							<input
								type="text"
								v-model="username"
								placeholder="<pengguna>"
							/>
						</div>
					</div>
				</div>
				<div class="col-4 justify-content-center">
					<div class="row justify-content-center">
						<div class="col-auto">Sequence DNA</div>
					</div>
					<div class="row justify-content-center">
						<div class="col-auto">
							<input
								type="file"
								ref="file"
								@change="receiveUserGene"
								style="display: none"
							/>
							<input
								type="button"
								@click="$refs.file.click"
								value="upload file..."
							/>
						</div>
					</div>
				</div>
				<div class="col-4 justify-content-center">
					<div class="row justify-content-center">
						<div class="col-auto">Prediksi Penyakit</div>
					</div>
					<div class="row justify-content-center">
						<div class="col-auto">
							<input
								type="text"
								v-model="diseaseName"
								placeholder="<penyakit>"
							/>
						</div>
					</div>
				</div>
			</div>
			<div class="submit-button">
				<div class="row justify-content-center mt-5">
					<div class="col-auto">
						<input type="submit" @click="submitCheckDisease" />
					</div>
				</div>
			</div>
			<div class="row justify-content-center">
				<div class="col-auto justify-content-center" v-if="hasResult">
					{{ date }} - {{ username }} - {{ diseaseName }} -
					{{ percentage }}% - {{ isInfected }}
				</div>
			</div>
		</div>
	</div>
</template>

<style>
h1 {
	font-family: "Ibarra Real Nova", sans-serif;
	color: black;
	margin: 0;
	font-size: 44px;
	text-shadow: 0.5px 0.5px 2px grey;
	letter-spacing: 1px;
	text-align: center;
	font-weight: 700;
}

h2 {
	font-family: "Ibarra Real Nova", sans-serif;
	color: #fff;
	margin: 0;
	font-size: 44px;
	text-shadow: 0.5px 0.5px 2px grey;
	letter-spacing: 3px;
	text-align: center;
	font-weight: 700;
}

.container-fluid {
	font-family: "Ibarra Real Nova", sans-serif;
	margin-top: 100px;
	letter-spacing: 1px;
}

.container-fluid input {
	text-align: center;
}

.submit-button input {
	border: none;
	background-color: transparent;
	font-family: inherit;
	padding: 0;
	cursor: pointer;
	background-color: #446cf6;
	color: #fff;
	border-radius: 8px;
	box-shadow: 0 3px 5px rgba(0, 0, 0, 0.18);
	width: 200px;
	padding: 0.25em 0.75em;
	min-width: 10ch;
	min-height: 35px;
}

.submit-button input:hover {
	background-color: #2443b3;
}

body {
	font-family: "Ibarra Real Nova", sans-serif;
	padding: 0;
	margin: 0;
	background: linear-gradient(
			to right,
			rgba(75, 123, 211, 0.5),
			rgba(22, 215, 177, 0.3)
		),
		url(../assets/colorful.jpg);
	background-size: cover;
	background-repeat: no-repeat;
	background-attachment: fixed;
}

.box {
	position: absolute;
	width: 700px;
	height: 350px;
	/* top: 50%;
	left: 50%;
	width: 400px;
	height: 400px;
	margin-top: -200px;
	margin-left: -200px; */
	background: rgba(255, 255, 255, 0.25);
	-webkit-box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
	box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border-radius: 10px;
	border: 1px solid rgba(255, 255, 255, 0.18);
	/* justify-content: center; */
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	margin: auto;
}
</style>
