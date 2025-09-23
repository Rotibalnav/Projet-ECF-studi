//Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
   //DOM = Document Object Model, c'est la réprésentation de la structure du document HTML dans le navigateur
   //Cet évènement s'assure que tout le code ci-dessous ne s'exécute qu'une fois
   //Que la page est entièrement chargée, évitant ainsi les erreurs liées à des éléments non disponibles

   //Récupérer le formulaire et la zone de feedback
   let contactForm = document.getElementById('contactForm');
   let formFeedback = document.getElementById('formFeedback');

   //Fonction pour échapper les caractères spéciaux (protection XSS)
   function escapeHTML(html) {
       //Cette fonction est CRUCIALE pour la sécurité
       //Elle remplace les caractères qui pourraient être utilisés pour des attaques XSS
       // par leurs équivalents inoffensifs (entités HTML)

       const map = {
           '&' : '&amp;',
           '<' : '&lt;',
           '>' : '&gt;',
           '"' : '&quot;',
           "'" : '&#039;'
       };
       
       // /[&<>"']/g est une expression régulière qui correspond à tous les caractères spéciaux:
       // les crochets [] créent une "classe de caractères" qui match tous les caractères à l'intérieur
       // le "g" à la fin signifie "global" - la recherche se fait sur toute la chaîne, pas juste la première occurrence
       //Cette regex trouve tous les caractères qui sont soit &, <, >, ", ou '
       return html.replace(/[&<>"']/g, function(m) {
           return map[m];
       });
   }
   //Ajouter un écouteur d'évènement pour le formulaire
   contactForm.addEventListener('submit', function(event) { //Quand on soumet un formulaire, le navigateur recharge normalement la page
       event.preventDefault(); // Empêcher l'envoi du formulaire ou rechargement de la page
       //Cela permet de traiter les données du formulaire avec JavaScript sans recharger la page

       //Réinitialiser le message de feedback
       formFeedback.innerHTML = '';
       formFeedback.className = 'mb-3'; //Ajouter une classe pour le style

       //Récupérer les valeurs des champs du formulaire et les nettoyer
       const emailInput = document.getElementById('email');
       const genderInput = document.getElementById('gender');
       const firstnameInput = document.getElementById('firstname');
       const nameInput = document.getElementById('name');
       const dateOfYearInput = document.getElementById('dateofyear');
       const userNameInput = document.getElementById('username');
       const passwordInput = document.getElementById('password');
       const confirmPasswordInput = document.getElementById('confirmpassword');
     

       //Récupération sécuriséé des valeurs
       const email = emailInput.value.trim();
       const gender = genderInput.value.trim();
       const firstName = firstnameInput.value.trim();
       const name = nameInput.value.trim();
       const dateOfYear = dateOfYearInput.value.trim();
       const userName = userNameInput.value.trim();
       const password = passwordInput.value.trim();
       const confirmPassword = confirmPasswordInput.value.trim();
       //trim() permet de supprimer les espaces au début et à la fin de la chaîne
       //Cela est important pour éviter des valeurs comme "   " (juste des espaces)


       //Valider les données
       if (!validateForm(email, firstname, name, dateofyear, username, password, confirmpassword)) {
           return false;
       }

       //Préparer les données pour l'envoi (avec échappement HTML)
       const formData = {
           email: escapeHTML(email),
           gender: escapeHTML(gender),
           firstname: escapeHTML(firstName),
           name: escapeHTML(name),
           dateofyear: escapeHTML(dateOfYear),
           username: escapeHTML(userName),
           password: escapeHTML(password),
           confirmpassword: escapeHTML(confirmpassword),
           timestamp: new Date().toISOString()
       };
       //Nous créons un object JavaScript qui contient toutes les données du formulaire
       //escapeHTML() protège contre les attaques XSS en neutralisant le code malveillant
       //new Date().toISOString() génère un timestamp au format ISO 8601 date et heure actuelle au format standard
         console.log('Données du formulaire:', formData);

       //Simuler l'envoi au backend (à remplacer par votre appel API réel)
       sendToBackend(formData);

       /*Afficher un message de confirmation
       formFeedback.innerHTML = `<p>Merci ${surname}, nous avons bien reçu votre message.</p>`;*/

   });

      //Fonction de la validation des données
         function validateForm(email, firstname, name, dateofyear, username, password, confirmpassword){
         //Cette fonction vérifie que chaque champs respectent certaines règles
         //Si un champ ne respecte pas les règles, on ajoute un message d'erreur

         let isValid = true;
         let errors = [];

        
            //Validation de l'email avec regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         // /^[^\s@]+@[^\s@]+\.[^\s@]+$/ est une expression régulière qui valide un email basique:
        // ^ : début de la chaîne
        // [^\s@]+ : Un ou plusieurs caractères (+) qui ne sont NI un espace (\s) NI un @ ([^\s@])
        //           Le ^ à l'intérieur des crochets signifie "tout sauf" ces caractères
        // @ : le caractère @ littéral
        // [^\s@]+ : Même chose qu'avant, un ou plusieurs caractères qui ne sont ni espace ni @
        // \. : un point littéral (échappé avec \ car le point seul a une signification spéciale)
        // [^\s@]+ : Encore la même chose pour le domaine de premier niveau (.com, .fr, etc.)
        // $ : fin de la chaîne
        // 
        // Exemples valides: exemple@domaine.com, a@b.c
        // Exemples invalides: exemple@, exemple@domaine, exemple.com
        if(!emailRegex.test(email)) {
            errors.push('L\'email est invalide!!!');
            isValid = false;
        }
         //Validation du prénom
         if(firstname === '') {
            errors.push('Le prénom est requis!!!');
            isValid = false;
         }
         //Validation du nom
         if(fullName === '') {
            errors.push('Le nom complet est requis!!!');
            isValid = false;
         }
         //Validation de la date de naissance
         if(dateofYear === '') {
            errors.push('La date de naissance est requise!!!');
            isValid = false;
         }
         //Validation du nom d'utilisateur
         if(username === '') {
            errors.push('Le nom d\'utilisateur est requis!!!');
            isValid = false;
         }
         //Validation du mot de passe
         if(password === '') {
            errors.push('Le mot de passe est requis!!!');
            isValid = false;
         }
         //Validation de la confirmation du mot de passe
         if(confirmPassword === '') {
            errors.push('La confirmation du mot de passe est requise!!!');
            isValid = false;
         }
         //Vérification que les deux mots de passe correspondent
         if(password !== confirmPassword) {
            errors.push('Les mots de passe ne correspondent pas!!!');
            isValid = false;
         }
        
        //Afficher les erreurs éventuelles (avec protection XSS)
        if (!isValid) {
            const errorHTML = `
            <div class="alert alert-danger">
              <ul class="mb-0">
                  ${errors.map(error => `<li>${escapeHTML(error)}</li>`).join('')}
              </ul>
            </div>
            `;
            formFeedback.innerHTML = errorHTML;
            // Si le formulaire n'est pas valide, on construit un message HTML
            // map() applique une fonction à chaque élément du tableau errors
            // join('') combine tous les éléments du tableau en une seule chaîne
            // Nous protégeons également les messages d'erreur avec escapeHTML
        }

        return isValid;
    }
    //Fonction d'envoi des données au backend
    function sendToBackend(formData) {
        formFeedback.innerHTML = '<div class="alert alert-info">Envoi des données...</div>';

         setTimeout(() => {
            try {
                // Simuler une réponse réussie du serveur
                console.log('Données envoyées au backend:', formData);
                
                // Afficher un message de succès (sécurisé)
                formFeedback.innerHTML = '<div class="alert alert-success">Votre message a été envoyé avec succès!</div>';
                
                // Réinitialiser le formulaire
                contactForm.reset();
                
                // ======= EXPLICATION POUR DÉBUTANTS =======
                // reset() efface tous les champs du formulaire et les remet à leur état initial
                
                // Optionnel: rediriger l'utilisateur après un délai
                // setTimeout(() => { window.location.href = '/merci'; }, 3000);
                
            } catch (error) {
                // Gérer les erreurs
                console.error('Erreur lors de l\'envoi:', error);
                formFeedback.innerHTML = '<div class="alert alert-danger">Une erreur est survenue. Veuillez réessayer plus tard.</div>';
                
                // ======= EXPLICATION POUR DÉBUTANTS =======
                // try/catch permet de "capturer" les erreurs qui pourraient survenir
                // Si une erreur se produit, on affiche un message à l'utilisateur
            }
        }, 1500); // Délai simulé de 1,5 secondes
    }

});

