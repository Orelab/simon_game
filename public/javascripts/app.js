

/*
    initialisation du jeux
*/
function demarrer(){
    $.ajax('/simon/start').done(jouer);
}

demarrer();



/*
    Jouer la séquence
*/
function jouer(){
    $.ajax('/simon/next').done(function(arr){

        for(var i=0 ; i<arr.length ; i++){
            clignoter(arr[i], i);
        }

        ecouter();
    });
}



/*
    Cette fonction active un listener sur les blocs de couleurs
    et retourne true si la séquence saisie correspond aux couleurs
    stockées dans la variable globale "sequence".
*/
function ecouter(){
    var clique = [];
    $('#simon>div').on('click', function(){
        clique.push( $(this).attr('id') );

        comparer(clique);
        /* ){
            case -1:
                alert('Perdu, on recommence !');
                demarrer();
                break;

            case 1:
                $('#simon>div').off('click');
                jouer();
                break;

            case 0:
            default: // rien
        }
        */
    });
}



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
            $('#simon>div').off('click');
            demarrer();
            return;
        }

        if( resultat=='OK' ){
            $('#simon>div').off('click');
            jouer();
        }

        if( resultat=='ko' ){
            alert('Perdu !');
            $('#simon>div').off('click');
            demarrer();
        }
    });
/*
    if( clique.length > sequence.length ){
        return -1;
    }

    if( clique.length < sequence.length ){
        return 0;
    }

    for(var i=0 ; i<sequence.length ; i++){
        if( clique[i] != sequence[i] ){
            return 0;
        }
    }
    return 1;
*/
}



/*
    Faire clignoter un block de couleur. Le second paramètre définit
    dans combien de secondes le clignotement interviendra (sachant
        qu'un clignotement dure 1 seconde).
*/
function clignoter(couleur, secondes){
    setTimeout(function(){
        $('#'+couleur).fadeOut(500).fadeIn(500); 
    }, 1000*secondes);
}