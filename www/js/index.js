var app = {
    // Application Constructor
    initialize: function(){
        //inicialization de variables
        diametrobola = 48;
        difficulty = 0;
        h = document.documentElement.clientHeight;
        w = document.documentElement.clientWidth;
        velocityX = 0;
        valocityY = 0;
        score = 0;

        app.watchAcceleration();
        app.startGame();
    },
    startGame: function(){
        
        function preload(){
            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.stage.backgroundColor = '#f27d0c';
            
            game.load.image('bola', 'img/logo_sm.png');
            game.load.image('objetivo', 'assets/bola.png');
        }

        function create(){
            scoreText = game.add.text(16, 16, score, { fontSize: '100px', fill: '#757676' });
            // Bola con movimiento
            bola = game.add.sprite(app.startX(), app.startY(), 'bola');
            game.physics.arcade.enable(bola);
            // Objetivo estático
            objetivo = game.add.sprite(app.startX(), app.startY(), 'objetivo');
            game.physics.arcade.enable(objetivo);

            bola.body.collideWorldBounds = true;
            bola.body.onWorldBounds = new Phaser.Signal();
            bola.body.onWorldBounds.add(app.scoreDown, this);
        }

        function update(){
            var factorD = (300 + (difficulty *100 ));
            bola.body.velocity.y = (velocityY * 300);
            bola.body.velocity.x = (velocityX * -300);

            game.physics.arcade.overlap(bola,objetivo,app.scoreUp,null, this );
        }

        var states = {preload: preload, create: create, update: update};
        // Se crea un juego de Phaser, en phase canvas
        var game = new Phaser.Game(w, h, Phaser.CANVAS, 'phaser', states);
    },
    startX: function(){
        return app.numAleTo(w-diametrobola);
    },
    startY: function(){
        return app.numAleTo(h-diametrobola);
    },
    numAleTo: function(limite){
        return Math.floor(Math.random() * limite);
    },
    watchAcceleration: function(){
        function onError(){
            console.log("onError!");
        }
        function onSuccess(datosAceleracion){
            app.getAgitation(datosAceleracion);
            app.registerDirection(datosAceleracion);
        }
        navigator.accelerometer.watchAcceleration(onSuccess, onError,{frequency: 10 });
    },
    getAgitation: function(datosAceleracion){
        agitationX = datosAceleracion.x >10;
        agitationY = datosAceleracion.y >10;

        if(agitationX || agitationY){            
            setTimeout(app.startAgain, 2000);
        }
    },
    scoreDown: function() {
        score = score - 1;
        scoreText.text = score;
    },
    scoreUp: function() {
        score = score + 2;
        scoreText.text = score;

        objetivo.body.x = app.startX();
        objetivo.body.y = app.startY();

        if(difficulty>0){
            difficulty = difficulty +1;
        }
    },
    startAgain: function(){
        document.location.reload(true);
    },
    registerDirection: function(datosAceleracion){
        velocityX = datosAceleracion.x;
        velocityY = datosAceleracion.y;
    }
};
if ('addEventListener' in document){
    document.addEventListener('deviceready', function() {
        console.log('Cargando App.....');
        app.initialize();
    },false);
}