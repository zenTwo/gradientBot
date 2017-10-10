// Helper functions

module.exports = {
	randomNum(length) {
		return Math.floor(Math.random() * length);
	},
	isHex(hex) {
		const a = parseInt(hex,16);
		return (a.toString(16) === hex.toLowerCase());
	},
};
