<script>
import axios from "axios";
import BackButton from "./../components/BackButton.vue";

export default {
	data() {
		return {
			geneRegex: /^[ACGT]+$/,
			hasFile: false,
			fileName: "",
			fileError: false,
			diseaseGene: "",
			diseaseName: "",
			diseaseNameSubmitted: "",
			submitted: false,
			fileReader: null,
		};
	},
	components: {
		BackButton,
	},
	methods: {
		/**
		 * method for handling the file and inserting it into
		 * the temporary variable of which it will be used to
		 * submit into the disease database
		 */
		receiveNewDisease(e) {
			let file = e.target.files[0];

			if (file !== null && file !== undefined) {
				this.hasFile = true;
				this.fileName = file.name;
				this.fileError = false;
				this.fileReader.readAsText(file);
			}
		},
		/**
		 * method in order to submit the disease to backend
		 */
		async submitNewDisease() {
			let apiLink = this.$store.state.apiProxy;
			const response = await axios.post(apiLink + "insert-disease", {
				diseaseName: this.diseaseName,
				diseaseGene: this.diseaseGene,
			});
			console.log(response.data.message);
			if (response.data.message) {
				this.submitted = true;
				this.diseaseNameSubmitted = this.diseaseName;
			}
		},
	},
	mounted() {
		if (this.fileReader == null) {
			this.fileReader = new FileReader();

			this.fileReader.onload = () => {
				if (this.geneRegex.test(this.fileReader.result)) {
					this.diseaseGene = this.fileReader.result;
					this.fileError = false;
				} else {
					this.fileError = true;
				}
			};

			this.fileReader.onerror = (error) => {
				console.error(error);
			};
		}
	},
};
</script>

<template>
	<div class="container-fluid">
		<div class="box">
			<div class="row justify-content-start">
				<div class="col-auto">
					<BackButton />
				</div>
			</div>
			<div class="row justify-content-center mt-5">
				<div class="col-6 text-center">
					<div class="heading">Tambahkan Penyakit</div>
				</div>
			</div>
			<div class="row justify-content-center mt-5">
				<div class="col-5 justify-content-center">
					<div class="row justify-content-center">
						<div class="col-auto">Nama Penyakit</div>
					</div>
					<div class="row justify-content-center">
						<div class="col-auto">
							<input
								type="input"
								v-model="diseaseName"
								placeholder="penyakit..."
							/>
						</div>
					</div>
				</div>
				<div class="col-5 justify-content-center">
					<div class="row justify-content-center">
						<div class="col-auto">Sequence DNA</div>
					</div>
					<div class="row justify-content-center">
						<div class="col-auto">
							<input
								type="file"
								ref="file"
								@change="receiveNewDisease"
								style="display: none"
							/>
							<input
								type="button"
								@click="$refs.file.click"
								value="upload file..."
							/>
						</div>
					</div>
					<div class="row justify-content-center">
						<div class="col-auto">
							<div v-if="hasFile">{{ fileName }} uploaded</div>
							<div v-if="fileError">
								The gene you uploaded is wrong
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="submit-button">
				<div class="row justify-content-center mt-5">
					<div class="col-auto justify-content-center">
						<input type="submit" @click="submitNewDisease" />
					</div>
				</div>
			</div>
			<div class="row justify-content-center" v-if="submitted">
				<div class="col-auto justify-content-center">
					Submitted: {{ diseaseNameSubmitted }}
				</div>
			</div>
		</div>
	</div>
</template>

<style>
.heading {
	font-family: "Ibarra Real Nova", sans-serif;
	color: #fff;
	margin: 0;
	font-size: 30px;
	text-shadow: 0.5px 0.5px 2px grey;
	letter-spacing: 1px;
	text-align: center;
	font-weight: bold;
	margin-top: 0;
	margin-bottom: 0.5rem;
	font-weight: 600;
	line-height: 1.2px;
}

.container-fluid {
	font-family: "Ibarra Real Nova", sans-serif;
	margin-top: 100px;
	letter-spacing: 1px;
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
</style>
