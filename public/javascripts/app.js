

/*
    initialisation du jeux
*/

// Si le jeu est en train de jouer une séquence,
// cette variable est à true.
var joue = false;

// La séquence du joueur en cours de sélection
// est stockée dans cette variable globale.
var clique = [];


function demarrer(){
    $.ajax('/simon/start').done(jouer);
}

$('#middle').on('click', function(e){
    demarrer();
});



/*
    Jouer la séquence
*/
function jouer(){
    joue = true;
    clique = [];

    $.ajax('/simon/next').done(function(arr){
        for(var i=0 ; i<arr.length ; i++){
            clignoter(arr[i], i);
        }
        // Passé le délai de jeu, le joueur pourra à nouveau
        // cliquer les couleurs
        setTimeout(function(){joue=false;}, 1000*i);
    });
}



/*
    Cet événement active un listener sur les blocs de couleurs
    et retourne true si la séquence saisie correspond aux couleurs
    stockées dans la variable globale "sequence".
*/
$('#simon>div:not(#middle)').on('click', function(){
    // impossible de cliquer les couleurs si le jeu est
    // en train d'afficher la séquence de couleurs
    if(joue) return;

    clique.push( $(this).attr('id') );
    comparer(clique);
});



/*
    Cette fonction compare le tableau passé en paramètre avec le tableau
    "sequence". Les retours possibles sont les suivants :
    -1 : le tableau "clique" est trop rempli
     0 : le contenu de "clique" ne correspond pas à "sequence"
     1 : les 2 tableaux sont identiques
*/
function comparer(clique){
    $.ajax({
        url: '/simon/check',
        data: {q:clique.join(',')}
    }).done(function(resultat){

        if( resultat=='OK' && clique.length==10 ){
            alert('Gagné !');
            demarrer();
        }

        if( resultat=='OK' && clique.length!=10 ){
            jouer();
        }

        if( resultat=='ko' ){
            alert('Perdu !');
            demarrer();
        }
    });
}



/*
    Faire clignoter un block de couleur. Le second paramètre définit
    dans combien de secondes le clignotement interviendra (sachant
    qu'un clignotement dure 1 seconde).
*/
function clignoter(couleur, délai){
    setTimeout(function(){
        $('#'+couleur).fadeOut(500).fadeIn(500);
    }, 1000*délai);
}