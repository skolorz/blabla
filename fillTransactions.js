const   moment = require("moment"),
        random = require("random-js")();
const   monthlyTransPatterns = require("./monthly-spendings.json"),
        startDate = moment("2015-05-01"),
        endDate = moment("2017-05-12");
const   
        examples = { 
            foreignLang:["English lessons", "", "język polski", "German lessons", "French lessons"],
            invPrefix: ["", "", "Customer no ", "Invoice ", "Bill number ", "Invoice "],
            firstName: ["Anna", "Jan", "Julia", "Stefan"],
            city: ["Bytom", "Katowice", "Sosnowiec", "Warszawa"],
            person: ["Jan Ptak", "Anna Korek", "Zbig Kowalski", "Mateusz Kosta"],
            street: ["ul. Prosta", "al. Jana Pawła II", "ul. Sokolska", "ul. Warszawska"],
            WaterCompany: ["Gotham City Water Supply", "PWIK Katowice", "Welsh Water Co", "Water & Sewer Inc"],
            ElectricCompany: ["Tauron Energy", "Edison Electric Company", "Energa S.A.", "Tauron Energy"],
            insuranceCompany: ["Prudential Insurance", "WARTA S.A.", "PZU S.A.", "Allianz S.A."],
            satTv: ["ITI Neovision SAT", "Cyfrowy Polsat S.A.", "Vectra Cable TV S.A.", "SAT1 Inc"],
            langSchool: ["Right Now Language School", "iProfi-Lingua sp. z o.o.",
                        "#person, #randomAddr", "Sprachschule Berlin GmbH"],
            gsmCompany: ["Orange S.A.", "Polkomtel GSM S.A.", "T-Mobile"],
            landlord: ["#person, #randomAddr", "#city Apartment Administration", 
                        "Spółdzielnia Mieszkaniowa Hutnik, #city"],
            fitness: ["Fitness Center #city", "Swimming Pool #city", "Anna Chobakowska Fitness Center",
                        "Yoga School, Katowice"],
            internetProvider: ["Orange Internet", "Vectra Internet", "Leon Internet Access", "Orange"]
        };

var period = startDate.clone(),
    m,
    generators = {},
    user = {city: "Katowice", name: "Adam Kroll" },
    patterns;

generators.baby = function (){
    return random.pick(examples.firstName) + " " + user.name.match(/\w+ (\w+)/)[1];
}
generators.address = function(){
    return random.pick(examples.street) 
            + " "
            + random.integer(1,90)
            + ", "
            + random.pick(examples.city)
}
generators.inv = function(){
    return random.pick(examples.invPrefix) 
            + "#long"
            + random.pick(["/",":","","-"])
            + random.pick(["#long",random.integer(10,1000),period.format("YYYY")]);
}

function replaceKeys(t){
    var m, text = t;
    if (text.match(/#name/)){
        text = text.replace("#name", user.name);
    }
    if (text.match(/#nr/)){
        text = text.replace("#nr", random.integer(1,50));
    }
    if (text.match(/#long/)){
        text = text.replace("#long", random.integer(1000,500000));
    }
    if (text.match(/#city/)){
        text = text.replace("#city",user.city );
    }
    m = text.match(/#(\w+)/);
    while (m && m[1] && examples[m[1]]) {
        text = text.replace("#"+m[1], random.pick(examples[m[1]]));
        m = text.match(/#(\w+)/);
    }
    while (m && m[1] && generators[m[1]]) {
        text = text.replace("#"+m[1],generators[m[1]]);
        m = text.match(/#(\w+)/);
    }
    return text;
}

patterns = monthlyTransPatterns.filter(p => true || p.freq > random.integer(0,100));
patterns = patterns.map(p => {
    p.description = replaceKeys(p.description);
    p.counterpartyaccountholder = replaceKeys(p.counterpartyaccountholder);
    p.counterpartyaccountholder = replaceKeys(p.counterpartyaccountholder);
    delete p.field5;
    return p;
});

while (period.isBefore(endDate)){

    period = period.add(1, 'month');
}

console.log(patterns);

