var config = {
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#DDD897',
    width: 800,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var birddie = false;
var self;
var player;
var keys;
var moveMouse;
var playerdirection;
var pipe;
var pipes;
var pointpipe;
var pointpipes;
var clear;
var mypoints = 0;
var pppbg;
var newbg;
var ground;
var game = new Phaser.Game(config);

function preload ()
{
    this.load.audio('song', 'assets/fbremix.mp3');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('block', 'assets/block.png');
    this.load.image('hole', 'assets/hole.png');
    this.load.image('holeup', 'assets/holeup.png');
    this.load.image('holedown', 'assets/holedown.png');
    this.load.image('bg', 'assets/bg.png');
    this.load.spritesheet('bird', 'assets/bird.png', { frameWidth: 36, frameHeight: 26 });
    
}

function create ()
{
    var music = this.sound.add('song');
    music.play({loop:true});

    self = this;
    this.score = this.add.text(16, 16, 'Score: 0', { fontFamily: 'Mali', fontSize: '32px', fill: '#fff' });
    this.score.setDepth(100);
    //this.add.image(0, 0, 'bg').setOrigin(0);

    platforms = this.physics.add.staticImage(400, 550, 'ground');
    platforms.setDepth(5);
    let pos = 350
    if(window.innerWidth<800){
        pos = window.innerWidth/2 - 70;
    }
    player = this.physics.add.sprite(pos, 250, 'bird');
    
    this.physics.add.collider(player, platforms);
    clear = this.physics.add.image(-102, 0, 'clear').setOrigin(0).setDisplaySize(1, 800);

    this.anims.create({
        key: 'fly',
        frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: 0
    });
    

    //  Player physics properties. Give the little guy a slight bounce.
    //player.setBounce(0.2);
    player.setGravity(0, 600);
    player.setDepth(2);
    player.setCollideWorldBounds(true); 
    
    keys = this.input.keyboard.addKeys('Space');
    this.input.on('pointerup', function(){
        moveMouse = true;
        playerdirection=true;
        setTimeout(function(){
            playerdirection=false;
            
        }, 100);
    }, this);

    this.pipes = this.add.group();
    this.pointpipes = this.add.group();
    

        this.timedEvent = this.time.addEvent({
            delay: 1000,
            callback: addPipeRows,
            callbackScope: this,
            loop: true
        });

        
        this.pppbg = this.add.group();
        for (let i = 0; i < 103; i++) {
            newbg = this.physics.add.image(648*i, -90, 'bg').setVelocity(-50, 0).setOrigin(0).setDepth(1);
            //newbg = this.physics.add.image(648*i, -90, 'bg').setOrigin(0).setDepth(1);
            this.pppbg.add(newbg);
        }

     
        this.physics.add.overlap(clear, this.pipes.children.entries, destroyPipe, null, this);
        this.physics.add.overlap(clear, this.pointpipes.children.entries, destroyPipe, null, this);
        
        this.physics.add.overlap(player, this.pointpipes.children.entries, playPipe, null, this);
        this.physics.add.overlap(player, this.pipes, stopGame, null, this);
    
    
}

function stopGame(player, pipes){
    //this.pipes.children.entries.map(item => item.setVelocityX(0));
    //birddie = true;
    //pipes.setVelocityX(Phaser.Math.Between(-500, 500), Phaser.Math.Between(-500, 500));
}

function destroyPipe(clear, pipe){
    pipe.destroy();
}

function playPipe(player, pointpipe,score){
    mypoints++;
    self.score.text = 'Score: '+mypoints;
}

function addPipes(type, vel, x, y) {
    if(type=='hole'){
        pointpipe = self.physics.add.image(x, y, type ).setVelocity(vel, 0).setDepth(3);
        self.pointpipes.add(pointpipe);
    }
    if(type=='holeup'){
        pipe = self.physics.add.image(x, y, type ).setVelocity(vel, 0).setDepth(3);
        self.pipes.add(pipe);
    }
    if(type=='holedown'){
        pipe = self.physics.add.image(x, y, type ).setVelocity(vel, 0).setDepth(3);
        self.pipes.add(pipe);
    }
    if(type == 'block'){
        pipe = self.physics.add.image(x, y, type ).setVelocity(vel, 0).setDepth(3);
        self.pipes.add(pipe);
    }
    
} 

function addPipeRows() {
    if(!birddie){
    let hole = Math.floor(Math.random() * 4) + 2;
    let type;
    
    

        for (let i = 0; i < 9; i++) {
            if(i == hole-1){
                type = 'holeup';
            }
            if(i == hole){
                type = 'hole';
            }
            if(i == hole+1){
                type = 'hole';
            }
            if(i == hole+2){
                type = 'holedown';
            }
            if(i != hole && i != hole+1 && i != hole-1 && i!=hole+2){
                type = 'block';  
            }
            
            addPipes(type, -300, 900, i * 60 + 10);
        }
    }
    
}

function update(){

    if ( !birddie){

    
        if(keys.Space.isDown || moveMouse){
            player.setVelocityY(-200);
            player.play('fly', true);
            moveMouse = false;
            player.angle = -10;
        }
        if(!playerdirection){
            player.angle += 0.5;
        }

    }else{
        player.angle = 45;
        player.setVelocityY(400);
        //player.stop('fly', true); 
    }
    
        
    
    
}


