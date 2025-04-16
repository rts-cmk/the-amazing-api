const testForm = document.getElementById("apiTestForm")
const output = document.getElementById("output")
const endpointDisplay = document.getElementById("endpoint")
const absoluteLink = document.getElementById("absoluteLink")

function fetchEndpoint(endpoint) {
  endpointDisplay.innerText = endpoint
  const url = "http://localhost:4000/api/v1/" + endpoint
  absoluteLink.href = url
  absoluteLink.textContent = url

  fetch(url)
    .then(res => {
      if (res.status === 404) throw new Error("Not found")
      if (res.status === 400) throw new Error("Bad request")
      if (res.status === 401) throw new Error("Unauthorized")
      if (res.status >= 500) throw new Error("Server error")
      return res.json()
    })
    .then(data => {
      output.textContent = JSON.stringify(data, null, 2)
    })
    .catch(err => {
      output.textContent = err.message
    })
}

testForm.addEventListener("submit", (e) => {
  e.preventDefault()
  fetchEndpoint(e.target.endpoint.value)
})

window.addEventListener("DOMContentLoaded", () => {
  testForm.endpoint.value = "products"
  fetchEndpoint("products")
})