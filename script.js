const startProcess = async () => {
  const url = "https://api.openaq.org/v1/countries";
  let countriesArray = [];
  let countries = [];
  try {
    await fetch(url)
    .then((resp) => resp.json())
    .then((resp) => {
      resp.results.map((res) => countriesArray.push(res.name));
      countriesArray = countriesArray.filter(function (element) {
        return element !== undefined;
      });
      countries = Object.values(countriesArray);
    });
  } catch (e){
    console.error(e)
  }

  createSelectors(countries);
};

const createSelectors = (countries) => {
  const parent = document.querySelector(".options-container");
  countries.map((el) => {
    parent.insertAdjacentHTML(
      "beforeEnd",
      `
      <div class="option">
        <input type="radio" class="radio" id=${el.toLowerCase()} name="category" />
        <label for=${el.toLowerCase()}>${el}</label>
      </div>
    `
    );
  });

  operations()
};

const operations = () => {
  const selected = document.querySelector(".selected");
  const optionsContainer = document.querySelector(".options-container");
  const searchBox = document.querySelector(".search-box input");
  const optionsList = document.querySelectorAll(".option");

  selected.addEventListener("click", () => {
    optionsContainer.classList.toggle("active");
    searchBox.value = "";
    filterList("");

    if (optionsContainer.classList.contains("active")) {
      searchBox.focus();
    }
  });

  optionsList.forEach((o) => {
    o.addEventListener("click", () => {
      selected.innerHTML = o.querySelector("label").innerHTML;
      optionsContainer.classList.remove("active");
      description(selected.innerHTML)
    });
  });

  searchBox.addEventListener("keyup", function (e) {
    filterList(e.target.value);
  });

  const filterList = (searchTerm) => {
    searchTerm = searchTerm.toLowerCase();
    optionsList.forEach((option) => {
      let label =
        option.firstElementChild.nextElementSibling.innerText.toLowerCase();
      if (label.indexOf(searchTerm) != -1) {
        option.style.display = "block";
      } else {
        option.style.display = "none";
      }
    });
  };
};

const clearInformations = (a) => {
  a.innerHTML = ''
}

async function description(city) {
  const second = `https://en.wikipedia.org/w/api.php?action=query&prop=description&origin=*&format=json&titles=${city}`;
  try {
    data = {
      city
    }
    await fetch(second)
      .then((resp) => resp.json())
      .then((resp) => {
        const path = Object.values(resp.query.pages)[0]
        const title = document.querySelector(".informations").querySelector(".title")
        const description = document.querySelector(".informations").querySelector(".description")
        const postApi = document.querySelector(".informations").querySelector(".postApi")
        const readMore = document.querySelector(".informations").querySelector(".readMore")
        title.innerHTML = ''
        description.innerHTML = ''
        postApi.innerHTML = ''
        readMore.innerHTML = ''
        title.insertAdjacentHTML("beforeEnd", `<h2>${path.title}</h2>`)
        description.insertAdjacentHTML("beforeEnd", path.description)
        postApi.insertAdjacentHTML("beforeEnd", `<h5>Informations from wikipedia.org</h5>`)
        readMore.insertAdjacentHTML("beforeEnd", `<p>Read more on <a href="https://en.wikipedia.org/wiki/${city}" target="_blank">wikipedia</a></p>`)
      });
  } catch (err) {
    console.log(err);
  }
}
