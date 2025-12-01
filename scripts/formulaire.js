export default class Formulaire {
    //définition du constructeur

    constructor(id) {
        this.id = id;
        //propriété d'instance(récupere le formulaire HTML via le DOM)
        this.formulaireHtml = document.getElementById(this.id);
        //propriété d'instance (récupere les données du formulaire sous forme d'objet FormData)
        this.formdata = new FormData(this.formulaireHtml);
        //propriété d'instance (tableau pour stocker les réponses)
        this.answers = new Array();
    }

    //méthode pour récupérer le parent div d'un élément par son id
    getDiv(id) {
        return document.getElementById(id).parentNode;
    }

    //méthode pour récupérer un élément par son id
    getElement(id) {
        return document.getElementById(id);
    }

    //méthode permettant de masquer un élément sans animation
    maskChamp(id) {
        this.getDiv(id).classList.add('masque');//ajoute la classe masque
        this.getElement(id).required = false;//rend le champ non requis
    }
    //méthode permettant d'afficher le champ
    showChamp(id) {
        this.getDiv(id).classList.remove('disp');//retire la classe disp
        this.getDiv(id).classList.add('app');//ajoute la classe app
        this.getElement(id).required = true;//rend le champ requis(recupère l'input)
    }

    //méthode permettant de masquer le champ avec animation
    hideChamp(id) {
        this.getDiv(id).classList.remove('app');//retire la classe app
        this.getDiv(id).classList.add('disp');//ajoute la classe disp
        this.getElement(id).required = false;//rend le champ non requis
    }

    //méthodde pour savoir si un radio est selectionné

    isSelected(id, value, action, otherAction) {
        this.formdata = new FormData(this.formulaireHtml);//met à jour l'objet formdata
        if (this.formdata.get(id) === value) {
            action();//recupere la valeur renseigné par l'utilisateur
    }
        else {
            otherAction();
        }
    }

    //méthode pour récuperer les élements de chaque input (et les ajouter au tableau answers)

    getAnswers() {
        //insatanciation de la classe FormData
        this.formdata = new FormData(this.formulaireHtml);
        //parcourir toutes les paires clé/valeur de l'objet formdata
        this.formdata.forEach(
        //fonction anonyme  
          (value, key) => {
                if(value != "" && value != "on") {
                    this.answers.push([key, value]);//ajoute la paire clé/valeur au tableau answers
                }
            }
        )
        return this.answers  
    }

    //méthode pour afficher dans un alert les réponses du formulaire

    affAnswers() {
        let chaine = "Voici les réponses du formulaire\n\n"; //definit la chaine de caractères(variable)
        for (let ligne of this.getAnswers()) {
            chaine += `${ligne [0]} : ${ligne[1]}\n`
        } //ajoute chaque réponse à la chaine
        alert(chaine);
    }

}    