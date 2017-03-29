var i = require("iban");
function getValidIban(iban) {
	var remainder = iban.replace(/ /g,""),
		numeral = require("numeral"),
		checksum,
		baseIban,
		block;
    if (!iban) return undefined;
	while (remainder.length < 26){
		remainder = remainder + "0000" +  remainder;
	}
	remainder = remainder.slice(0,26);
    baseIban = remainder.slice(2);
	reminder = "00"+baseIban;
	while (remainder.length > 2){
		block = remainder.slice(0, 9);
		remainder = parseInt(block, 10) % 97 + remainder.slice(block.length);
        console.log(block, remainder);
	}
	checksum = Math.abs((parseInt(remainder, 10) % 97) - 1) ;
	return "PL" + numeral(checksum).format("00") + baseIban;
 }

var res;
res = getValidIban("94 1160 2202 0000 0000 7820 7690");
console.log(res, res.length, i.isValid(res))
res = getValidIban("90 1160 2202 0000 0000 7820 7690");
console.log(res, res.length, i.isValid(res))
res = getValidIban("7820 7690");
console.log(res, res.length, i.isValid(res))
res = getValidIban("2202 0000 0000 7820 7690");
console.log(res, res.length, i.isValid(res))
res = getValidIban("7690");
console.log(res, res.length, i.isValid(res))
