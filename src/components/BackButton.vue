<script>
export default {
	methods: {
		backButton() {
			this.$router.push({
				path: "/",
			});
		},
	},
};
</script>

<template>
	<button @click="backButton" class="previous round">
		&#8249;&#8249;&#8249;
	</button>
</template>

<style>
.previous {
	background-color: transparent;
	color: black;
	border: none;
	width: 30px;
	height: 30px;
	font-size: 30px;
	margin-left: 20px;
	margin-top: 2px;
}

.previous:hover {
	color: rgb(145, 42, 241);
	font-weight: bold;
}

.round {
	border-radius: 50%;
}
</style>
