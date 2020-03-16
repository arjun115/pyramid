import BootScene from "./scenes/bootScene"
import MenuScene from "./scenes/menuScene"
import GameScene from "./scenes/gameScene"

export default ({
    baseURL
}) => {
    return {
        type: Phaser.AUTO,
        width: 1920,
        height: 1080,
        parent: 'game',
        scene: [new BootScene, new MenuScene, new GameScene],
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {
                    y: 200
                },
                debug: false
            }
        },
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
        },
        loader: {
            baseURL: baseURL ? baseURL : 'assets'
        }
    }
}