phina.globalize();

var SCREEN_WIDTH    = 640;
var SCREEN_HEIGHT   = 960;
var PIECE_SIZE      = 80;
var PIECE_SIZE_HALF = PIECE_SIZE/2;


phina.define("MainScene", {
  superClass: 'DisplayScene',

  init: function() {
    this.superInit({
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    });

    this.fromJSON({
      children: {
        wordGroup: {
          className: 'DisplayElement',
        },
        scoreLabel: {
          className: 'Label',
          text: '999',
          x: this.gridX.span(15),
          y: this.gridX.span(1),
          align: 'right',
        }
      },
    });

    this.score = 0;
    this.scoreLabel.text = this.score + '';
  },

  onkeydown: function(e) {
    var ch = String.fromCharCode(e.keyCode)
    var wordGroup = this.wordGroup;
    var result = wordGroup.children.some(function(word) {
      if (word.enable && word.text === ch) {
        word.disappear();
        return true;
      }
      return false;
    });

    if (result) {
      this.score += 1;
      this.scoreLabel.text = this.score + '';
    }

    // space if push space
    if (e.keyCode === 32) {
      this.app.stop();
    }
  },

  update: function(app) {
    if (app.frame % 12 === 0) {
      this.createWord();
    }
  },

  createWord: function() {
    var ascii = [48,49,50,51,52,53,54,55,56,57,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89];

    var ch = String.fromCharCode(ascii.pickup());
    var word = Word(ch).addChildTo(this.wordGroup);
    word.x = Math.randint(PIECE_SIZE_HALF, this.gridX.width-PIECE_SIZE_HALF);
    word.y = -100;

    word.onattack = function() {
      this.exit({
        score: this.score,
      });
    }.bind(this);

    return word;
  }

});

phina.define('Word', {
  superClass: 'Button',

  init: function(word) {
    this.superInit({
      width: PIECE_SIZE,
      height: PIECE_SIZE,
      text: word,
    });
    this.enable = true;
  },

  update: function() {
    this.y += 8;

    if (this.y > 960) {
      this.flare('attack');
      this.remove();
    }
  },

  disappear: function() {
    this.enable = false;
    this.tweener
      .to({
        scaleX: 2,
        scaleY: 2,
        alpha: 0,
      }, 250)
      .call(function() {
        this.target.remove();
      })
      ;
  }
});


phina.main(function() {
  var app = GameApp({
    title: 'typing game',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    startLabel: location.search.substr(1).toObject().scene || 'main',
  });

  // app.enableStats();

  app.run();
  
  // ???????????? canvas ??????????????????
  ;(function() {
    var canvas = app.domElement;
    canvas.setAttribute('tabindex', '0');
    canvas.focus();
  })();
});
