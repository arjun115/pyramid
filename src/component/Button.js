import {
    Signal
} from 'signals'


export default class Button extends Phaser.GameObjects.Sprite {

    onClick = new Signal()

    _texture = null
    _textureOnClick = null

    constructor(scene, x, y, texture, textureOnClick = null) {
        super(scene, x, y, texture)
        scene.children.add(this)
        this._texture = texture
        this._textureOnClick = textureOnClick
        this.setInteractive()
        this.on('pointerdown', () => this._clickDown())
        this.on('pointerup', () => this._clickUp())
    }

    _clickDown() {
        if (this._textureOnClick) {
            this.setTexture(this._textureOnClick)
        }
    }

    _clickUp() {
        this.onClick.dispatch()
        if (this._textureOnClick) {
            this.setTexture(this._texture)
        }
    }
}