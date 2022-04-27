<script>
import axios from "axios";
import ListDisease from "./../components/ListDisease.vue";
import BackButton from "./../components/BackButton.vue";

export default {
	data() {
		return {
			receiveInputFunc: undefined,
			userInput: "",
			userArr: [],
			noData: true,
			dateRegex:
				/(\d{1,2}\s((January)|(February)|(March)|(April)|(May)|(June)|(July)|(August)|(September)|(October)|(November)|(December)).*\d{1,4})/,
			diseaseRegex: /[A-Za-z0-9].*/,
			combinedRegex:
				/(\d{1,2}\s((January)|(February)|(March)|(April)|(May)|(June)|(July)|(August)|(September)|(October)|(November)|(December)).*\d{1,4})\s*([A-Za-z0-9].*)/,
		};
	},
	components: {
		ListDisease,
		BackButton,
	},
	mounted() {
		/**
		 * setting up the function to ask data from backend
		 * only 1 seconds after user has stopped typing
		 */
		const debounce = (func, delay) => {
			let timerId;
			return function () {
				clearTimeout(timerId);
				timerId = setTimeout(() => func.apply(this, arguments), delay);
			};
		};

		this.receiveInputFunc = debounce(async () => {
			let apiLink = this.$store.state.apiProxy;

			// let inputType = "";
			// if (isBoth) {
			// 	inputType = "both";
			// } else if (isDate) {
			// 	inputType = "date";
			// } else if (isDisease) {
			// 	inputType = "disease";
			// } else {
			// 	return;
			// }
			const response = await axios.post(apiLink + "list-disease", {
				message: this.userInput,
			});

			if (response.data.hasResult) {
				console.log(response.data.userArr);
				this.userArr = response.data.userArr;
				if (this.userArr.length === 0) {
					this.noData = true;
				} else {
					this.noData = false;
				}
			} else {
				this.userArr = [];
				this.noData = true;
			}
		}, 200);
	},
	methods: {
		callFunc() {
			this.receiveInputFunc();
		},
	},
};
</script>

<template>
	<div class="container-fluid">
		<div class="result-box">
			<!-- <div class='row justify-content-start'>
				<div class='col-auto'>
					<BackButton />
				</div>
			</div> -->
			<div class="sticky">
				<div class="row">
					<div class="row justify-content-start">
						<div class="col-auto">
							<BackButton />
						</div>
					</div>
					<div class="col-auto">
						<div class="input">
							<input
								type="text"
								placeholder="<tanggal_prediksi> <nama_penyakit>"
								v-model="userInput"
								@input="callFunc"
							/>
						</div>
					</div>
				</div>
			</div>
			<div class="tambal">
				<div class="row justify-content-center mt-5" v-if="noData">
					<div class="no-file-head row justify-content-center mt-3">
						No Result Found
					</div>
					<div class="no-file-body row justify-content-center mt-2">
						Maybe fill the search bar or
					</div>
					<div class="no-file-body row justify-content-center">
						try a different keyword
					</div>
				</div>
				<div
					class="row justify-content-center mt-5"
					v-for="(user, index) in userArr"
					:key="index"
				>
					<div class="col-auto justify-content-center">
						<ListDisease>
							{{ index + 1 }}. {{ user.date }} - {{ user.name }} -
							{{ user.disease }} - {{ user.isInfected }} -
							{{ user.percentage }}%
						</ListDisease>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style>
.input input {
	width: 400px;
	text-align: center;
	vertical-align: middle;
	border-radius: 50px;
	/* margin: 0;
	top: 50%;
	position: absolute;
	-ms-transform: translateY(-50%);
	transform: translateY(-50%); */
}

.input {
	position: absolute;
	left: 50%;
	top: 50%;
	-webkit-transform: translate(-50%, -50%);
	transform: translate(-50%, -50%);
}

.result-box {
	height: 100px;
	width: 100px;
	overflow-y: scroll;
	overflow-x: hidden;
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
	margin-left: auto;
	margin-right: auto;
	margin-top: auto;
	margin-bottom: auto;
}

::-webkit-scrollbar {
	width: 0px;
}

::-webkit-scrollbar-track {
	background-color: transparent;

	/* background-color: #d6dee1;
	border-radius: 20px;
	border: 6px solid transparent;
	background-clip: content-box; */
}

::-webkit-scrollbar-thumb {
	/* background: linear-gradient(#d0fc89, #24bfc2); */
	background: rgb(175, 175, 175);
	background: none;
	border-radius: 20px;
	border: 6px solid transparent;
	background-clip: content-box;
}

/* ::-webkit-scrollbar-thumb:hover {
	background-color: rgb(150, 150, 150);
} */

.sticky {
	height: 100px;
	width: 100px;
	overflow-y: hidden;
	overflow-x: hidden;
	/* position: relative; */
	width: 700px;
	height: 60px;
	/* top: 50%;
	left: 50%;
	width: 400px;
	height: 400px;
	margin-top: -200px;
	margin-left: -200px; */
	background: rgba(255, 255, 255, 0.25);
	-webkit-box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
	box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	border-radius: 10px;
	border: 1px solid rgba(255, 255, 255, 0.18);
	/* justify-content: center; */
	/* top: 0;
	bottom: 0;
	left: 0;
	right: 0; */
	margin: auto;
	position: sticky;
	top: 0px;
}

.tambal {
	height: 100%;
	overflow: scroll;
}

.no-file-head {
	color: #504e4e;
	font-size: larger;
	font-weight: 600;
}

.no-file-body {
	/* color: #878787; */
	color: #504e4ea7;
}
</style>