//Ajouter une validation en temps réel sur l'email
const emailInput = document.getElementById('email');
emailInput.addEventListener('blur', function() {
    const email = this.value.trim();

    //Regex plus stricte pour l'email
    const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    //======= EXPLICATION REGEX DETAILLEE EMAIL STRICTE =======
    // /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ est une expression régulière plus stricte:
    // ^ : début de la chaîne
    // [a-zA-Z0-9._%+-]+ : Un ou plusieurs caractères parmi:
    //     a-z : toutes les lettres minuscules
    //     A-Z : toutes les lettres majuscules
    //     0-9 : tous les chiffres
    //     ._%+- : caractères spéciaux autorisés avant le @
    // @ : le caractère @ littéral
    // [a-zA-Z0-9.-]+ : Un ou plusieurs caractères pour le nom de domaine (lettres, chiffres, points, tirets)
    // \. : un point littéral
    // [a-zA-Z]{2,} : Au moins 2 lettres pour l'extension (.fr, .com, .io, etc.)
    // $ : fin de la chaîne
    //
    // Cette regex est plus stricte et n'accepte que les caractères courants dans les emails
    
    if (email && !strictEmailRegex.test(email)) {
        this.classList.add('is-invalid');
        // Créer un message d'erreur s'il n'existe pas déjà
        if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('invalid-feedback')) {
            const feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            feedback.textContent = 'Veuillez entrer une adresse email valide (exemple: nom@domaine.com)';
            this.parentNode.insertBefore(feedback, this.nextSibling);
        }
    } else {
        this.classList.remove('is-invalid');
        // Supprimer le message d'erreur s'il existe
        if (this.nextElementSibling && this.nextElementSibling.classList.contains('invalid-feedback')) {
            this.nextElementSibling.remove();
        }
    }
});

