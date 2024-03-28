const token = window.localStorage.getItem("token");

if(token){

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
    
    const focusableSelectors = "button, a, file, input, select"

    function openModal() {

        let modal = document.querySelector(".modal");
        modal.style = "display: flex";
        modal.style.setProperty("animation", "fadeIn .3s both");
        modal.querySelector(".modalWrapper").style.setProperty("animation", "slideFromTop .3s both");
        modal.removeAttribute("aria-hidden");
        modal.setAttribute("aria-modal", "true");

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

        let activeModal = document.querySelector(".modal");

        if(activeModal !== null){

            activeModal.style.setProperty("animation", "fadeOut .3s both");
            activeModal.querySelector(".modalWrapper").style.setProperty("animation", "slideToBottom .3s both");
            
            window.setTimeout(function() {

                activeModal.style="display: none";
            }, 500);

            activeModal.setAttribute("aria-hidden", "true");
            activeModal.removeAttribute("aria-modal");
            activeModal.querySelector(".galleryInModal").removeEventListener("click", deleteWork);
            activeModal.querySelectorAll(".galleryInModal figure").forEach(element => {

                element.remove();
            })

            activeModal.removeEventListener("click", closeModal);
            activeModal.querySelector(".closeModalButton").removeEventListener("click", closeModal);
            activeModal.querySelector(".modalWrapper").removeEventListener("click", stopPropagation);

            window.removeEventListener("keydown", manageKeyboard);
        }
    }

    function stopPropagation(e) {
        
        e.stopPropagation();
    }

    function manageKeyboard(e) {

        e.preventDefault();

        if(e.key === "Escape" || e.key === "Esc"){
            
            if(!document.querySelector(".modal2[aria-hidden=\"true\"]")){
                
                closeModal2();
            }
            else{
               
                closeModal();
            }
        }

        if(e.key === "Tab"){

            let focusables = [];
            let index;

            if(!document.querySelector(".modal2[aria-hidden=\"true\"]")){
                
                focusables = Array.from(document.querySelector(".modal2").querySelectorAll(focusableSelectors));
                index = focusables.findIndex(f => f === document.querySelector(".modal2").querySelector(":focus"));
            }
            else{

                focusables = Array.from(document.querySelector(".modal").querySelectorAll(focusableSelectors));
                index = focusables.findIndex(f => f === document.querySelector(".modal").querySelector(":focus"));
            }

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

            let gallery = document.querySelector(".gallery");
            let galleryInModal = document.querySelector(".galleryInModal");

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

    function openModal2(){

        let modal2 = document.querySelector(".modal2");
        modal2.style="display: flex";
        modal2.removeAttribute("aria-hidden");
        modal2.setAttribute("aria-modal", "true");

        modal2.addEventListener("click", closeModal2);
        modal2.querySelector(".closeModalButton2").addEventListener("click", closeModal2);
        modal2.querySelector(".previousModalButton").addEventListener("click", previousModal);
        modal2.querySelector(".modalWrapper2").addEventListener("click", stopPropagation);
    }

    function closeModal2(e) {

        let activeModal = document.querySelector(".modal2");
        let previousModal = document.querySelector(".modal");

        if(activeModal !== null){

            if(!e || e.target.className == "closeModalButton2"){

                activeModal.style.setProperty("animation", "fadeOut .3s both");
                activeModal.querySelector(".modalWrapper2").style.setProperty("animation", "slideToBottom .3s both");

                previousModal.style.setProperty("animation", "none");
                previousModal.querySelector(".modalWrapper").style.setProperty("animation", "none");

                closeModal();
            }
            
            window.setTimeout(function() {

                activeModal.style="display: none";
            }, 500);

            activeModal.setAttribute("aria-hidden", "true");
            activeModal.removeAttribute("aria-modal");
            
            activeModal.removeEventListener("click", closeModal2);
            activeModal.querySelector(".closeModalButton2").removeEventListener("click", closeModal2);
            activeModal.querySelector(".previousModalButton").removeEventListener("click", closeModal2);
            activeModal.querySelector(".modalWrapper2").removeEventListener("click", stopPropagation);

            window.removeEventListener("keydown", manageKeyboard);
        }
    }

    function previousModal() {

        let activeModal = document.querySelector(".modal2");

        if(activeModal !== null){

            activeModal.style = "animation: none";
            activeModal.querySelector(".modalWrapper2").style = "animation: none";
            
            window.setTimeout(function() {

                activeModal.style="display: none";
            }, 500);

            activeModal.setAttribute("aria-hidden", "true");
            activeModal.removeAttribute("aria-modal");
 
            activeModal.removeEventListener("click", closeModal2);
            activeModal.querySelector(".closeModalButton2").removeEventListener("click", closeModal2);
            activeModal.querySelector(".previousModalButton").removeEventListener("click", closeModal2);
            activeModal.querySelector(".modalWrapper2").removeEventListener("click", stopPropagation);
        }
    }

    editButton.addEventListener("click", openModal);

    const addButton = document.querySelector(".addPicture");
    addButton.addEventListener("click", openModal2);
}