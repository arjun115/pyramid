import Button from "../component/Button";
import ToggleButton from "../component/ToggleButton";

export default class MenuScene extends Phaser.Scene {
  version = null;
  bg = null;
  logo = null;
  playOne = null;
  playThree = null;

  constructor() {
    super({
      key: "menu"
    });
  }

  create() {
    this.bg = this.add.sprite(0, 0, "bg");
    this.bg.setOrigin(0, 0);

    this.version = this.add.text(20, 700, "0.0.1", {
      fontFamily: "Titillium Web",
      fontSize: "18px",
      color: "#f1f1f1"
    });
    this.version.setOrigin(0, 0.5);

    this.logo = this.add.sprite(640, 300, "game_logo");
    this.logo.setOrigin(0.5);
    // this.logo.setScale(0.8);

    this.playOne = new Button(this, 540, 560, "button_play_one");
    this.playOne.setScale(0.5);
    this.playOne.setOrigin(0.5);
    this.playOne.onClick.add(() => this.onPlayClick(1), this);

    this.playThree = new Button(this, 740, 560, "button_play_three");
    this.playThree.setScale(0.5);
    this.playThree.setOrigin(0.5);
    this.playThree.onClick.add(() => this.onPlayClick(3), this);

    this.soundButton = new ToggleButton(
      this,
      50,
      50,
      "button_sound_on",
      "button_sound_off"
    );
    this.soundButton.setOrigin(0.5);
    this.soundButton.setScale(0.5);
  }

  onPlayClick(type) {
    this.scene.start("game", {
      type
    });
  }
}