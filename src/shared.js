import EntryPoint from "./entryPoint"

window.runGame = (options) => {
    return new EntryPoint(options)
}