//Ajouter une validation en temps réel pour le message (avec regex pour détecter les mots offensants)
const messageInput = document.getElementById('message');
messageInput.addEventListener('input', function() {
    const message = this.value.trim();

    // Regex pour détecter des mots offensants (exemple simplifié)
     const bannedWordsRegex = /\b(insulte1|insulte2|badword)\b/i;
        // /\b(insulte1|insulte2|badword)\b/i est une expression régulière pour trouver des mots spécifiques:
        // \b : indique une limite de mot, pour éviter de détecter ces lettres à l'intérieur d'autres mots
        // (insulte1|insulte2|badword) : groupe avec alternatives séparées par |
        //    Le | fonctionne comme un "OU" - la regex matchera si elle trouve l'un de ces mots
        // \b : une autre limite de mot
        // i : modificateur "insensible à la casse" - la regex ignorera les différences majuscules/minuscules
        //
        // Remplacez "insulte1", "insulte2", "badword" par les vrais mots que vous voulez interdire

   if (message && bannedWordsRegex.test(message)) {
       this.classList.add('is-invalid');

       //message d'erreur
       if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('invalid-feedback')) {
           const feedback = document.createElement('div');
           feedback.className = 'invalid-feedback';
           feedback.textContent = 'Votre message contient des termes inappropriés.';
           this.parentNode.insertBefore(feedback, this.nextSibling);
       }
   }
   else {
    this.classList.remove('is-invalid');
         //Si le message est valide, on retire la classe d'erreur
         if (this.nextElementSibling && this.nextElementSibling.classList.contains('invalid-feedback')) {
              this.nextElementSibling.remove();
         }
   }

});
