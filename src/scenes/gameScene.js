import SolitaireController from "../controller/solitaireController";
import PlayGround from "../group/playGround";
import Button from "../component/Button";

export default class GameScene extends Phaser.Scene {
  bg = null;
  controller = null;
  playGround = null;
  btn_new = null;
  btn_options = null;
  btn_how_to = null;
  btn_undo = null;

  new_text = null;
  options_text = null;
  how_to_text = null;
  undo_text = null;

  optionsPopUpGroup = null;
  howToPopUpGroup = null;
  finishPopUpGroup = null
  timer = null;
  counter = 0;
  points = 0;
  popUpIsOpen = false;

  score_img = null
  time_img = null

  // popUp = null;
  // tranpsBg = null;

  // btn_exit = null;
  // btn_big_one = null;
  // btn_big_three = null;

  // one_card_text = null;
  // three_cards_text = null;

  constructor() {
    super({
      key: "game"
    });
  }

  create() {
    let {
      type
    } = this.scene.settings.data;

    this.cameras.main.setBackgroundColor('#ffffff')

    this.btn_new = new Button(this, 139, 78, "button_three_card");
    this.btn_new.setOrigin(0.5);
    this.btn_new.onClick.add(this.btnNewClicked, this);

    // this.btn_options = new Button(this, 270, 78, "button_options");
    // this.btn_options.setOrigin(0.5);
    // this.btn_options.onClick.add(this.btnOptionsClicked, this);

    // this.btn_how_to = new Button(this, 394, 78, "button_how_to");
    this.btn_how_to = new Button(this, 1667, 78, "button_how_to");
    this.btn_how_to.setOrigin(0.5);
    this.btn_how_to.onClick.add(() => {
      this.game.customOptions.onHowTo()
    }, this)

    this.btn_undo = new Button(this, 1787, 78, "button_undo");
    this.btn_undo.onClick.add(() => this.controller.undo());
    this.btn_undo.setOrigin(0.5);

    this.score_img = this.add.image(708 + 200, 69, 'score')
    this.score_img.setOrigin(.5)

    this.time_img = this.add.image(885 + 200, 69, 'time')
    this.time_img.setOrigin(.5)


    this.points_text = this.add.text(760 + 200, 69, "0", {
      fontFamily: "Titillium Web",
      fontStyle: 'bold',
      fontSize: "28px",
      color: "#000000",
      align: 'left'
    });
    this.points_text.setOrigin(0, 0.5);

    this.time_text = this.add.text(930 + 200, 69, "00:00", {
      fontFamily: "Titillium Web",
      fontStyle: 'bold',
      fontSize: "28px",
      color: "#000000",
      align: 'left'
    });
    this.time_text.setOrigin(0, 0.5);

    this.timer = this.time.addEvent({
      delay: 1000,
      callback: () => this.count(),
      loop: true
    });

    this.onPlayClick(type);

    this.controller.onChangePoints.add(this.changePointsText, this)
    this.controller.finishGame.add(() => {
      this.popUpIsOpen = true;
      // this.bg.setInteractive()
      // this.bg.on("pointerdown", () => {
      //   this.popUpIsOpen = false;
      //   this.points = 0
      //   this.counter = 0
      //   this.scene.restart({
      //     type: this.scene.settings.data.type
      //   });
      // }, this)
      for (let cardId in this.playGround.deckMap) {
        // let card = this.playGround.deckMap[cardId]
        // card
        this.playGround.deckMap[cardId].on("pointerdown", () => {
          this.popUpIsOpen = false;
          this.points = 0
          this.counter = 0
          this.scene.restart({
            type: this.scene.settings.data.type
          });
        });
        this.physics.world.enable(this.playGround.deckMap[cardId])
        this.playGround.deckMap[cardId].body.setVelocity(0 + Math.random() * 100, 200 + Math.random() * 400).setBounce(1, 1).setCollideWorldBounds(true);
      }

      // this.finishGamePopUp()
    }, this)

  }

  count() {
    if (!this.popUpIsOpen) this.counter++;

    this.time_text.setText(`${this.timeParser(this.counter)}`);
  }

  timeParser(seconds = 1) {
    let min = window.Math.floor(seconds / 60);
    min = min < 10 ? "0" + min : min;
    let sec = seconds % 60;
    sec = sec < 10 ? "0" + sec : sec;
    return `${min}:${sec}`;
  }

  onPlayClick(type) {
    this.controller = new SolitaireController(type || 1);
    this.playGround = new PlayGround(this, this.controller);
  }

  btnNewClicked() {
    this.points = 0
    this.counter = 0
    this.scene.restart({
      type: this.scene.settings.data.type
    });
  }

