<template>
	<div class="container-fluid">
		<div class="box">
			<div class="row justify-content-center mt-5 mb-5">
				<div class="col-5 text-center">
					<div class="heading">DNAsaurus</div>
				</div>
			</div>
			<div class="row justify-content-center">
				<div class="col-auto justify-content-center">
					<router-link class="col" to="/insert-disease"
						>Insert Disease</router-link
					>
				</div>
			</div>
			<div class="row justify-content-center">
				<div class="col-auto justify-content-center">
					<router-link class="col" to="/check-disease"
						>Check Disease</router-link
					>
				</div>
			</div>
			<div class="row justify-content-center">
				<div class="col-auto justify-content-center">
					<router-link class="col" to="/list-disease"
						>List Disease</router-link
					>
				</div>
			</div>
			<div class="row justify-content-center mt-5">
				<div class="col-5 text-center">
					<div class="footer">nama-nim</div>
				</div>
			</div>
			<div class="row justify-content-center mt-4">
				<div class="col-5 text-center">
					<div class="footer">nama-nim</div>
				</div>
			</div>
			<div class="row justify-content-center mt-4">
				<div class="col-5 text-center">
					<div class="footer">nama-nim</div>
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

.footer {
	font-family: "Ibarra Real Nova", sans-serif;
	color: #fff;
	margin: 0;
	font-size: 20px;
	text-shadow: 0.5px 0.5px 2px grey;
	text-align: center;
	font-weight: bold;
	margin-top: 3px;
	margin-bottom: 0.5rem;
	font-weight: 500;
	line-height: 1.2px;
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

.col:link {
	color: #224cbd;
	text-decoration: none;
}

.col:visited {
	color: #224cbd;
}
.col:hover {
	color: rgb(145, 42, 241);
	font-weight: 600;
}
</style>
