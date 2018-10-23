var config = {
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#75C7EB',
    width: 800,
    height: 600,
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

var self;
var player;
var keys;
var pipe;
var pipes;
var pointpipe;
var pointpipes;
var clear;
var mypoints = 0;
var pppbg;
var newbg;
var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('block', 'assets/block.png');
    this.load.image('hole', 'assets/hole.png');
    this.load.image('bg', 'assets/bg.png');
    this.load.spritesheet('bird', 'assets/bird.png', { frameWidth: 36, frameHeight: 26 });
    
}

function create ()
{
    self = this;
    this.score = this.add.text(16, 16, 'Score: 0', { fontFamily: 'Mali', fontSize: '32px', fill: '#fff' });
    this.score.setDepth(100);
    //this.add.image(0, 0, 'bg').setOrigin(0);
    
    player = this.physics.add.sprite(350, 450, 'bird');
    
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

    this.pipes = this.add.group();
    this.pointpipes = this.add.group();
    

        this.timedEvent = this.time.addEvent({
            delay: 1700,
            callback: addPipeRows,
            callbackScope: this,
            loop: true
        });

        
        this.pppbg = this.add.group();
        for (let i = 0; i < 100; i++) {
            console.log(i)
            newbg = this.physics.add.image(648*i, 0, 'bg').setVelocity(-30, 0).setOrigin(0).setDepth(1);
            this.pppbg.add(newbg);
        }

     
        this.physics.add.overlap(clear, this.pipes.children.entries, destroyPipe, null, this);
        this.physics.add.overlap(clear, this.pointpipes.children.entries, destroyPipe, null, this);
        
        this.physics.add.overlap(player, this.pointpipes.children.entries, playPipe, null, this);
   
    
    
}

function destroyPipe(clear, pipe){
    pipe.destroy();
}

function playPipe(player, pointpipe,score){
    mypoints++;
    self.score.text = 'Score: '+mypoints;
}

function addPipes(type, x, y) {
    if(type=='hole'){
        pointpipe = self.physics.add.image(x, y, type ).setVelocity(-300, 0).setDepth(3);
        self.pointpipes.add(pointpipe);
    }else{
        pipe = self.physics.add.image(x, y, type ).setVelocity(-300, 0).setDepth(3);
        self.pipes.add(pipe);
    }
    
} 

function addPipeRows() {
    let hole = Math.floor(Math.random() * 5) + 1;
    let type;
    

    for (let i = 0; i < 11; i++) {
        
        if (i != hole && i != hole+1) {
            type = 'block';
        }else{
            type = 'hole';
        }
        addPipes(type, 800, i * 60 + 10);
    }
    
}

function update(){
    if(keys.Space.isDown){
        player.setVelocityY(-250);
        player.play('fly', true);
    }
}


