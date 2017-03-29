var atms = require("./banks.json");
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
            if (atm.properties["addr:city"] && atm.properties.name){
                id++;
                var name = atm.properties.name.match(/ING/) ? "ING" : banks[ id % 2];

                console.log(atm.properties.name);
                return {
                    mbranchid:
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
                    mlobbyhours: null,
                    mdriveuphours: null,
                    mname:
                        name ===  "ING"? "ING Bank" : banks[ id % 2],
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

