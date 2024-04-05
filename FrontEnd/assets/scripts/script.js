function initializeGallery(works) {

    const gallery = document.querySelector(".gallery");

    works.forEach(element => {

        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        figure.id = element.id;
        figure.dataset.category = element.categoryId;
        img.src = element.imageUrl;
        img.alt = element.title;
        figcaption.textContent = element.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);

        gallery.appendChild(figure);
    });
}

function displayFiltersButtons(categories) {
    
    const filters = document.querySelector(".filters");
    const categoriesArray = Array.from(new Set(categories));

    const noFilterButton = document.createElement("button");
    noFilterButton.textContent = "Tous";
    noFilterButton.id = 0;
    noFilterButton.classList.add("btnSelected");

    filters.appendChild(noFilterButton);

    categoriesArray.forEach(element => {

        const button = document.createElement("button");
        button.textContent = element.name;
        button.id = element.id;

        filters.appendChild(button);
    });
}

function displayFilteredGallery(category) {

    const works = document.querySelectorAll(".gallery figure");
    works.forEach(element => {
        element.classList.remove("hidden");

        if(element.dataset.category != category && category != 0){

            element.classList.toggle("hidden");
        }
    })
}

fetch("http://localhost:5678/api/works")
    .then((resp) => resp.json())
    .then(works => {
        worksDetails = works;
        initializeGallery(worksDetails);
    })
    .catch(function(error) {
        console.error(error);
    });

fetch("http://localhost:5678/api/categories")
    .then((resp) => resp.json())
    .then(categories => {
        displayFiltersButtons(categories);

        const filtersSelector = document.querySelectorAll(".filters button")
        filtersSelector.forEach(element => {

            element.addEventListener('click', () => {

                const filterSelected = document.querySelector(".filters .btnSelected");
                filterSelected.classList.remove("btnSelected");

                element.classList.add("btnSelected")

                displayFilteredGallery(element.id);
            })
        })
    })
    .catch(function(error) {
        console.error(error);
    });