const   moment = require("moment"),
        random = require("random-js")();
const   monthlyTransPatterns = require("./monthly-spendings.json"),
        startDate = moment("2015-05-01"),
        endDate = moment("2017-05-12");
const   invPrefix = ["", "", "Customer no ", "Invoice ", "Bill number ", "Invoice "],
        counterParties = { 
            city: ["Bytom", "Katowice", "Sosnowiec", "Warszawa"],
            person: ["Jan Ptak", "Anna Korek", "Zbig Kowalski", "Mateusz Kosta"],
            street: ["ul. Prosta", "al. Jana Pawła II", "ul. Sokolska", "ul. Warszawska"],
            WaterCompany: ["Gotham City Water Supply", "PWIK Katowice", "Welsh Water Co", "Water & Sewer Inc"],
            ElectricCompany: ["Tauron Energy", "Edison Electric Company", "Energa S.A.", "Tauron Energy"],
            insuranceCompany: ["Prudential Insurance", "WARTA S.A.", "PZU S.A.", "Allianz S.A."],
            satTv: ["ITI Neovision SAT", "Cyfrowy Polsat S.A.", "Vectra Cable TV S.A.", "SAT1 Inc"],
            langSchool: ["Right Now Language School", "iProfi-Lingua sp. z o.o.", "#person, #randomAddr", "Sprachschule Berlin GmbH"],
            gsmCompany: ["Orange S.A.", "Polkomtel GSM S.A.", "T-Mobile"],
            landlord: ["#person, #randomAddr", "#city Apartment Administration", 
                        "Spółdzielnia Mieszkaniowa Hutnik, #city"],
            fitness: ["Fitness Center #city", "Swimming Pool #city", "Anna Chobakowska Fitness Center",
                        "Yoga School, Katowice"],
            internetProvider: ["Orange Internet", "Vectra Internet", "Leon Internet Access", "Orange"]
        };

var period = startDate.clone(),
    m,
    user = {city: "Katowice", name: "Adam Kroll" },
    patterns;

function address(){
    return random.pick(counterParties.street) 
            + " "
            + random.integer(1,90)
            + ", "
            + random.pick(counterParties.city)
}
function invoice(){
    return random.pick(invPrefix) 
            + "#long"
            + random.pick(["/",":","","-"])
            + random.pick(["#long",random.integer(10,1000),period.format("YYYY")]);
}
function replaceKeys(t){
    var text = t;
    if (!text) return t;
    if (text.match(/#randomAddr/)){
        text = text.replace("#randomAddr", address());
    }
    if (text.match(/#inv/)){
        text = text.replace("#inv", invoice());
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
    return text;
}

patterns = monthlyTransPatterns.filter(p => true || p.freq > random.integer(0,100));
patterns = patterns.map(p => {
    p.description = replaceKeys(p.description);
    m = p.counterpartyaccountholder.match(/#(\w+)/);
    while (m && m[1] && counterParties[m[1]]) {
        p.counterpartyaccountholder = random.pick(counterParties[m[1]])
        m = p.counterpartyaccountholder.match(/#(\w+)/);
    }
    p.counterpartyaccountholder = replaceKeys(p.counterpartyaccountholder);
    return p;
});

while (period.isBefore(endDate)){

    period = period.add(1, 'month');
}

console.log(patterns);



