import Formulaire from "./formulaire.js";

//création du formulaire

const formulaire = new Formulaire('formulaire');

formulaire.maskChamp('vehicule');

formulaire.maskChamp('email');

//addEventListener pour channger le comportement du formulaire en fonction du racio selectionné

formulaire.getElement('passager').addEventListener('change', () => {formulaire.hideChamp("vehicule")});

formulaire.getElement('covoitureur').addEventListener('change', () => {formulaire.showChamp("vehicule")});

//addElementListener pour changer le comportement du formulaire en fonction de l'objet selectionné

formulaire.getElement('objet').addEventListener('change', () => {formulaire.isSelected('objet', "annulation_de_trajet", () => {formulaire.showChamp('email')}, () => {formulaire.hideChamp('email')})});

//addEventListener pour recupérer les réponses au formulaire lors de la soumission

formulaire.formulaireHtml.addEventListener('submit', 
    (event) => {
        event.preventDefault();//empêche le comportement par défaut du formulaire
        formulaire.affAnswers();//affiche les réponses du formulaire
        console.log(formulaire.getAnswers());//affiche les réponses dans la console
    }
)