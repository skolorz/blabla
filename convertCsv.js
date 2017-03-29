const csvFilePath='monthly-spendings.csv';
const csv=require('csvtojson');
const jsonfile = require('jsonfile');
const file = 'monthly-spendings.json';
 var result = []; 

csv({
	delimiter:";",
	trim:true,
	checkType: true,
})
	.fromFile("./monthly-spendings.csv")
	.on('json',(jsonObj)=>{
		result.push(jsonObj);
	})
	.on('done',(error)=>{
		jsonfile.writeFile(file, result, {spaces: 2}, function (err) {
		  console.error(err || "OK")
		})
	})
