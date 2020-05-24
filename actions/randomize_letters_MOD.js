module.exports = {
	name: "Randomize Letters",  
	section: "Other Stuff",  

	subtitle: function(data) {
		return `Randomize [${data.input}]`;
	},  

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		let dataType = "Randomized Letters";
		return ([data.varName, dataType]);
	},  
	fields: ["input", "wordLength", "storage", "varName"],  

	html: function(isEvent, data) {
		return `
<div id="modinfo">
	<div style="float: left; width: 60%; padding-top: 8px;">
	   Randomize Letters:<br>
	   <input id="input" class="round" type="text" placeholder="Use '*' for all options.">
	</div>
	<div style="float: right; width: 35%; padding-top: 8px;">
	   Random Word Length:<br>
	   <input id="wordLength" class="round" type="text">
	</div><br><br><br>
	<div style="float: left; width: 35%; padding-top: 8px;">
		Store Result In:<br>
		<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
			${data.variables[0]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; display: none; width: 60%; padding-top: 8px;">
		Variable Name:<br>
		<input id="varName" class="round" type="text">
	</div><br><br><br><br>
	<div id="commentSection" style="padding-top: 8px;">
		<p>
		<b>Randomize Letters Options:</b><br>
		a: Lowercase alpha characters (abcdefghijklmnopqrstuvwxyz')<br>
		A: Uppercase alpha characters (ABCDEFGHIJKLMNOPQRSTUVWXYZ')<br>
		0: Numeric characters (0123456789')<br>
		!: Special characters (~!@#$%^&()_+-={}[];\',.)<br>
		*: All characters (all of the above combined)<br>
		?: Custom characters (pass a string of custom characters to the options)
		</p>
	</div>
</div>`;
	},  

	init: function() {
		const { glob, document } = this;

		glob.variableChange(document.getElementById("storage"), "varNameContainer");
	},  

	action: function(cache) {

		const data = cache.actions[cache.index];
		const Input = this.evalMessage(data.input, cache);
		const wordLength = this.evalMessage(data.wordLength, cache);

		// Check if everything is ok
		if(!Input) return console.log("Please specify letters to randomize.");
		if(!wordLength) return console.log("Please specify amount of randomized letters.");

		// Main code
		const randomize = this.getWrexMods().require("randomatic");
		var random = randomize(Input, wordLength);

		// Storing
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		this.storeValue(random, storage, varName, cache);

		this.callNextAction(cache);
	},  

	mod: function() {}
}; 
