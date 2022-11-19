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
  let data = JSON.parse(localStorage.getItem("data")) || [];
  let id = (Date.now() + Math.random()).toFixed();
  let tabela = document.querySelector("#example");

  let editFirstName = document.querySelector("#editFirstName");
  let editLastName = document.querySelector("#editLastName");
  let editEmail = document.querySelector("#editEmail");
  let editCountry = document.querySelector("#editSelectCountry");
  let editCity = document.querySelector("#editSelectCity");

  //save data to localhost
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

  //show datatable on page
  function showData() {
    var dataSet = [];
    for (let x in data) {
      dataSet.push(Object.values(data[x]));
    }
    tabela = $("#example").DataTable({
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
            <button type="button" name="edit" class="btn btn-outline-primary btn-sm edit" data-toggle="modal" data-target="#editModal">Edit</button>
            <button type="button" name="delete" class="btn btn-outline-danger btn-sm delete" >Delete</button>
            </div>`;
          },
        },
      ],
    });
    return tabela;
  }
  showData();

  let editBtn = document.querySelectorAll(".edit");
  let deleteBtn = document.querySelectorAll(".delete");
  let updateBtn = document.querySelector(".update-changes");

  //edit data in localhost and update values in modal
  function callUpdate() {
    let id =
      this.parentElement.parentElement.parentElement.firstChild.textContent;
    let index;

    data.forEach((item) => {
      console.log(item.id);
      if (item.id == id) {
        index = data.indexOf(item);
      }
    });

    editFirstName.value = data[index].name;
    editLastName.value = data[index].surname;
    editEmail.value = data[index].email;
    editCountry.value = data[index].country;
    editCity.value = data[index].city;
    console.log(editCountry.value);
    console.log(editCity.value);

    function updateChanges() {
      data[index] = {
        id: id,
        name: editFirstName.value,
        surname: editLastName.value,
        email: editEmail.value,
        country: editCountry.value,
        city: editCity.value,
      };

      localStorage.setItem("data", JSON.stringify(data));
      this.reset();
    }
    updateBtn.addEventListener("click", updateChanges);
  }

  //delete datatable entry
  function deleteEntry() {
    let id =
      this.parentElement.parentElement.parentElement.firstChild.textContent;
    let index;
    data.forEach((item) => {
      if (item.id == id) {
        index = data.indexOf(item);
      }
    });
    data.splice(index, 1);
    localStorage.setItem("data", JSON.stringify(data));

    $("#example").on("click", ".delete", function () {
      var table = $("#example").DataTable();
      table.row($(this).parents("tr")).remove().draw();
    });
  }

  editBtn.forEach((item) => item.addEventListener("click", callUpdate));
  deleteBtn.forEach((item) => item.addEventListener("click", deleteEntry));

  //fetch data from json file than pass it to giveOptions function
  fetch(endpoint)
    .then((res) => res.json())
    .then((data) => giveOptions(data));

  //dependent dropdown
  function giveOptions(countries) {
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

    for (var z in countries) {
      editCountry.options[editCountry.options.length] = new Option(z, z);
    }
    editCountry.onchange = function () {
      editCity.length = 1;
      let city = countries[this.value];
      for (var w in city) {
        editCity.options[editCity.options.length] = new Option(
          city[w],
          city[w]
        );
      }
    };
  }
});