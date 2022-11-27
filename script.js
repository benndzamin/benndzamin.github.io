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
  let table;

  let editFirstName = document.querySelector("#editFirstName");
  let editLastName = document.querySelector("#editLastName");
  let editEmail = document.querySelector("#editEmail");
  let editCountry = document.querySelector("#editSelectCountry");
  let editCity = document.querySelector("#editSelectCity");
  let obj;
  let index;
  let functId;

  //save data to localhost
  function saveData(e) {
    e.preventDefault();
    id++;
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
    table.clear().rows.add(data).draw();
    $("#exampleModalCenter .close").click();
  }
  addItems.addEventListener("submit", saveData);

  //show datatable on page
  function showData() {
    table = $("#example").DataTable({
      order: [[0, "desc"]],
      data: data,
      columns: [
        //here we can use the properties from the data
        { data: "id", title: "ID" },
        { data: "name", title: "First name" },
        { data: "surname", title: "Last name" },
        { data: "email", title: "e-mail" },
        { data: "country", title: "Country" },
        { data: "city", title: "City" },
        {
          data: "Action",
          title: "Action",
          //you should pass the id of an item to the editButton here, so that you can get it when opening a modal (for delete or data saving)
          //instead of adding event listeners below on each button.
          render: function () {
            return `<div class="btn-group"> 
            <button type="button" name="edit" class="btn btn-outline-primary btn-sm edit" data-toggle="modal" data-target="#editModal">Edit</button>
            <button type="button" name="delete" class="btn btn-outline-danger btn-sm delete" >Delete</button>
            </div>`;
          },
        },
      ],
    });
    return table;
  }
  showData();

  //edit data in localhost and update values in modal
  function callUpdate(e) {
    e.preventDefault();
    functId = table.row(this.parentElement.parentElement).data().id;
    
    data.forEach((item) => {
      if (item.id == functId) {
        index = data.indexOf(item);
        let values = table.row(this.parentElement.parentElement).data();
            editFirstName.value = values.name;
            editLastName.value = values.surname;
            editEmail.value = values.email;
            editCountry.value = values.country;
            editCity.value = values.city;
      }
    });
  }
  
  function updateChanges(e) {
    e.preventDefault();
    id++;
    data.forEach((item) => {
      if (item.id == functId) {
        index = data.indexOf(item);
      }
    });

    data[index] = {
      id,
      name: editFirstName.value,
      surname: editLastName.value,
      email: editEmail.value,
      country: editCountry.value,
      city: editCity.value,
    };

    localStorage.setItem("data", JSON.stringify(data));
    table.clear().rows.add(data).draw();
    $("#editModal .close").click();
  }
  $(".update-changes").on("click", updateChanges);

  //delete datatable entry
  function deleteEntry() {
    let id = table.row(this.parentElement.parentElement).data().id;
    let index;
    data.forEach((item) => {
      if (item.id == id) {
        index = data.indexOf(item);
      }
    });
    data.splice(index, 1);
    localStorage.setItem("data", JSON.stringify(data));
    table.row(this.parentElement.parentElement).remove().draw(false);
  }

  $("#example").on("click", "tbody tr td .btn-group .edit", callUpdate);
  $("#example").on("click", "tbody tr td .btn-group .delete", deleteEntry);
  $("#example").on("click", "tbody tr td .btn-group .edit", dropdownOptions)

  //fetch data from json file than pass it to giveOptions function
  fetch(endpoint)
    .then((res) => res.json())
    .then((data) => giveOptions(data));
  //dependent dropdown
  //just replace the x,y,z variables for someting more meaningful for more readability  
  function giveOptions(countries) {
    obj = countries;
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

function dropdownOptions(){
  
      for (var country in obj) {
      editCountry.options[editCountry.options.length] = new Option(country, country);
    }
      
      editCity.length = 1;
      let city = obj[table.row(this.parentElement.parentElement).data().country];
      for (let c=0; c<city.length; c++) {
        editCity.options[editCity.options.length] = new Option(
          city[c],
          city[c]
        );
      }

      editCountry.onchange = function () {
        editCity.length = 1;
        let city = obj[this.value];
        for (var y in city) {
          editCity.options[editCity.options.length] = new Option(
            city[y],
            city[y]
          );
        }
      };
      editCountry.value = table.row(this.parentElement.parentElement).data().country;
      editCity.value = table.row(this.parentElement.parentElement).data().city;
}

});
