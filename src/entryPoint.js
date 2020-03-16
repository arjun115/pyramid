import config from './config'

export default class EntryPoint extends Phaser.Game {

    customOptions = null

    constructor(options) {
        super(config(options))
        this.customOptions = options
        this._validateOptions()
        this.scene.start('boot')
    }

    _validateOptions() {
        // options['onHowTo'] is function
        if (!this.customOptions) {
            throw new Error('Game is not configured properly')
        }
    }
}