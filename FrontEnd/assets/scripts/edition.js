const token = window.localStorage.getItem("token");

if(token){

    console.log(`TOKEN : ${token}`);

    const editModeBanner = document.querySelector(".editModeBanner");
    editModeBanner.style = "display: flex";

    const loginLink = document.querySelector(".loginLink");
    loginLink.style = "display: none";

    const logoutLink = document.querySelector(".logoutLink");
    logoutLink.style = "display: inline-block";

    const portfolioTitle = document.querySelector(".editButton");
    portfolioTitle.style = "padding-left: 100px";

    const editButton = document.querySelector(".editButton a");
    editButton.style = "display: inline-block";
    
    const focusableSelectors = "button, a, input[type=text], select"

    fetch("http://localhost:5678/api/categories")
    .then((resp) => resp.json())
    .then(categories => {

        categoriesInModal = document.querySelector("select[id=\"category\"]");
        categoriesInModal.querySelector("option[disabled]").textContent = "";

        categories.forEach(element => {

            const category = document.createElement("option");
            category.value = element.id;
            category.innerHTML = element.name;

            categoriesInModal.appendChild(category);
        }

        )
    })
    .catch(function(error) {
        console.log(error);
    });

    function openModal() {

        const modal = document.querySelector(".modal");
        modal.style = "display: flex";
        modal.style.setProperty("animation", "fadeIn .3s both");
        modal.querySelector(".modalWrapper").style.setProperty("animation", "slideFromTop .3s both");
        modal.removeAttribute("aria-hidden");
        modal.setAttribute("aria-modal", "true");
        modal.querySelector(".modalContent1").style.setProperty("display", "flex");

        fetch("http://localhost:5678/api/works")
            .then((resp) => resp.json())
            .then(works => {

                works.forEach(element => {

                    const figure = document.createElement("figure");
                    const img = document.createElement("img");
                    const button = document.createElement("button");
            
                    figure.id = element.id;
                    img.src = element.imageUrl;
                    img.alt = element.title;
                    button.innerHTML = "<i class=\"fa-solid fa-trash-can\"></i>";
            
                    figure.appendChild(img);
                    figure.appendChild(button);

                    modal.querySelector(".galleryInModal").appendChild(figure);
                });
            })
            .catch(function(error) {
                console.log(error);
            });

        
        modal.addEventListener("click", closeModal);
        modal.querySelector(".closeModalButton").addEventListener("click", closeModal);
        modal.querySelector(".modalWrapper").addEventListener("click", stopPropagation);
        modal.querySelector(".galleryInModal").addEventListener("click", deleteWork);

        window.addEventListener("keydown", manageKeyboard);
    }

    function closeModal() {

        const modal = document.querySelector(".modal");

        if(modal !== null){

            modal.style.setProperty("animation", "fadeOut .3s both");
            modal.querySelector(".modalWrapper").style.setProperty("animation", "slideToBottom .3s both");
            
            window.setTimeout(function() {

                modal.style.setProperty("display", "none");
            }, 500);

            modal.setAttribute("aria-hidden", "true");
            modal.removeAttribute("aria-modal");
            modal.querySelector(".modalContent2").style.setProperty("display", "none");

            document.querySelector(".navigationModalButtons").style.setProperty("justify-content", "flex-end");
            previousModalButton = document.querySelector(".previousModalButton");
            previousModalButton.style.setProperty("display", "none");

            previousModalButton.removeEventListener("click", previousModal);
            modal.querySelector(".galleryInModal").removeEventListener("click", deleteWork);
            modal.querySelectorAll(".galleryInModal figure").forEach(element => {

                element.remove();
            })

            modal.removeEventListener("click", closeModal);
            modal.querySelector(".closeModalButton").removeEventListener("click", closeModal);
            modal.querySelector(".modalWrapper").removeEventListener("click", stopPropagation);
            modal.querySelector(".addPictureForm").removeEventListener("change", validatePictureForm);
            modal.querySelector(".addPictureForm button").removeEventListener("click", addPictureForm);

            closePictureForm();

            window.removeEventListener("keydown", manageKeyboard);
        }
    }

    function stopPropagation(e) {
        
        e.stopPropagation();
    }

    function manageKeyboard(e) {

        if(e.key === "Escape" || e.key === "Esc"){

            e.preventDefault();
            
            closeModal();
        }

        if(e.key === "Tab"){

            e.preventDefault();

            let focusables = [];
            let index;

            if(document.querySelector(".modalContent1[style=\"display: flex;\"]")){
            
                focusables = Array.from(document.querySelector(".modalContent1").querySelectorAll(focusableSelectors));
                focusables.unshift(document.querySelector(".closeModalButton"));
            }
            else {
                
                focusables = Array.from(document.querySelector(".modalContent2").querySelectorAll(focusableSelectors));
                focusables.unshift(document.querySelector(".previousModalButton"), document.querySelector(".closeModalButton"));
            }
            index = focusables.findIndex(f => f === document.querySelector(".modalWrapper").querySelector(":focus"));

            if(e.shiftKey === true){
                
                index--;

                if(index < 0){

                    index = focusables.length - 1;
                }
            }
            else{
                index++;

                if(index >= focusables.length){

                    index = 0;
                }
            }

            focusables[index].focus();

        }
    }

    function deleteWork(e) {

        if(e.target.tagName === "BUTTON"){

            const gallery = document.querySelector(".gallery");
            const galleryInModal = document.querySelector(".galleryInModal");

            fetch(`http://localhost:5678/api/works/${e.target.parentNode.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })
            .then((resp) => {

                if(resp.status === 204){

                    gallery.querySelector(`[id="${e.target.parentNode.id}" ]`).remove();
                    galleryInModal.querySelector(`[id="${e.target.parentNode.id}" ]`).remove();

                    console.log(`DELETE SUCCESSFUL\nResponse status : ${resp.status}`);
                    alert("Le projet a bien été supprimé.");
                }
                else if(resp.status === 401){

                    console.log(`DELETE FAILED : UNAUTHORIZED ACCESS\nResponse status : ${resp.status}`);
                    alert("Le projet n'a pas pu être supprimé : accès refusé.");
                }
                else {

                    console.log(`DELETE FAILED : UNKNOWN ERROR\nResponse status : ${resp.status}`);
                    alert("Le projet n'a pas pu être supprimé : erreur inconnue, veuillez réessayer.");
                }
            })
            .catch(function(error) {
                console.log(error);
            });
        }
    }

    function previousModal() {

        const activeModal = document.querySelector(".modalContent2");
        const newModal = document.querySelector(".modalContent1");

        activeModal.style.setProperty("display", "none");
        newModal.style.setProperty("display", "flex");

        document.querySelector(".navigationModalButtons").style.setProperty("justify-content", "flex-end");
        previousModalButton = document.querySelector(".previousModalButton");
        previousModalButton.style.setProperty("display", "none");

        closePictureForm();
    }

    function addPictureModal() {

        const activeModal = document.querySelector(".modalContent1");
        const newModal = document.querySelector(".modalContent2");
        const submitButton = newModal.querySelector(".addPictureForm button");

        activeModal.style.setProperty("display", "none");
        newModal.style.setProperty("display", "flex");

        submitButton.setAttribute("disabled", true);
        document.querySelector(".navigationModalButtons").style.setProperty("justify-content", "space-between");
        
        previousModalButton = document.querySelector(".previousModalButton");
        previousModalButton.style.setProperty("display", "block");
        previousModalButton.addEventListener("click", previousModal);

        newModal.querySelector(".addPictureForm").addEventListener("change", validatePictureForm);
        submitButton.addEventListener("click", addPictureForm);
    }

    function closePictureForm() {

        let form = document.forms["addPictureForm"];

        for(let i = 0; i < form.length - 1; i++){

            if(form.elements[i].type === "file" && form.elements[i].value){

                document.querySelector(".pictureField img").remove();
            }
            form.elements[i].value = null;
        }

        document.querySelector(".pictureSpan").style.setProperty("display", "flex");
    }

    function validatePictureForm() {

        let form = document.forms["addPictureForm"];
        let submittable = true;
        const pictureField = document.querySelector(".pictureField");
        const submitPicture = document.querySelector(".addPictureForm button");

        for(let i = 0; i < form.length - 1; i++){

            if(form.elements[i].value.length == 0){

                submittable = false;
            }
            else {
               
                if(form.elements[i].type === "file"){
                
                    if(!pictureField.querySelector("img")){

                        const picture = document.createElement("img");
                        picture.src = "assets/images/" + form.elements[i].files[0].name;

                        pictureField.querySelector(".pictureSpan").style.setProperty("display", "none");
                        pictureField.appendChild(picture);
                    }
               }
            }
        }

        if(submittable){

            submitPicture.removeAttribute("disabled");
            submitPicture.classList.add("submitPicture");
        }
        else {

            submitPicture.setAttribute("disabled", null);
            submitPicture.classList.remove("submitPicture");
        }
    }

    function addPictureForm(e) {

        e.preventDefault();

        const addPictureForm = document.querySelector(".addPictureForm");
        const formData = new FormData(addPictureForm);

        const gallery = document.querySelector(".gallery");
        const galleryInModal = document.querySelector(".galleryInModal");

        fetch("http://localhost:5678/api/works", {   
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })
        .then((resp) => resp.json().then(data => {

            if(resp.status === 201){

                const figure = document.createElement("figure");
                const img = document.createElement("img");
                const figcaption = document.createElement("figcaption");

                figure.id = data.id;
                figure.dataset.category = data.categoryId;
                img.src = data.imageUrl;
                img.alt = data.title;
                figcaption.textContent = data.title;

                figure.appendChild(img);
                figure.appendChild(figcaption);

                gallery.appendChild(figure);

                console.log(`CREATION SUCCESSFUL\nResponse status : ${resp.status}`);
                alert("Le projet a bien été ajouté.");

                closeModal();
            }
            else if(resp.status === 400){

                console.log(`CREATION FAILED : BAD REQUEST\nResponse status : ${resp.status}`);
                alert("Le projet n'a pas pu être ajouté : au moins l'un des champs est invalide.");
            }
            else if(resp.status === 401){

                console.log(`CREATION FAILED : UNAUTHORIZED ACCESS\nResponse status : ${resp.status}`);
                alert("Le projet n'a pas pu être ajouté : accès refusé.");
            }
            else {

                console.log(`CREATION FAILED : UNKNOWN ERROR\nResponse status : ${resp.status}`);
                alert("Le projet n'a pas pu être ajouté : erreur inconnue, veuillez réessayer.");
            }
        }))
        .catch(function(error) {
            console.log(error);
        });
    }

    function logout(){

        window.localStorage.clear();
    }

    logoutLink.addEventListener("click", logout);

    editButton.addEventListener("click", openModal);

    const addButton = document.querySelector(".addPicture");
    addButton.addEventListener("click", addPictureModal);
}