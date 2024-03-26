const token = window.localStorage.getItem("token");

if(token){

    const editModeBanner = document.querySelector(".editModeBanner");
    editModeBanner.style="display: flex";

    const loginLink = document.querySelector(".loginLink");
    loginLink.style="display: none";

    const logoutLink = document.querySelector(".logoutLink");
    logoutLink.style="display: inline-block";

    const portfolioTitle = document.querySelector(".editButton");
    portfolioTitle.style="padding-left: 100px";

    const editButton = document.querySelector(".editButton span");
    editButton.style="display: inline-block";

    editButton.addEventListener("click", () => {

        
    });
    
}