const meals = document.getElementById("meals");
const fmeals = document.getElementById("fmeals");
const searchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search");
const mealpopup = document.getElementById("popup-meal");
const mealInfoEl = document.getElementById("meal-info");
const popupCloseBtn = document.getElementById("close-popup1");
const deleted = document.getElementById("delete");

getRandomMeal();
fetchFavMeals();

async function getRandomMeal() {
  const random = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  const res = await random.json();
  const resData = res.meals[0];
  addMeal(resData, true);
  heartOn(resData);
}

async function getMealById(id) {
  const res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );
  const data = await res.json();

  const meal = data.meals[0];

  return meal;
}

async function getMealBySearch(name) {
  const res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + name
  );

  const data = await res.json();

  const meals = data.meals;
  return meals;
}

function addMeal(mealData, random = false) {
  const h4 = document.createElement("h4");
  const header = document.querySelector(".meal-header");

  h4.innerHTML = mealData.strMeal;
  const imgg = document.createElement("img");
  imgg.src = mealData.strMealThumb;
  header.append(imgg, h4);

  header.addEventListener("click", () => {
    showMealInfo(mealData);
  });
}

function heartOn(mealData) {
  const btn = document.querySelector(".fav-btn");

  btn.addEventListener("click", () => {
    if (btn.classList.contains("active")) {
      removeMealId(mealData.idMeal);
      btn.classList.remove("active");
    } else {
      addMealToLS(mealData.idMeal);
      btn.classList.toggle("active");
    }
    fetchFavMeals();
  });
}

function addMealToLS(mealId) {
  const mealIds = GetMealFromLS();
  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function removeMealId(mealId) {
  const mealIds = GetMealFromLS();
  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds.filter((id) => id !== mealId))
  );
}

function GetMealFromLS() {
  const mealIds = JSON.parse(localStorage.getItem("mealIds"));

  return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {
  //clean the container
  fmeals.innerHTML = "";
  const MealIds = GetMealFromLS();

  for (let i = 0; i, MealIds.length; i++) {
    const mealId = MealIds[i];

    let meal = await getMealById(mealId);
    addMealToFav(meal);
  }
  //add them to the screen
}

function addMealToFav(mealData) {
  const FavMeal = document.createElement("li");

  FavMeal.innerHTML = `<img
      class="img"
      src="${mealData.strMealThumb}""
      alt="${mealData.strMeal}"
    />
    <span>${mealData.strMeal}</span>
    <button class="clear"><i class="fas fa-times"></i></button>`;

  const btn = FavMeal.querySelector(".clear");
  btn.addEventListener("click", () => {
    removeMealId(mealData.idMeal);
    fetchFavMeals();
  });

  fmeals.appendChild(FavMeal);
}

function showMealInfo(mealData) {
  mealInfoEl.innerHTML = "";
  const mealEl = document.createElement("div");

  mealEl.innerHTML = `
  <button id="close-popup">
    <i class="fas fa-close"></i>
  </button>
  <h1>${mealData.strMeal}</h1>
  <img src="${mealData.strMealThumb}" alt="">
  <p> ${mealData.strInstructions}</p>`;

  mealInfoEl.appendChild(mealEl);

  mealpopup.classList.remove("hidden");
}

searchBtn.addEventListener("click", async () => {
  const header = document.querySelector(".meal-header");
  header.innerHTML = null;

  const search = searchTerm.value;
  const mealss = await getMealBySearch(search);

  if (mealss) {
    mealss.forEach((meal) => {
      addMeal(meal, true);
    });
  }
});

deleted.addEventListener("click", () => {
  console.log("click:");
  mealpopup.classList.add("hidden");
});
