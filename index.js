const body = document.querySelector("body");
const dialog = document.getElementById("dialog");
const title = document.getElementById("title");
const flag = document.getElementById("flag");
const language = document.getElementById("language");
const capitalEl = document.getElementById("capital");

const closeDialog = () => {
  body.style.overflow = "auto";
  dialog.style.display = "none";
};

const toggleDialog = (name, src, capital, languages) => {
  title.innerText = name;
  flag.src = src;
  capitalEl.innerHTML = capital;
  language.innerHTML = languages;

  body.style.overflow = open ? "hidden" : "auto";
  dialog.style.display = open ? "flex" : "none";
};

const createContinentContainer = (continent) => {
  const container = document.createElement("div");
  container.classList.add("continent-container");
  container.id = continent.toLowerCase();
  return container;
};

const createContinentTitle = (continent) => {
  const title = document.createElement("h1");
  title.id = continent.toLowerCase();
  title.innerText = continent;
  return title;
};

const createCard = ({ flag, name, capital, languages }) => {
  const card = document.createElement("div");
  card.classList.add("card");

  const image = document.createElement("img");
  image.src = flag;
  image.alt = name;

  const cardName = document.createElement("p");
  cardName.innerText = name;

  card.appendChild(image);
  card.appendChild(cardName);
  card.addEventListener("click", () => {
    toggleDialog(name, flag, capital, languages);
  });
  return card;
};

const createCardsContainer = () => {
  const container = document.createElement("div");
  container.classList.add("cards-container");
  return container;
};

const fetchCountries = async () => {
  try {
    const res = await fetch("https://restcountries.com/v3.1/all");
    const countries = await res.json();
    return countries;
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
};

const groupCountriesByRegion = (countries) => {
  const groupedCountries = {};
  countries.forEach((country) => {
    const { region, flags, name, capital, languages } = country;
    if (groupedCountries[region]) {
      groupedCountries[region].push({
        name: name.common,
        flag: flags.png,
        capital: capital && capital[0],
        languages: languages && Object.values(languages).join(", "),
      });
    } else {
      groupedCountries[region] = [
        {
          name: name.common,
          flag: flags.png,
          capital: capital && capital[0],
          languages: languages && Object.values(languages).join(", "),
        },
      ];
    }
  });
  return groupedCountries;
};

const renderCountries = (countries) => {
  Object.entries(countries).forEach(([continent, countries]) => {
    const continentContainer = createContinentContainer(continent);
    const continentTitle = createContinentTitle(continent);
    const cardsContainer = createCardsContainer();

    countries.forEach((country) => {
      const card = createCard(country);
      cardsContainer.appendChild(card);
    });

    continentContainer.appendChild(continentTitle);
    continentContainer.appendChild(cardsContainer);
    body.appendChild(continentContainer);
  });
};

const initialize = async () => {
  const countries = await fetchCountries();
  countries.sort((a, b) => a.name.common.toLowerCase().localeCompare(b.name.common.toLowerCase()));
  const groupedCountries = groupCountriesByRegion(countries);
  renderCountries(groupedCountries);
};

initialize();
closeDialog();
