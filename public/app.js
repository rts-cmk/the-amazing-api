const testForm = document.getElementById("apiTestForm")
const output = document.getElementById("output")
const endpointDisplay = document.getElementById("endpoint")
const absoluteLink = document.getElementById("absoluteLink")

testForm.addEventListener("submit", (e) => {
	e.preventDefault()
	const endpoint = e.target.endpoint.value
	endpointDisplay.innerText = e.target.endpoint.value
	const url = "http://localhost:4000/api/v1/" + endpoint
	absoluteLink.href = url
	absoluteLink.innerText = url
	fetch(url)
		.then(res => res.json())
		.then(data => {
			output.textContent = JSON.stringify(data, null, 2)
		})
})

testForm.endpoint.value = "products"
testForm.dispatchEvent(new Event("submit"))