

export function ajoutListenersAvis() {

    const piecesElements = document.querySelectorAll(".fiches article button");
 
    for (let i = 0; i < piecesElements.length; i++) {
         piecesElements[i].addEventListener("click", async function (event) {
 
      //  const id = event.target.dataset.id;
      //  fetch(`http://localhost:8081/pieces/${id}/avis`);
      // ajout-remplacement P3C2
      //const id = event.target.dataset.id;
      //const reponse = await fetch("http://localhost:8081/pieces/" + id + "/avis");
        const id = event.target.dataset.id;
        const reponse = await fetch("http://localhost:8081/pieces/" + id + "/avis");
        const avis = await reponse.json();

        window.localStorage.setItem(`avis-piece-${id}`, JSON.stringify(avis))
        const pieceElement = event.target.parentElement;
        afficherAvis(pieceElement, avis)
        
        });
 
    }
 
 }
export function afficherAvis(pieceElement, avis){
    const avisElement = document.createElement("p");
    for (let i = 0; i < avis.length; i++) {
        avisElement.innerHTML += `${avis[i].utilisateur} : ${avis[i].commentaire} --- ${avis[i].nbEtoiles} * <br>`;
        } // rajout phZ affichage du nombre étoiles
    pieceElement.appendChild(avisElement)
    
}


export async function ajoutListenerEnvoyerAvis() {
    const formulaireAvis = document.querySelector(".formulaire-avis");
    formulaireAvis.addEventListener("submit", function (event) {
    event.preventDefault();
    // Création de l’objet du nouvel avis.
    const avis = {
        pieceId: parseInt(event.target.querySelector("[name=piece-id]").value),
        utilisateur: event.target.querySelector("[name=utilisateur]").value,
        commentaire: event.target.querySelector("[name=commentaire]").value,
        nbEtoiles: parseInt(event.target.querySelector("[name=nbEtoiles]").value)
    };
    // Création de la charge utile au format JSON
    const chargeUtile = JSON.stringify(avis);
    // Appel de la fonction fetch avec toutes les informations nécessaires
    fetch("http://localhost:8081/avis/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: chargeUtile
    });
    });
    
 }

 export async function afficherGraphiqueAvis() {
    // Calcul du nombre de commentaires par quantité d'étoiles attribuées
    const avis = await fetch("http://localhost:8081/avis/").then(avis => avis.json()); // autre forme de programmation asynchrone
    const nb_commentaires = [0, 0, 0, 0, 0];
    for (let commentaire of avis) {
        nb_commentaires[commentaire.nbEtoiles - 1]++;
        console.log(nb_commentaires)
    }

    // Légende qui s'affichera sur la gauche à côté de la barre horizontale
    const labels = ["5", "4", "3", "2", "1"];

    // Données et personnalisation du graphique
    const data = {
        labels: labels,
        datasets: [{
            label: "Étoiles attribuées",
            data: nb_commentaires.reverse(),
            backgroundColor: "rgba(255, 230, 0, 1)", // couleur jaune
        }],
    };

    // Objet de configuration final
    const config = {
        type: "bar",
        data: data,
        options: {
        indexAxis: "y",
        },
    };
    
    //rendu du graphique dans l'élément canvas
    const avisGraphique = new Chart(
        document.querySelector("#graphique-avis"),
        config,
    )

 }

