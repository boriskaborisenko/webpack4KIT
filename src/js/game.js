
var config = {
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#ff303f',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};



var game = new Phaser.Game(config);


function preload ()
{
   console.log('preload') 
}

function create ()
{
    
}

function update ()
{
    
}

