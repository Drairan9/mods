module.exports = {
	name: "Store Global Data",  
	section: "Deprecated",  

	subtitle: function(data) {
		const storage = ["", "Temp Variable", "Server Variable", "Global Variable"];
		return `${storage[parseInt(data.storage)]} (${data.varName})`;
	},  

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName, "Unknown Type"]);
	},  

	fields: ["dataName", "defaultVal", "storage", "varName"],  

	html: function(isEvent, data) {
		return `
<div style="padding-top: 8px;">
	<div style="float: left; width: 40%;">
		Data Name:<br>
		<input id="dataName" class="round" type="text">
	</div>
	<div style="float: left; width: 60%;">
		Default Value (if data doesn't exist):<br>
		<input id="defaultVal" class="round" type="text" value="0">
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage" class="round">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text"><br>
	</div>
</div>`;
	},  

	init: function() {},  

	action: function(cache) {
		const data = cache.actions[cache.index];

		const dataName = this.evalMessage(data.dataName, cache);
		const defVal = this.eval(this.evalMessage(data.defaultVal, cache), cache);

		const fs = require("fs");
		const path = require("path");

		const filePath = path.join(process.cwd(), "data", "globals.json");

		if(!fs.existsSync(filePath)) {
			console.log("ERROR: Globals JSON file does not exist!");
			this.callNextAction(cache);
			return;
		}

		const obj = JSON.parse(fs.readFileSync(filePath, "utf8"));

		let result;
		if(defVal) {
			if(obj[dataName]) {
				result = obj[dataName];
			} else {
				result = defVal;
			}
		} else {
			result = obj[dataName];
		}

		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		this.storeValue(result, storage, varName, cache);
		this.callNextAction(cache);
	},  

	mod: function() {}
}; 
