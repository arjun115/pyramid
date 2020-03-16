let headerStyle = {
    fontFamily: 'Amatic SC',
    fontSize: 48,
    color: '#ffffff'
}

let regularStyle = {
    fontFamily: 'Oswald',
    fontSize: 24,
    color: '#ffffff'
}

export default class Text extends Phaser.GameObjects.Text {

    constructor(scene, x, y, content, header = false) {
        super(scene, x, y, content, header ? headerStyle : regularStyle)
        scene.children.add(this)
    }

}