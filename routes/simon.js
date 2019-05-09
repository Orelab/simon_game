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
    return ['rouge','vert','jaune','bleu'][Math.floor(Math.random()*4)];
  });
  res.send(liste?'ok':'ko');
});
  


/*
  La route "next" envoie successivement un tableau contenant la première
  couleurs, puis les deux premières couleurs, et ainsi de suite...
*/
router.get('/next', function(req, res, next) {
  res.send(liste.slice(0, ++etape));
});



/*
  une liste de couleurs est passée par la méthode GET dans une variable
  q, puis les couleurs sont comparées à la liste enregistrée côté serveur.
*/
router.get('/check', function(req, res, next) {
  var test = true;
  var test_arr = req.query.q.split(',');
  
  for(var i=0; i<test_arr.length ; i++){
      if(test_arr[i] != liste[i]){
          test = false;
      }
  }
  if( test && test_arr.length==etape )
    res.send('OK');
    else
    res.send(test?'ok':'ko');
});


module.exports = router;
