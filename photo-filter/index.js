const filtersWrap = document.querySelector(".filters");
const filtersInputs = document.querySelectorAll(".filters input");
const img = document.querySelector(".editor img");
const btnReset = document.querySelector(".btn-reset");
const btnNext = document.querySelector(".btn-next");
const canvas = document.querySelector("canvas");
const loadInput = document.querySelector("input[type='file']");

let click = 1;
let imgNum;

function getTimeOfDay() {
  let time = new Date();
  let hours = time.getHours();
  let timeOfDay;

  if ((hours >= 6) & (hours < 12)) {
    timeOfDay = "morning";
  } else if ((hours >= 12) & (hours < 18)) {
    timeOfDay = "day";
  } else if ((hours >= 18) & (hours < 24)) {
    timeOfDay = "evening";
  } else {
    timeOfDay = "night";
  }
  return timeOfDay;
}

function generateLink(timeOfDay) {
  if (click < 10) {
    imgNum = `0${click}`;
  } else if ((click < 20) & (click >= 10)) {
    imgNum = click;
  } else {
    imgNum = click;
    click = 0;
  }
  img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${imgNum}.jpg`;
  click++;
}

function createFiltersObject() {
  const filtersObj = new Object();

  filtersInputs.forEach((input) => {
    if (input.name === "hue") {
      const name = input.name + "-rotate";
      filtersObj[`${name}`] = input.value + input.dataset.sizing || "";
    } else {
      const name = input.name;
      filtersObj[`${name}`] = input.value + input.dataset.sizing || "";
    }
  });
  return filtersObj;
}

drawCanvasImg(createFiltersObject());

filtersWrap.addEventListener("input", handleUpdate);
function handleUpdate(event) {
  const currentValue = event.target.value;
  event.target.nextElementSibling.innerHTML = currentValue;

  drawCanvasImg(createFiltersObject());
}

btnNext.addEventListener("click", displayNextPicture);
function displayNextPicture() {
  generateLink(getTimeOfDay());
  drawCanvasImg(createFiltersObject());
}

function drawCanvasImg(filtersObj) {
  const canvasImg = new Image();
  canvasImg.setAttribute("crossOrigin", "anonymous");
  canvasImg.src = img.src;

  canvasImg.onload = function () {
    canvas.width = canvasImg.width;
    canvas.height = canvasImg.height;
    const ctx = canvas.getContext("2d");

    let filtersList = "";
    for (key in filtersObj) {
      filtersList += `${key}(${filtersObj[key]}) `;
    }
    ctx.filter = filtersList;
    ctx.drawImage(canvasImg, 0, 0);
  };
}

btnReset.addEventListener("click", reset);
function reset() {
  filtersWrap.reset();
  filtersInputs.forEach((el) => {
    el.nextElementSibling.innerHTML = el.value;
  });
  drawCanvasImg();
}

loadInput.addEventListener("change", loadUserImg);
function loadUserImg() {
  const file = loadInput.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    img.src = reader.result;
  };
  reader.readAsDataURL(file);

  loadInput.value = "";
  reader.onloadend = () => {
    drawCanvasImg(createFiltersObject());
  };
}
