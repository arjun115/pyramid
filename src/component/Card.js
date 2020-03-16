import Signal from "signals";

export default class Card extends Phaser.GameObjects.Sprite {
  onClick = new Signal();
  onDrag = new Signal();

  _number = -1;
  _color = -1;
  _texture = "cards";
  _flipped = true;
  _dragging = false;
  _draggable = true;
  previous = null;
  nested = null;
  _order = null;
  _cardDraged = false

  constructor(scene, x, y, number, color) {
    super(scene, x, y);
    this.depth = 0;
    scene.children.add(this);
    // this.setScale(0.8);
    this.color = color;
    this.number = number;
    this.setInteractive({
      draggable: true
    });

    this.on("pointerup", () => this.onClick.dispatch(this), this);
  }

  set color(color) {
    if (color < 0 || color > 3) {
      throw new Error("errol");
    }
    this._color = color;
    this._changeTexture();
  }

  get color() {
    return this._color;
  }

  set number(number) {
    if (number > 0 && number < 14) {
      this._number = number;
    } else {
      throw new Error("error");
    }
    this._changeTexture();
  }

  get number() {
    return this._number;
  }

  get id() {
    return btoa(`${this._number}x${this._color}`);
  }

  _changeTexture() {
    if (this._flipped) {
      this.setTexture("flipped_card");
      return;
    }

    if (this._number >= 0 && this._color >= 0) {
      let frame = 13 * this._color + this._number - 1;
      this.setTexture(this._texture, frame);
    }
  }

  flip(flipped = false) {
    this._flipped = flipped;
    this._changeTexture();
  }

  get flipped() {
    return this._flipped;
  }

  dragStart() {
    if (!this._draggable) return;

    if (this._tween) {
      this._tween.stop();
      this.x = this._tween.goTo.x;
      this.y = this._tween.goTo.y;
      this._tween = null;
    }

    this._dragging = true;
    this._order = this.depth;
    this.setDepth(1500 + this._order);

    this.previous = {
      x: this.x,
      y: this.y
    };
  }

  setOrder(depth) {
    if (this._order === null) {
      this.setDepth(depth);
    } else {
      this._order = depth;
      this.setDepth(1500 + depth);
    }
  }

  drag(x, y) {
    if (this._dragging) {
      this.x = x;
      this.y = y;
    }
  }

  dragEnd() {
    if (!this._dragging) return;

    this._dragging = false;
    this.setDepth(this._order);
    this._order = null;
    this.onDrag.dispatch(this);
  }

  goTo(x, y, speed = 400) {
    this._order = this.depth;
    this.setDepth(1500 + this._order);
    this._draggable = false;
    this._tween = this.scene.add.tween({
      targets: this,
      x: x,
      y: y,
      duration: speed,
      ease: "Power3",
      onComplete: () => {
        this._draggable = true;
        this.setDepth(this._order);
        this._order = null;
      }
    });
    this._tween["goTo"] = {
      x,
      y
    };
  }
}