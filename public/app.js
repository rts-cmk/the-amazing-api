const testForm = document.getElementById("apiTestForm")
const output = document.getElementById("output")


testForm.addEventListener("submit", (e) => {
	e.preventDefault()
	const endpoint = e.target.endpoint.value
	console.log(endpoint)
	fetch("http://localhost:4000/api/v1/" + endpoint)
		.then(res => res.json())
		.then(data => {
			output.textContent = JSON.stringify(data, null, 2)
		})
})
