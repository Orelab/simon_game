var express = require('express');
var router = express.Router();

var liste = [];
var etape = 0;


/*
    Cette méthode initialise une liste de couleurs dans la variable
    liste, et renvoie cette liste par HTTP
*/
router.get('/start', function(req, res, next) {
  etape = 0;
  liste = new Array(10).fill(0).map(function(n){
    return ['rouge','vert','jaune','bleu'][Math.floor(Math.random()*3)];
  });
  res.send(liste?'ok':'ko');
});



/*
    une liste de couleurs est passée par la méthode GET dans une variable
    q, puis les couleurs sont comparées à la liste enregistrée côté serveur.
*/
router.get('/check', function(req, res, next) {
    var test = true;
    var test_arr = req.query.q.split(',');
    console.log(test_arr);
    console.log(etape);
    
    for(var i=0; i<test_arr.length ; i++){
        if(test_arr[i] != liste[i]){
            test = false;
        }
    }

    if( test && test_arr.length==etape ){
      res.send('OK');
    }

    res.send(test?'ok':'ko');
  });
  


  /*
    La route "next" envoie successivement un tableau contenant
  */
 router.get('/next', function(req, res, next) {
    res.send(liste.slice(0, ++etape));
  });


module.exports = router;
