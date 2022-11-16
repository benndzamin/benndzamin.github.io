// the whole script should be wrapped into document.ready
"use strict";

$(document).ready(function () {
  const endpoint =
    "https://raw.githubusercontent.com/russ666/all-countries-and-cities-json/master/countries.json";

  const addItems = document.querySelector(".add-items");
  let firstName = document.querySelector("#firstName");
  let lastName = document.querySelector("#lastName");
  let email = document.querySelector("#email");
  let selectCountry = document.querySelector("#selectCountry");
  let selectCity = document.querySelector("#selectCity");
  const data = JSON.parse(localStorage.getItem("data")) || [];
  let id = (Date.now() + Math.random()).toFixed();

  function saveData(e) {
    const item = {
      id: id,
      name: firstName.value,
      surname: lastName.value,
      email: email.value,
      country: selectCountry.value,
      city: selectCity.value,
    };

    data.push(item);
    localStorage.setItem("data", JSON.stringify(data));
    this.reset();
  }

  addItems.addEventListener("submit", saveData);

  function showData() {
    var dataSet = [];
    for (let x in data) {
      dataSet.push(Object.values(data[x]));
    }
    return $("#example").DataTable({
      data: dataSet,
      columns: [
        { title: "ID" },
        { title: "Name" },
        { title: "Last Name" },
        { title: "e-mail" },
        { title: "Country" },
        { title: "City" },
        {
          title: "Action",
          render: function (e) {
            return `<div class="btn-group"> 
            <button type="button" name="edit" class="btn btn-outline-primary btn-sm edit" >Edit</button>
            <button type="button" name="delete" class="btn btn-outline-danger btn-sm delete" >Delete</button>
            </div>`;
          },
        },
      ],
    });
  }
  showData();

  let editBtn = document.querySelectorAll(".edit");
  let deleteBtn = document.querySelectorAll(".delete");

  function editEntry(e) {
    console.log(this.parentElement.parentElement.parentElement);
  }

  function deleteEntry(e) {
    console.log(e.target);
    let table = document.getElementById("example");
  }

  editBtn.forEach((item) => item.addEventListener("click", editEntry));
  deleteBtn.forEach((item) => item.addEventListener("click", deleteEntry));

  //fetch data from json file than pass it to giveOptions function
  fetch(endpoint)
    .then((res) => res.json())
    .then((data) => giveOptions(data));

  //dependent dropdown
  function giveOptions(countries) {
    //user Prettier for text formatting
    for (var x in countries) {
      selectCountry.options[selectCountry.options.length] = new Option(x, x);
    }
    selectCountry.onchange = function () {
      selectCity.length = 1;
      let city = countries[this.value];
      for (var y in city) {
        selectCity.options[selectCity.options.length] = new Option(
          city[y],
          city[y]
        );
      }
    };
  }
});
