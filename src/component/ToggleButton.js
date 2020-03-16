import {
    Signal
} from 'signals'


export default class ToggleButton extends Phaser.GameObjects.Sprite {

    onClick = new Signal()
    toggled = false


    _texture = null
    _textureToggled = null

    constructor(scene, x, y, texture, textureToggled) {
        super(scene, x, y, texture)
        scene.children.add(this)
        this._texture = texture
        this._textureToggled = textureToggled
        this.setInteractive()
        this.on('pointerup', () => this._clickUp())
    }

    _clickUp() {
        this.onClick.dispatch(this.toggled)
        if (this.toggled) {
            this.setTexture(this._texture)
        } else {
            this.setTexture(this._textureToggled)
        }
        this.toggled = !this.toggled
    }
}