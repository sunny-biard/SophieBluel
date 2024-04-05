const form = document.querySelector(".loginForm");
form.addEventListener("submit", function (event) {
    
    event.preventDefault();

    const user = {
        email: event.target.querySelector("[name=user_mail]").value,
        password: event.target.querySelector("[name=user_password]").value,
    };

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then((resp) => resp.json())
    .then(session => {

        if(session.userId){
            
            window.localStorage.setItem("userId", session.userId);
            window.localStorage.setItem("token", session.token);
            window.location.href = "index.html";
        }
        else{

            window.alert("Erreur dans l’identifiant et/ou le mot de passe");
        }
            
    })
});
 