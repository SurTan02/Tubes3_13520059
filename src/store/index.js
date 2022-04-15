import { createStore } from "vuex";

export default createStore({
	state: {
		apiProxy: "http://localhost:8000/api/",
		monthNames: [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		],
	},
	getters: {},
	mutations: {},
	actions: {},
	modules: {},
});
