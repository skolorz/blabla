var atms = require("./atm.json");
var fs = require("fs");
var csvWriter = require('csv-write-stream')
var result, id = 0;
var banks = ["Gotham",  "Gringotts"];

var options = {
    separator: '\t',
    newline: '\n',
    headers: undefined,
    sendHeaders: true
},
    writer = csvWriter(options);

result = atms.features.map(function(atm){
            if (atm.properties["addr:city"] ){
                id++;
                var name;
                name = (atm.properties.operator && atm.properties.operator.match(/ING/)) ? "ING" : banks[ id % 2];
console.log(name, atm.properties.operator)
                return {
                    matmid:
                        id,
                    mbankid:
                        name,
                    mline1:
                    atm.properties["addr:street"],
                    mline2:
                    atm.properties["addr:housenumber"],
                    mline3:
                    null,
                    mcity:
                    atm.properties["addr:city"],
                    mcounty:
                    null, 
                    mstate:
                    null,  
                    mcountrycode:
                    "PL",
                    mpostcode:
                    null,   
                    mlocationlatitude:
                    atm.geometry.coordinates[1],
                    mlocationlongitude:
                    atm.geometry.coordinates[0],
                    mlicenseid:
                    atm.id,  
                    mlicensename:
                    null,    
                    mname:
                        atm.properties["addr:street"],
                    id:
                    id
                };
            };
            return undefined;
        })
        .filter(function (atm){
            return !!atm;
        });


writer.pipe(fs.createWriteStream('out.csv'))
result.forEach(function (atm){
    writer.write(atm);
});
writer.end();

