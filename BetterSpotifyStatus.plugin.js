/**
 * @name BetterSpotifyStatus
 * @author ArjhanToteck
 * @description Shows what songs you're listening to directly in your status.
 * @version 0.0.1
 */

module.exports = class ExamplePlugin {
    start() {
        // Called when the plugin is activated (including after reloads)
        BdApi.alert("Hello World!", "This is my first plugin!");
    }

    stop() {
        // Called when the plugin is deactivated
    }
}