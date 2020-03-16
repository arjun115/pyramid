export default class BootScene extends Phaser.Scene {
  timer = null;
  fontFamilies = ["Amatic SC", "Oswald", "Titillium Web"];
  minimumTimeout = 500;

  constructor() {
    super({
      key: "boot"
    });
  }

  preload() {
    this.load.script(
      "webfont",
      "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js",
      "https://fonts.googleapis.com/css?family=Titillium+Web:400,900&display=swap"
    );
  }

  create() {
    this.cameras.main.setBackgroundColor('#ffffff')
    WebFont.load({
      google: {
        families: this.fontFamilies
      },
      active: () => this.startLoading()
    });

    this.game.gameType = 1;
  }

  startLoading() {
    this.load.once("start", this.loadGameAssets);
    this.load.once("complete", () => this.nextScene());
    this.timer = this.time.addEvent({
      delay: 500,
      loop: true
    });
    this.load.start();
  }

  loadGameAssets() {
    this.image("holder", "holder.png");
    this.image("flipped_card", "flipped_card.png");
    this.image("button_three_card", "button_three_card.png");
    this.image("button_how_to", "but_how_to.png");
    this.image("button_undo", "btn_undo.png");
    this.image("tranps_bg", "transparent_bg.png");
    this.image("pop_up", "popUp.png");
    this.image("button_exit_pop_up", "btn_exit.png");
    this.image("button_one_card_big", "button_one_card_big.png");
    this.image("button_three_card_big", "button_three_card_big.png");
    this.image('holder_1', 'spade_holder.png')
    this.image('holder_2', 'heart_holder.png')
    this.image('holder_3', 'club_holder.png')
    this.image('holder_4', 'diamond_holder.png')
    this.image('arrow', 'arrow.png')
    this.image('score', 'score.png')
    this.image('time', 'time.png')

    this.spritesheet("cards", "cards.png", {
      frameWidth: 155,
      frameHeight: 240,
      endFrame: 52
    });
  }

  nextScene() {
    let delay = 0;

    if (this.minimumTimeout - this.timer.getProgress() > 0) {
      delay = this.minimumTimeout - this.timer.getProgress();
    }

    setTimeout(() => {
      this.scene.start("game");
    }, delay);
  }
}