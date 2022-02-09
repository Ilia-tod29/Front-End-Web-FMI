'use strict'
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcHXfbwMPYjnPUYE1xc4KHVo6_oA-vyyM",
  authDomain: "meal-list-fmi-c19bd.firebaseapp.com",
  projectId: "meal-list-fmi-c19bd",
  storageBucket: "meal-list-fmi-c19bd.appspot.com",
  messagingSenderId: "127164904032",
  appId: "1:127164904032:web:97feee99510a5785f60905",
  measurementId: "G-6D2CF9834K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const readFromDB = async () => {
    const querySnapshot = await getDocs(collection(db, "Meals"));
    let meals = [];
    querySnapshot.forEach((doc) => {
        const docData = doc.data();
        const mealObj = {
            name : docData.name,
            category : docData.category,
            region : docData.region,
            instruction : docData.instruction,
            image : docData.image,
            ingredients : docData.ingredients,
            measures : docData.measures
        };
        meals.push(mealObj);
    });
    return meals;
}

const pushToDB = async (recipe) => {
    try {
        const docRef = await addDoc(collection(db, "Meals"), {
          name : recipe.name,
          category : recipe.category,
          region : recipe.region,
          instruction : recipe.instructions,
          image : recipe.url,
          ingredients : recipe.ingredients,
          measures : recipe.measures
        });
        alert("Save Successful!");
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}

//Loading meals
const mainContent = document.getElementsByClassName("main-content")[0];
const moreInfo = document.getElementsByClassName("popup")[0];
const overlay = document.getElementsByClassName("overlay")[0];
const filterByNameFiled = document.getElementById("filter-by-name");
const filterByRegionFiled = document.getElementById("filter-by-region");
const filterByCategoryFiled = document.getElementById("filter-by-category");
let overAllIndex = 0, itemsFromDB = 0, itemsFromNpoint = 0;

const handleErr = (err) => {
    console.log(err);
    const response = new Response(
        JSON.stringify({
            code : 400
        })
    );
    return response;
}

const loadInfo = async () => {
    const result = await fetch("https://api.npoint.io/51ed846bdd74ff693d7e").catch(handleErr);
    const json = await result.json();
    if(json.code && json.code === 400) {
        console.log("Error apeared!");
        return;
    }
    return json;
};

document.addEventListener("DOMContentLoaded", async () => {
    let info = (await loadInfo()).meals;
    let infoFromDB = await readFromDB();
    infoFromDB.forEach((element) => {
        const newReciepe = document.createElement("li");
        newReciepe.innerHTML = `<div class="img-wrap">
                                    <img src="${element.image}" alt="No image" class="img">
                                    <div class='text'>                   
                                        <p id='recipe-name'>${element.name}</p>
                                    </div>
                                </div>
                                <div class="inf">
                                    <div class='text'>  
                                        <p id='recipe-category'>${element.category}</p><div class='comma'>, &nbsp</div><p id='recipe-region'>${element.region}</p>
                                    </div>
                                    <button class="btn" id="${overAllIndex}">See recipe</button>
                                </div>`;
        mainContent.appendChild(newReciepe);
        overAllIndex++;
        itemsFromDB++;
    });
    info.forEach((element) => {
        const newReciepe = document.createElement("li");
        newReciepe.innerHTML = `<div class="img-wrap">
                                    <img src="${element.image}" alt="No image" class="img">
                                    <div class='text'>                   
                                        <p id='recipe-name'>${element.name}</p>
                                    </div>
                                </div>
                                <div class="inf">
                                    <div class='text'>  
                                        <p id='recipe-category'>${element.category}</p><div class='comma'>, &nbsp</div><p id='recipe-region'>${element.region}</p>
                                    </div>
                                    <button class="btn" id="${overAllIndex}">See recipe</button>
                                </div>`;
        mainContent.appendChild(newReciepe);
        overAllIndex++;
        itemsFromNpoint++;
    });
});


const getDataForMainContentNpoint = async (btnID) => {
    let info = (await loadInfo()).meals[btnID];
    
        const moreInfoData = document.createElement("div");
        moreInfo.innerHTML = `  <div>
                                    <div class="popup-header">
                                        ${info.name}
                                    </div>
                                    <img src="${info.image}" alt="no img">
                                    <p>${info.instruction}</p>
                                    <table class="table-data">
                                        <tr>
                                            <th>Ingredients</th>
                                            <th>Measure</th>
                                        </tr>
                                    </table>
                                </div>
                                <div class="popup-footer">
                                    <button>Close</button>
                                </div> `;
        const tableElement = document.getElementsByClassName("table-data")[0];
        const ingredients = info.ingredients;
        ingredients.forEach(element => {
            const newIngrediant = document.createElement("tr");
            newIngrediant.innerHTML = ` <td>${element.name}\t
                                        <td>${element.measure}\t`;
            tableElement.appendChild(newIngrediant);
        });
        moreInfo.appendChild(moreInfoData);
};

const getDataFormainContentDB = async (btnID) => {
    let info = (await readFromDB())[btnID];
    const moreInfoData = document.createElement("div");
    moreInfo.innerHTML = `  <div>
                                <div class="popup-header">
                                    ${info.name}
                                </div>
                                <img src="${info.image}" alt="no img">
                                <p>${info.instruction}</p>
                                <table class="table-data">
                                    <tr>
                                        <th>Ingredients</th>
                                        <th>Measure</th>
                                    </tr>
                                </table>
                            </div>
                            <div class="popup-footer">
                                <button>Close</button>
                            </div> `;
    const tableElement = document.getElementsByClassName("table-data")[0];
    const ingredients = info.ingredients;
    const measures = info.measures;
    for (let index = 0; index < ingredients.length; index++) {
        const newIngrediant = document.createElement("tr");
        newIngrediant.innerHTML = ` <td>${ingredients[index]}\t
                                    <td>${measures[index]}\t`;
        tableElement.appendChild(newIngrediant);
    }
    moreInfo.appendChild(moreInfoData);
};

mainContent.addEventListener("click", async (event) => {
    const isButton = event.target.nodeName === 'BUTTON';
    if(!isButton){
        return;
    }
    if(!moreInfo.classList.contains("active") && !overlay.classList.contains("active")){
        moreInfo.classList.add("active");
        overlay.classList.add("active");
    }
    let btnID = event.target.id;

    if(btnID >= itemsFromDB) {
        //From Npoint
        btnID -= itemsFromDB;
        await getDataForMainContentNpoint(btnID);
    }
    else {
        //From DB
        getDataFormainContentDB(btnID)
    }

});

moreInfo.addEventListener("click", (event) => {
    const isButton = event.target.nodeName === 'BUTTON';
    if(!isButton){
        return;
    }
    if(moreInfo.classList.contains("active") && overlay.classList.contains("active")){
        moreInfo.classList.remove("active");
        overlay.classList.remove("active");
    }
});

overlay.addEventListener("click", () => {
    if(moreInfo.classList.contains("active") && overlay.classList.contains("active")){
        moreInfo.classList.remove("active");
        overlay.classList.remove("active");
    }
});

//Filters

const subFilter = (inputName, ID, classNamesToAdd) => {
    const items = mainContent.querySelectorAll("li");
    items.forEach((element) => {
        const elementTags = element.getElementsByTagName("p");
        const elementName = elementTags[ID].innerHTML.trim().toLowerCase();
        const hide = (elementName != inputName && inputName != "");
        
        const unHide = (elementName === inputName 
                        && ((ID === 0 && !(element.classList.contains("filtered-region") || element.classList.contains("filtered-category")))
                            || (ID === 1 && !(element.classList.contains("filtered-region") || element.classList.contains("filtered-name")))
                            || (ID === 2 && !(element.classList.contains("filtered-name") || element.classList.contains("filtered-category"))))
                         );
        if(unHide) {
            element.classList.remove("hidden");
            element.classList.remove(classNamesToAdd[ID]);
        }
        else if(hide) {
            element.classList.add("hidden");
            element.classList.add(classNamesToAdd[ID]);
        }
    });
}


const filter = (inputName, ID, classNamesToAdd) => {
    const items = mainContent.querySelectorAll("li");
    items.forEach((element) => {
        const elementTags = element.getElementsByTagName("p");
        const elementName = elementTags[ID].innerHTML.trim().toLowerCase();
        const hide = (elementName != inputName && inputName != "");
        
        const unHide = (elementName === inputName 
                        && ((ID === 0 && !(element.classList.contains("filtered-region") || element.classList.contains("filtered-category")))
                            || (ID === 1 && !(element.classList.contains("filtered-region") || element.classList.contains("filtered-name")))
                            || (ID === 2 && !(element.classList.contains("filtered-name") || element.classList.contains("filtered-category"))))
                         );
        if(inputName === "") {
            element.classList.remove("hidden");
            element.classList.remove(classNamesToAdd[ID]);
            if(ID === 0){
                subFilter(filterByCategoryFiled.value, 1, classNamesToAdd);
                subFilter(filterByRegionFiled.value, 2, classNamesToAdd);
            }
            else if(ID === 1) {
                subFilter(filterByNameFiled.value, 0, classNamesToAdd);
                subFilter(filterByRegionFiled.value, 2, classNamesToAdd);
            }
            else if(ID === 2) {
                subFilter(filterByNameFiled.value, 0, classNamesToAdd);
                subFilter(filterByCategoryFiled.value, 1, classNamesToAdd);
            }
        }
        if(unHide) {
            element.classList.remove("hidden");
            element.classList.remove(classNamesToAdd[ID]);
        }
        if(hide) {
            element.classList.add("hidden");
            element.classList.add(classNamesToAdd[ID]);
        }
    });
}

filterByNameFiled.addEventListener("input", (event) => {
    const data = event.target.value.trim().toLowerCase();
    filter(data, 0, ["filtered-name", "filtered-category", "filtered-region"]);
});

filterByRegionFiled.addEventListener("input", (event) => {
    const data = event.target.value.trim().toLowerCase();
    filter(data, 2, ["filtered-name", "filtered-category", "filtered-region"]);
});

filterByCategoryFiled.addEventListener("input", (event) => {
    const data = event.target.value.trim().toLowerCase();
    filter(data, 1, ["filtered-name", "filtered-category", "filtered-region"]);
});

//Add recipe

let recipeUrl = "";
let recipeIngredients = [];
let recipeMeasures = [];
const submitRecipeBtn = document.getElementById("submit-btn");
const addIngediantBtn = document.getElementById("add-ingrediant");
const addMeasureBtn = document.getElementById("add-measure");
const recipeImgInput = document.getElementById("recipe-img");

addIngediantBtn.addEventListener("click", () => {
    const ingrediant = document.getElementById("input-ingrediant");
    if(ingrediant.value === "") {
        return;
    }
    recipeIngredients.push(ingrediant.value);
    ingrediant.value = "";
});
addMeasureBtn.addEventListener("click", () => {
    const measure = document.getElementById("input-measure");
    if(measure.value === "") {
        return;
    }
    recipeMeasures.push(measure.value);
    measure.value = "";
});

recipeImgInput.addEventListener("change", function() {
   const reader = new FileReader();
   reader.addEventListener("load", () => {
       recipeUrl = reader.result;
   }) 
   reader.readAsDataURL(this.files[0]);
});

submitRecipeBtn.addEventListener("click", async () => {
    const name = document.getElementById("input-name");
    const category = document.getElementById("input-category");
    const instructions = document.getElementById("input-instruction");
    const region = document.getElementById("input-region");
    if((name.value === "") || (recipeIngredients.length != recipeMeasures.length)) {
        recipeIngredients = [];
        recipeMeasures = [];
        alert("Save Unsuccessful!");
        return;
    }
    const recipeObj = {
        name : name.value,
        category : category.value,
        region : region.value,
        instructions : instructions.value,
        url : recipeUrl,
        ingredients : recipeIngredients,
        measures : recipeMeasures
    };
    await pushToDB(recipeObj);
    name.value = "";
    category.value = "";
    instructions.value = "";
    region.value = "";
    location.reload();
}); 