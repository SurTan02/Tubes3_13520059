<script>
import ListDisease from "./../components/ListDisease.vue";

export default {
	data() {
		return {
			receiveInputFunc: undefined,
		};
	},
	components: {
		ListDisease,
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

		this.receiveInputFunc = debounce(() => {}, 1000);
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
		<div class="row justify-content-center">
			<div class="col-auto justify-content-center">
				<div class="input">
					<input
						type="text"
						placeholder="<tanggal_prediksi> <nama_penyakit>"
						@input="callFunc"
					/>
				</div>
			</div>
		</div>
		<div
			class="row justify-content-center mt-5"
			v-for="index in 10"
			:key="index"
		>
			<div class="col-auto justify-content-center">
				<ListDisease> Hello </ListDisease>
			</div>
		</div>
	</div>
</template>

<style>
.input input {
	width: 400px;
	text-align: center;
}
</style>
