const form = document.querySelector('form');
const resultsElement = document.getElementById("results");
const resultsListElement = document.getElementById("results-list");
const noResultsElement = document.getElementById("no-results");
const loader = document.getElementById("loader");

const backToTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
};

const goToBottom = () => {
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
};

const displayGridElement = (display, element) => {
    const invisibleClass = "invisible";

    if (display) {
        element.classList.remove(invisibleClass);
    } else {
        element.classList.add(invisibleClass);
    }
}

const displayLoader = (display) => {
    displayGridElement(display, loader);
}


const displayNoResults = () => {
    displayGridElement(true, noResultsElement);
    displayGridElement(false, resultsElement);
}

const displayResults = () => {
    displayGridElement(false, noResultsElement);
    displayGridElement(true, resultsElement);
}

const generateCards = (plants) => {
    let html = '';

    displayResults();

    plants.forEach((plant) => {
        html = html + `<li class="results__list__item grid-4" id={item_${plant.id}}>
            <img class="results__list__image" src="${plant.url}" alt="${plant.name}">
            <p class="results__list__description">${plant.name}</p>
            <div class="results__list__details">
                <span class="results__list__price">$${plant.price}</span>
                <div class="results__list__icons">
                    <span class="icon__sun-${plant.sun}"></span>   
                    <span class="icon__water-${plant.water}"></span>
                    <span class="icon__${plant.toxicity ? 'toxic' : 'untoxic'}"></span>      
                </div>
            </div>
        </li>`;
    });

    resultsListElement.innerHTML = html;
}

const getFormValues = () => {
    if (!form) return {}

    return Object.fromEntries(new FormData(form).entries());
}

const formatUrlWithParams = (url, params) => {
    const searchParams = new URLSearchParams(params).toString();

    return `${url}/?${searchParams}`
}

const getPlants = (formValues) => {
    const baseUrl = 'https://front-br-challenges.web.app/api/v2/green-thumb';
    const url = formatUrlWithParams(baseUrl, formValues);

    fetch(url)
        .then(response => {
            if (!response.ok) throw response.status;

            return response.json();
        })
        .then(plants => {
            displayLoader(false);

            if (plants.length > 0) {
                displayNoResults();
            }
            return generateCards(plants);
        })
        .catch(err => {
            displayLoader(false);
            displayNoResults();

            console.log(err)
        });
}

form.addEventListener('change', (e) => {
    displayLoader(true);
    const formValues = getFormValues();

    getPlants(formValues);
});