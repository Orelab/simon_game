
mocha.setup('bdd'); // Behaviour Driven Development
chai.use(chaiHttp);
//chai.use(chaiDom);
var expect = chai.expect;

var url = 'http://localhost:3000';
var url = window.location.origin;




describe('Le jeu du Simon', function(){


    /*
        Tester le backend
    */
    describe('Tester le backend', function(){

        var couleurs = [];

        it('Initialisation du jeu', function(done){
            chai.request(url)
                .get('/simon/start')
                .end(function(err, res){
                    expect(res.text).to.be.equal('ok');
                    done();
                });
        });
        it('Récupération des deux premières séquences', function(done){
            chai.request(url)
                .get('/simon/next')
                .end(function(err, res){
                    couleurs = JSON.parse(res.text);

                    expect(res).to.be.json;
                    expect(couleurs).to.be.an('array');
                    expect(couleurs).to.have.lengthOf(1);

                    chai.request(url)
                        .get('/simon/next')
                        .end(function(err, res){
                            couleurs = JSON.parse(res.text);
                            expect(couleurs).to.have.lengthOf(2);
                            done();
                        });
                });
        });
        it('Validation premier résultat positif', function(done){
            chai.request(url)
                .get('/simon/check?q='+couleurs[0])
                .end(function(err, res){
                    expect(res.text).to.equal('ok');
                    done();
                });
        });
        it('Validation deux premiers résultats positifs', function(done){
            chai.request(url)
                .get('/simon/check?q='+couleurs.join(','))
                .end(function(err, res){
                    expect(res.text).to.equal('OK');
                    done();
                });
        });
        it('Retour premier résultat erronné', function(done){
            chai.request(url)
                .get('/simon/check?q=gris')
                .end(function(err, res){
                    expect(res.text).to.equal('ko');
                    done();
                });
        });
    });




    /*
        Tester le frontend
    */
    describe('Tester le frontend', function(){
        it('L\'interface est en HTML', function(done){
            chai.request(url)
                .get('/')
                .end(function(err, res){
                    expect(res).to.be.status(200);
                    expect(res).to.be.html;
                    done();
                });
        });
        it('L\'interface contient un DIV nommé "#simon"', function(done){
            var simon_id = $('#simon').attr('id');
            expect(simon_id).to.equal('simon');
            done();
        });
        it('L\'interface contient 4 DIV de couleurs (méthode HTTP)', function(done){
            chai.request(url)
                .get('/')
                .end(function(err, res){
                    var id_rouge = res.text.indexOf('id="rouge"');
                    var id_vert = res.text.indexOf('id="vert"');
                    var id_bleu = res.text.indexOf('id="bleu"');
                    var id_jaune = res.text.indexOf('id="jaune"');

                    expect(id_rouge).to.be.at.least(1);
                    expect(id_vert).to.be.at.least(1);
                    expect(id_bleu).to.be.at.least(1);
                    expect(id_jaune).to.be.at.least(1);
                    done();
                });
        });
        it('L\'interface contient 4 DIV de couleurs (méthode DOM)', function(done){
            var rouge_id = $('#rouge').attr('id');
            var vert_id = $('#vert').attr('id');
            var bleu_id = $('#bleu').attr('id');
            var jaune_id = $('#jaune').attr('id');
            expect(rouge_id).to.equal('rouge');
            expect(vert_id).to.equal('vert');
            expect(bleu_id).to.equal('bleu');
            expect(jaune_id).to.equal('jaune');
            done();
        });
        it('La couleur rouge clignote', function(done){
            clignoter('rouge',0); // La fonction testée

            // opacité maintenant
            var opacity_at_start = parseFloat($('#rouge').css('opacity'));
            expect(opacity_at_start).to.be.closeTo(0.9, 0.1);

            // opacité dans 1/2 seconde
            setTimeout(function(){
                var opacity_at_middle = parseFloat($('#rouge').css('opacity'));
                expect(opacity_at_middle).to.be.at.closeTo(0.1, 0.1);
            }, 500);

            // opacité dans 1 seconde
            setTimeout(function(){
                var opacity_at_end = parseFloat($('#rouge').css('opacity'));
                expect(opacity_at_end).to.be.at.closeTo(0.9, 0.1);
                done();
            }, 1000);
        });
    });

});


mocha.run();
