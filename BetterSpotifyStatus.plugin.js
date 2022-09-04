/**
 * @name BetterSpotifyStatus
 * @author ArjhanToteck
 * @description Shows what songs you're listening to directly in your status.
 * @version 0.0.1
 * @authorid 498568732440920066
 * @authorLink https://github.com/ArjhanToteck
 * @website https://github.com/ArjhanToteck/BetterSpotifyStatus
 * @source https://github.com/ArjhanToteck/BetterSpotifyStatus/blob/main/BetterSpotifyStatus.plugin.js
 * 
 */

let interval;

module.exports = class {
	// called when the plugin is activated (including after reloads)
	start() {
		interval = setInterval(function () {
			getSong((data) => {
				// checks if there is no song
				if (!data.name) {
					// clears status
					setStatus(null);
				} else {
					setStatus(`Listening to ${data.name} by ${data.artist}`);
				}
			})
		}, 1000);
	}

	// called when the plugin is deactivated
	stop() {
		clearInterval(interval);
	}
};

// this is probable the absolute most scuffed and stupid way to get a spotify status, but it's simple, and it works, so who cares?
function getSong(callback) {
	let status = {};

	// checks whether or not avatar tray is open
	let trayOpenOriginally = !!document.getElementsByClassName("scroller-1bVxF5 none-2-_0dP scrollerBase-_bVAAt")[0];

	// checks if profile tray is not open
	if (!trayOpenOriginally) {
		// opens avatar tray
		document.getElementsByClassName("avatarWrapper-1B9FTW withTagAsButton-OsgQ9L")[0].click();
	}

	// waits for tray to be open
	let interval = setInterval(checkForTray, 0);
	checkForTray()

	function checkForTray() {

		// returns if no tray yet
		if (!document.getElementsByClassName("scroller-1bVxF5 none-2-_0dP scrollerBase-_bVAAt")[0]) return;

		// checks if avatar tray needs to stay hidden
		if (!trayOpenOriginally) {
			// hides avatar tray before opening it
			let style = document.createElement("style");
			style.innerHTML = ".scroller-1bVxF5.none-2-_0dP.scrollerBase-_bVAAt {display: none}";
			document.body.appendChild(style);
		}

		clearInterval(interval);

		// checks if spotify is playing
		if (!!document.getElementsByClassName("scroller-1bVxF5 none-2-_0dP scrollerBase-_bVAAt")[0].innerText.toLowerCase().includes("listening to spotify")) {
			// gets spotify status from dom
			status = {
				name: document.getElementsByClassName("anchor-1MIwyf anchorUnderlineOnHover-2qPutX bodyLink-1E-g-R activityName-3YXl6e")[0].innerText,
				artist: document.getElementsByClassName("anchor-1MIwyf anchorUnderlineOnHover-2qPutX bodyLink-1E-g-R activityName-3YXl6e")[1].innerText,
				album: document.getElementsByClassName("anchor-1MIwyf anchorUnderlineOnHover-2qPutX bodyLink-1E-g-R activityName-3YXl6e")[2].innerText
			}
		}

		// checks if it needs to close the tray to go back to normal
		if (!trayOpenOriginally) {
			// closes avatar tray
			document.getElementsByClassName("avatarWrapper-1B9FTW withTagAsButton-OsgQ9L")[0].click();
		}

		// shows avatar tray at the end to make sure it doesn't hide the next time it is opened
		let style = document.createElement("style");
		style.innerHTML = ".scroller-1bVxF5.none-2-_0dP.scrollerBase-_bVAAt {display: block}";
		document.body.appendChild(style);

		// makes callback with status
		callback(status);
	}
}

function setStatus(status) {
	fetch("https://discord.com/api/v9/users/@me/settings", {
		"headers": {
			"authorization": BdApi.findModule(m => m.default && m.default.getToken).default.getToken(), // authtoken from better discord api
			"content-type": "application/json",
		},
		"body": JSON.stringify({ custom_status: { text: status } }),
		"method": "PATCH",
	});
}
