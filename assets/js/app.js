var cl = console.log;

// DOM REFERENCES
const spinner = document.getElementById("spinner");
const form = document.getElementById("form");
const input = document.getElementById("input");
const inputid = document.getElementById("inputid");
const submitbtn = document.getElementById("submitbtn");
const updatebtn = document.getElementById("updatebtn");
const subid = document.getElementById("subid");

// FIREBASE URL
const BASE_URL ="https://xhr-1st-crud-default-rtdb.firebaseio.com";
const subject_URL=`${BASE_URL}/subject.json`;


let subarr = [];


// TOGGLE SPINNER
function Ontoggle() {
    spinner.classList.toggle("d-none");
}

// TEMPLATING

function Templating(arr) {
    let result = "";
    arr.forEach(ele => {
        result += `<li class="list-group-item d-flex justify-content-between align-items-center mb-2"id="${ele.id}">
            <div>
                <strong>${ele.subject}</strong>
                <strong>${ele.fees}</strong>
            </div>
            <div>
                <i onclick="OnEdit(this)"class="fa-regular fa-pen-to-square fa-2x text-primary mr-3"style="cursor:pointer"></i>
                <i onclick="OnDelete(this)"class="fa-solid fa-trash-can fa-2x text-danger"style="cursor:pointer"></i>
            </div>
        </li>`;
    });
    subid.innerHTML = result;
}


// READ

function OnRead() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", subject_URL);
    Ontoggle();
    xhr.send();
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response);
            subarr = [];
            if (res) {
                for (const key in res) {
                    res[key].id = key;
                    subarr.push(res[key]);
                }
            }
            Templating(subarr);
        } else {
            cl("Error");
        }
        Ontoggle();
    };
}
OnRead();


// CREATE

function CreateTodo(eve) {
    eve.preventDefault();
    let obj = {
        subject: input.value.trim(),
        fees: inputid.value.trim()
    };
    let xhr = new XMLHttpRequest();
    xhr.open("POST", subject_URL);
    Ontoggle();
    xhr.send(JSON.stringify(obj));
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response);
            cl(res);
            form.reset();
            Swal.fire({
                title: "Created!",
                text: "Subject created successfully.",
                icon: "success"
            });
            OnRead();
        } else {
            cl("Error");
        }
        Ontoggle();
    };
}


// EDIT

function OnEdit(eve) {
    let Edit_Id = eve.closest("li").id;
    localStorage.setItem("Edit_Id", Edit_Id);
    let xhr = new XMLHttpRequest();
    xhr.open("GET",`${BASE_URL}/subject/${Edit_Id}.json`);
    xhr.send(null);
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response);
            input.value = res.subject;
            inputid.value = res.fees;
            submitbtn.classList.add("d-none");
            updatebtn.classList.remove("d-none");
        } else {
            cl("Error");
        }
    };
}


// UPDATE

function Onupdate(eve) {
    let Update_Id =localStorage.getItem("Edit_Id");
    let Upobj = {
        subject: input.value.trim(),
        fees: inputid.value.trim()
    };
    let xhr = new XMLHttpRequest();
    xhr.open("PATCH",`${BASE_URL}/subject/${Update_Id}.json`);
    Ontoggle();
    xhr.send(JSON.stringify(Upobj));
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
        let res = JSON.parse(xhr.response);
        cl(res);
        submitbtn.classList.remove("d-none");
        updatebtn.classList.add("d-none");
        localStorage.removeItem("Edit_Id");
        form.reset();
        Swal.fire({
        title: "Updated!",
        text: `Subject updated with id ${Update_Id}`,
        icon: "success"
        });
            OnRead();
        } else {
            cl("Error");
        }
        Ontoggle();
    };
}

// DELETE

function OnDelete(eve) {
    let Remove_Id=eve.closest("li").id;
    let confirmation=confirm("Are you sure to Delete??")
    if (confirmation){
            let xhr = new XMLHttpRequest();
            xhr.open("DELETE",`${BASE_URL}/subject/${Remove_Id}.json`);
            Ontoggle();
            xhr.send();
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status <= 299) {
                    eve.closest("li").remove();
                    Swal.fire({
                        title:`Deleted id ${Remove_Id}!`,
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                } else {
                    cl("Error");
                }
                Ontoggle();
            };
        }
    };


// EVENT LISTENERS

form.addEventListener("submit",CreateTodo);
updatebtn.addEventListener("click",Onupdate);
