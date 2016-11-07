/*global Phaser*/


var game = new Phaser.Game(800, 600, Phaser.AUTO, '');
var game_state = {}


game_state.main = function() {};
game_state.main.prototype = {


    preload: function() {

        game.load.image('sky', 'assets/sky.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.spritesheet('star', 'assets/bone.png', 32, 32);
        game.load.spritesheet('dude', 'assets/sans.png', 249, 325);
    },


    create: function() {

        game.add.sprite(0, 0, 'sky');
        this.platforms = game.add.group();
        this.platforms.enableBody = true;
        var ground = this.platforms.create(0, game.world.height - 64, 'ground');
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;
        var ledge = this.platforms.create(400, 400, 'ground');
        ledge.body.immovable = true;
        ledge = this.platforms.create(-150, 250, 'ground');
        ledge.body.immovable = true;
        ledge = this.platforms.create(500, 194, 'ground');
        ledge.body.immovable = true;
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.add.sprite(0, 18, 'star');

        this.idleAnis = ["idle1", "idle2", "idle3"];

        this.player = game.add.sprite(32, game.world.height - 256, 'dude');
        game.physics.arcade.enable(this.player);
        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = true;
        this.player.animations.add('left', [8, 9, 10, 11], 5, true);
        this.player.animations.add('right', [13, 14, 15, 16], 5, true);
        this.player.animations.add('idle1', [0, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3],1 , true);
        this.player.animations.add('idle2', [4, 5], 1, true);
        this.player.animations.add('idle3', [6, 7], 1, true);

        this.player.scale.setTo(0.5, 0.5);
        this.player.body.setSize(110, 160, 1, 82);

        this.cursors = game.input.keyboard.createCursorKeys();
        this.stars = game.add.group();
        //hy
        this.stars.enableBody = true;
        // this.stars.animations.add('spin', [1,2,3,4], 12, true);
        for (var i = 0; i < 1; i++) {
            var star = this.stars.create(i * 100, 0, 'star');
            star.body.gravity.y = 300;
            star.body.bounce.y = 0.1 + Math.random() * 0.2;
            // star.animations.add('spin', [0, 1, 2, 3], 10, true);
            // star.animations.play('spin');

        }
        this.stars.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3], 10, true);
        this.stars.callAll('animations.play', 'animations', 'spin');
        this.scoreText = game.add.text(25, 16, ': 0', {
            fontSize: '32px',
            fill: '#000'
        });
        this.score = 0;

        this.waitIdle = 0;
        this.idle = false;

    },


    update: function() {
        this.waitIdle++;
        game.physics.arcade.collide(this.player, this.platforms);

        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -150;
            this.player.animations.play('left');
            this.waitIdle = 0;
        }

        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = 150;
            this.player.animations.play('right');
            this.waitIdle = 0;
        }
        else {
            //this.player.animations.stop();

            if (this.waitIdle > 100 && !this.idle) {
                this.idle = true; 
                this.player.animations.play(this.idleAnis[1]);

                var that = this;
                setTimeout(function() {
                    that.waitIdle = 0;
                    that.idle = false;
                }, 1000);
            }
            else {
                this.player.frame = 12;
            }


        }
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.waitIdle = 0;
            this.player.body.velocity.y = -350;
        }
        game.physics.arcade.collide(this.stars, this.platforms);
        game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);


        //game.debug.body(this.player);
    },

    collectStar: function(player, star) {
        this.score += 1;
        this.scoreText.text = ": " + this.score;
        star.kill();
        star = this.stars.create(Math.random() * 800, Math.random() * 80, 'star');
        star.body.gravity.y = 300;
        star.body.bounce.y = 0.1 + Math.random() * 0.2;
        star.animations.add('spin', [0, 1, 2, 3], 10, true);
        star.animations.play('spin');
    }
};
game.state.add('main', game_state.main);
game.state.start('main');
//for (var i = 0; i < 1; i++) {
//var star = this.stars.create(i * Math.random(1,400), i * Math.random(1,400), 'star');