  btnOptionsClicked() {
    this.popUpIsOpen = true
    this.optionsPopUpGroup = this.add.group();
    let tranpsBg = new Button(this, 960 - 310, 540, "tranps_bg");
    // this.tranpsBg.setOrigin(0.5);
    tranpsBg.setInteractive();
    this.optionsPopUpGroup.add(tranpsBg);

    let popUp = this.optionsPopUpGroup.create(960 - 310, 540, "pop_up");
    popUp.setOrigin(0.5);
    popUp.setInteractive();

    // this.btn_exit = new Button(this, 900, 215, "button_exit_pop_up");
    // this.btn_exit.setOrigin(0.5);
    // this.optionsPopUpGroup.add(this.btn_exit);

    let btn_big_one = new Button(this, 830 - 310, 480, "button_one_card_big");
    btn_big_one.setOrigin(0.5);
    this.optionsPopUpGroup.add(btn_big_one);
    let one_card_text = this.add.text(
      830 - 310,
      570,
      "Turn 1", {
        fontFamily: "Titillium Web",
        fontSize: "28px",
        color: "#ffffff"
      },
      this.optionsPopUpGroup
    );
    one_card_text.setStroke("#ffffff", 1);
    one_card_text.setOrigin(0.5);
    this.optionsPopUpGroup.add(one_card_text);

    let btn_big_three = new Button(this, 1060 - 310, 465, "button_three_card_big");
    btn_big_three.setOrigin(0.5);
    this.optionsPopUpGroup.add(btn_big_three);

    let three_cards_text = this.add.text(1060 - 310, 570, "Turn 3", {
      fontFamily: "Titillium Web",
      fontSize: "28px",
      color: "#ffffff"
    });
    three_cards_text.setStroke("#ffffff", 1);
    three_cards_text.setOrigin(0.5);
    this.optionsPopUpGroup.add(three_cards_text);

    this.optionsPopUpGroup.setDepth(5000);
    tranpsBg.onClick.add(() => {
      this.popUpIsOpen = false
      this.optionsPopUpGroup.clear(this);
    }, this);

    btn_big_one.onClick.add(() => {
      this.optionsPopUpGroup.clear(this);
      this.points = 0
      this.counter = 0
      this.popUpIsOpen = false;
      this.scene.restart({
        type: 1
      });
    }, this);

    btn_big_three.onClick.add(() => {
      this.optionsPopUpGroup.clear(this);
      this.points = 0
      this.counter = 0
      this.popUpIsOpen = false
      this.scene.restart({
        type: 3
      });
    }, this);
  }

  btnHowToClicked() {
    this.popUpIsOpen = true
    this.howToPopUpGroup = this.add.group();
    let tranpsBg = new Button(this, 960 - 310, 540, "tranps_bg");
    tranpsBg.setInteractive();

    let popUp = this.howToPopUpGroup.create(960 - 310, 540, "pop_up");
    popUp.setOrigin(0.5);
    popUp.setInteractive();

    let howToText = this.add.text(
      960,
      540,
      "The card piles in board can be build down by decrescent card number with alternate color.\n" +
      "GOAL : The goal is to build up four foundation by suit, from Ace to King.", {
        fontFamily: "Titillium Web",
        fontSize: "20px",
        color: "#ffffff",
        align: "center",
        wordWrap: {
          width: popUp.width - 20,
          useAdvancedWrap: false
        }
      }
    );
    howToText.setStroke("#ffffff", 1);
    howToText.setOrigin(0.5);

    let buttonNext = new Button(this, 1180 - 310, 590, "arrow");
    buttonNext.setOrigin(0.5);
    buttonNext.setInteractive();

    let buttonPrev = new Button(this, 730 - 310, 590, "arrow");
    buttonPrev.flipX = true;
    buttonPrev.setOrigin(0.5);
    buttonPrev.setInteractive();
    buttonPrev.alpha = 0;

    this.howToPopUpGroup.add(howToText);
    this.howToPopUpGroup.add(buttonNext);
    this.howToPopUpGroup.add(buttonPrev);
    this.howToPopUpGroup.add(tranpsBg);

    this.howToPopUpGroup.setDepth(5000);

    buttonNext.onClick.add(() => {
      buttonNext.alpha = 0;
      buttonPrev.alpha = 1;
      howToText.setText(
        "POINTS :\nWaste to Tableau = 5\nWaste to Foundation = 10\nTableau to Foundation = 10\nTurn over Tableau card = 5\nFoundation to Tableau = -15"
      );
    }, this);

    buttonPrev.onClick.add(() => {
      buttonPrev.alpha = 0;
      buttonNext.alpha = 1;
      howToText.setText(
        "The card piles in board can be build down by decrescent card number with alternate color.\n" +
        "GOAL : The goal is to build up four foundation by suit, from Ace to King."
      );
    }, this);

    tranpsBg.onClick.add(() => {
      this.popUpIsOpen = false
      this.howToPopUpGroup.clear(this);
    }, this);
  }

  changePointsText(change) {
    this.points = this.points + change < 0 ? 0 : this.points + change
    this.points_text.setText(`${this.points}`)
  }

  finishGamePopUp() {
    this.popUpIsOpen = true
    this.finishPopUpGroup = this.add.group();
    let tranpsBg = new Button(this, 960 - 310, 540, "tranps_bg");
    tranpsBg.setInteractive();
    tranpsBg.setDepth(10000)

    let popUp = this.finishPopUpGroup.create(960 - 310, 540, "pop_up");
    popUp.setOrigin(0.5);
    popUp.setInteractive();

    let winText = this.add.text(
      960 - 310,
      540,
      `CONGRATULATIONS\n You complete the game !!\nSCORE: ${this.points}`, {
        fontFamily: "Titillium Web",
        fontSize: "20px",
        color: "#ffffff",
        align: "center",
        wordWrap: {
          width: popUp.width - 20,
          useAdvancedWrap: false
        }
      }
    );
    winText.setStroke("#ffffff", 1);
    winText.setOrigin(0.5);

    this.finishPopUpGroup.add(winText)

    tranpsBg.onClick.add(() => {
      this.popUpIsOpen = false
      this.finishPopUpGroup.clear(this);
      this.points = 0
      this.counter = 0
      this.scene.restart({
        type: this.scene.settings.data.type
      });
    }, this);
    this.finishPopUpGroup.children.entries.forEach(entry => {
      entry.setDepth(10001)
    })
  }

  update() {
    this.playGround._sort()
  }
}