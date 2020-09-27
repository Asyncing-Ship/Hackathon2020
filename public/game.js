var config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 600 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

var game = new Phaser.Game(config);

function preload() {
  this.load.setBaseURL("http://labs.phaser.io");
  this.load.image("sky", "assets/skies/bigsky.png");
  this.load.image("crate", "assets/sprites/crate.png");
  // http://labs.phaser.io/assets/sprites/platform.png
  this.load.image("platform", "assets/sprites/platform.png");
  // assets/sprites/strip1.png
  this.load.image("ledge", "assets/sprites/strip1.png");
  this.load.image("star", "assets/sprites/diamond.png");
  this.load.image("bomb", "assets/sprites/spikedball.png");
  this.load.image("ground", "assets/tilemaps/tiles/ground_1x1.png");
  this.load.spritesheet("dude", "assets/sprites/phaser-dude.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
}

function create() {
  //  A simple background for our game
  this.add.image(400, 300, "sky");

  //  The platforms group contains the platform and the 2 ledges we can jump on
  platforms = this.physics.add.staticGroup();

  //  Here we create the platform.
  //  Scale it to fit the width of the game (the original sprite is 400x32 in size)

  platforms.create(850, 400, "ground");
  platforms.create(-100, 250, "ground");
  platforms.create(1016, 220, "ground");
  platforms.create(400, 568, "ground");

  // The player and its settings
  player = this.physics.add.sprite(50, 450, "dude");

  //  Player physics properties. Give the little guy a slight bounce.
  player.setBounce(0);
  player.setCollideWorldBounds(true);

  console.log(player);

  //  Our player animations, turning, walking left and walking right.
  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20,
  });

  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  //  Input Events
  cursors = this.input.keyboard.createCursorKeys();

  //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
  stars = this.physics.add.group({
    key: "star",
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 },
  });

  stars.children.iterate(function (child) {
    //  Give each star a slightly different bounce
    child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.3));
  });

  bombs = this.physics.add.group();

  //  The score
  scoreText = this.add.text(16, 16, "score: 0", {
    fontSize: "32px",
    fill: "#000",
  });

  //  Collide the player and the stars with the platforms
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);
  this.physics.add.collider(bombs, platforms);

  //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
  this.physics.add.overlap(player, stars, collectStar, null, this);

  this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update() {
  // console.log(player.body.touching.down);
  // console.log(cursors);
  // console.log(this);
  let jumps = 2;

  if (gameOver) {
    return;
  }

  if (cursors.left.isDown) {
    player.setVelocityX(-160);

    if (cursors.left.isDown && cursors.shift.isDown) {
      let faster = -160;
      faster--;
      console.log(faster);
      player.setVelocityX(-160 + faster--);
    }

    // player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);

    if (cursors.right.isDown && cursors.shift.isDown) {
      let faster = 160;
      faster++;
      player.setVelocityX(160 + faster++);

      // player.anims.play("right", true);
    }
  } else {
    player.setVelocityX(0);

    // player.anims.play("turn");
  }

  // && player.body.touching.down
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-500);
  }

  if (cursors.down.isDown) {
    player.setVelocityY(600);
  }
}

function collectStar(player, star) {
  star.disableBody(true, true);

  //  Add and update the score
  score += 100;
  scoreText.setText("Score: " + score);

  if (stars.countActive(true) === 0) {
    //  A new batch of stars to collect
    stars.children.iterate(function (child) {
      child.enableBody(true, child.x, 0, true, true);
    });

    var x =
      player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);

    var bomb = bombs.create(x, 16, "bomb");
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
    bomb.setScale(0.25);
  }
}

function hitBomb(player, bomb) {
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play("turn");

  gameOver = true;
}
