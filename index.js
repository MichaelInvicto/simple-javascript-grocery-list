// This is my code

var items = [];
var todo_items;

var form = document.querySelector('.grocery-form');
var input = document.querySelector('#grocery');
var alert = document.querySelector('.alert');
var grocery_list = document.querySelector('.grocery-list');
var delete_button = document.querySelector('.delete-btn');
var storage = JSON.parse(localStorage.getItem('todo'));
var edit_flag = false;
var edit_index;
var delete_index;


if (storage) {
  refresh();
}

form.addEventListener('submit', function(event){
    event.preventDefault();
    if (!edit_flag) {
      if (!input.value) {
        alert_user('Please Enter A Value', 'alert-danger');
      }
      else {
        alert_user('Item Added To The List', 'alert-success');
        items.push(input.value);
        localStorage.setItem('todo', JSON.stringify(items));
        refresh();
      }
    }
    else {
      item_value = input.value;
      if (item_value) {
        items[edit_index] = item_value;
        localStorage.setItem('todo', JSON.stringify(items));
        document.querySelector('.submit-btn').textContent = 'Submit';
        edit_flag = false;
        refresh();
        alert_user('Value Changed', 'alert-success');
        edit_flag = false;
      }
     else {
       alert_user('Please Enter A Value', 'alert-danger');
     }
   }
});

function alert_user(text, action) {
  alert.textContent = text;
  alert.classList.add(action);
  setTimeout(function() {
    alert.classList.remove(action);
    alert.textContent = '';
  }, 1500);
}

function get_index(which, button) {
  if (button == 'edit') {
    for (var i = 0; i < todo_items; i++) {
      if (document.querySelectorAll('.edit-btn')[i] == which) {
        return i;
      }
    }
  }
  else {
    for (var i = 0; i < todo_items; i++) {
      if (document.querySelectorAll('.delete-btn')[i] == which) {
        return i;
      }
    }
  }

}

function edit_item(which) {
  var edit_buttons = document.querySelectorAll('.edit-btn');
  var item_value = edit_buttons[which].parentElement.parentElement.innerText.replace('\n ','').replace('\n','').toLocaleLowerCase()

  // console.log(`${items[which]}`);
  input.value = item_value;
  document.querySelector('.submit-btn').textContent = 'Edit';
  edit_flag = true;
}

function delete_item(which) {
  items = removeItemOnce(items, items[which]);
  localStorage.setItem('todo', JSON.stringify(items));
  alert_user('Item Removed', 'alert-danger');
  refresh();
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}


function refresh() {
  var storage = JSON.parse(localStorage.getItem('todo'));
  if (storage) {
    grocery_list.innerHTML = '';
    document.querySelector('.grocery-container').style.visibility = 'visible';
    items = JSON.parse(localStorage.getItem('todo'));
    items.forEach((item, i) => {
      var add_this = `<article class="grocery-item">
        <p class="title">${item}</p>
        <div class="btn-container">
          <button type="button" class="edit-btn">
            <i class="fas fa-edit"></i>
          </button>
          <button type="button" class="delete-btn">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </article>`
      grocery_list.innerHTML += add_this;
    });
    todo_items = document.querySelectorAll('.edit-btn').length;
    for (var i = 0; i < todo_items; i++) {
      document.querySelectorAll('.edit-btn')[i].addEventListener('click', function() {
        edit_index = get_index(this, 'edit');
        edit_item(edit_index);
      });
    }
    for (var i = 0; i < todo_items; i++) {
      document.querySelectorAll('.delete-btn')[i].addEventListener('click', function() {
        delete_index = get_index(this, 'delete');
        delete_item(delete_index);
      });
    }
    input.value = '';
    document.querySelector('.clear-btn').addEventListener('click', function() {
      while (items.length) {
        items.pop();
      }
      alert_user('Empty List', 'alert-danger');
      localStorage.removeItem('todo');
      refresh();
      document.querySelector('.grocery-container').style.visibility = 'hidden';
      grocery_list.innerHTML = '';
    });
  }


}


/*
// The tutorials code

// ****** select items **********

const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");
// edit option
let editElement;
let editFlag = false;
let editID = "";
// ****** event listeners **********

// submit form
form.addEventListener("submit", addItem);
// clear list
clearBtn.addEventListener("click", clearItems);
// display items onload
window.addEventListener("DOMContentLoaded", setupItems);

// ****** functions **********

// add item
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();

  if (value !== "" && !editFlag) {
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("grocery-item");
    element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
    // add event listeners to both buttons;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    // append child
    list.appendChild(element);
    // display alert
    displayAlert("item added to the list", "success");
    // show container
    container.classList.add("show-container");
    // set local storage
    addToLocalStorage(id, value);
    // set back to default
    setBackToDefault();
  } else if (value !== "" && editFlag) {
    editElement.innerHTML = value;
    displayAlert("value changed", "success");

    // edit  local storage
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("please enter value", "danger");
  }
}
// display alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  // remove alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// clear items
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}

// delete item

function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;

  list.removeChild(element);

  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");

  setBackToDefault();
  // remove from local storage
  removeFromLocalStorage(id);
}
// edit item
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  // set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  // set form value
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  //
  submitBtn.textContent = "edit";
}
// set backt to defaults
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}

// ****** local storage **********

// add to local storage
function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });

  localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id, value) {
  let items = getLocalStorage();

  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

// SETUP LOCALSTORAGE.REMOVEITEM('LIST');

// ****** setup items **********

function setupItems() {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}

function createListItem(id, value) {
  const element = document.createElement("article");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add("grocery-item");
  element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
  // add event listeners to both buttons;
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);

  // append child
  list.appendChild(element);
}
*/
