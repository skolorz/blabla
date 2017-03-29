/* global require */
var conf = require("./users"),
    faker = require("faker"),
    moment = require("moment"),
    dateTo = new Date(),
    dateFrom,
    data,
    periods, 
    trn = 1,
    accNumber = 1;

dateFrom = new Date(dateTo.getFullYear()-2, dateTo.getMonth(), 1);
periods = generatePeriods(dateFrom, dateTo);

function generatePeriods(d1, d2){
    var d = d1, res = [];
    res.push(d);
    while(d < d2){
        d = new Date(d.getFullYear(), d.getMonth() + 1, 1);
        res.push(d);
    }
    return res;
}
function getCounterParty(){
    return {
        name: faker.Company.companyName(),
        bank: "National Bank",
        account: "123"
    };
}


function carousel(array){
    return function next (){
        var elem = array.shift(array);
        array.push(elem);
        return elem;
    };
}

function generateDataForUser(conf){
    var nextBank = carousel(conf.banks),
        nextPattern = carousel(conf.patterns),
        nextBoss,
        nextDomain = carousel(conf.mailDomains);

    conf.boss = conf.boss.map(function(boss){
        boss.bank = nextBank();
        return boss;
    });
    nextBoss = carousel(conf.boss);
    function createUser(userName){
        return {
            name: userName,
            email: userName.replace(/(\w+) (\w+)/i, "$1.$2@" + nextDomain()).toLowerCase(), 
        };
    }    
    function nextAccNumber(){
        return accNumber ++;
    }
    function getIban(num){
        var iban = "PL" + num;
        while (iban.length<28) iban = iban + "0000" + num;
        return iban.slice(0,28);
    }     
    function getTransId(){
        return trn++;
    }
    function getTransuuid(){
        return trn++;
    }
    function generateInPeriods(account, freq, amount, title, counterParty){
        return periods.map(function(period) {

            if (period.getMonth() % freq) return undefined;

            return {
                amount: amount,
                currency: "EUR",
                counterpartyaccountholder: counterParty.name,
                counterpartyaccountnumber: counterParty.account,
                description: title,
                transactionid: getTransId(),
                transactionuuid: getTransuuid(),
                bank: counterParty.bank,
                account: account.accountnumber,
                updatedat: moment(period).format("YYYY-MM-DD 00:00:00"),
                createdat:  moment(period).format("YYYY-MM-DD 00:00:00"),
                tstartdate: moment(period).format("YYYY-MM-DD 00:00:00"),
                tfinishdate:  moment(period).format("YYYY-MM-DD 00:00:00"),
                transactiontype: "Transfer",
                newaccountbalance: undefined,
            };
        })
        .filter(function(a){
            return !!a;
        });
    }
    function createAccounts(user, accountsPattern) {
        function generateCardTransaction(patterns, account){
            var d = moment(periods[0]);
            patterns.forEach(function (p){
                

            });
        }
        function generateTransactions(pattern, account){
            var res = [], boss;
            boss = { name: faker.Company.companyName(), account: getIban(123) }; 
            if (pattern.monthlyIncomes){
                res = res.concat(generateInPeriods(account, 1, pattern.monthlyIncomes, "salary", boss));
            }
            if (pattern.taxReturn){
                res = res.concat(generateInPeriods(account, 13, 
                                    pattern.taxReturn, 
                                    "tax refund",
                                    getCounterParty("Ministry of Finances"))); 
            };
            if (pattern.quarterBonus){
                res = res.concat(generateInPeriods(account, 3, pattern.quarterBonus, "quarter bonus", boss));
            }
            return res;
        }
        function createAccount(pattern) {
            var myNumber = nextAccNumber(),
                account = {
                    "kind": "CURRENT",
                    "bank": nextBank(),
                    "accountnumber":   myNumber,
                    "accountiban":   getIban(myNumber),
                    "accountcurrency":   "EUR",
                    "accountlabel":   user.name +" account",
                    "theaccountid"    :   myNumber,
                    "id"  :   myNumber
                };
            account.transactions = generateTransactions(pattern, account);
//account.transactions.concat(generateCardTransactions(conf.cardPayments[0]));
            return account;
        }          
        var accounts;
        accounts = accountsPattern.accounts.map(createAccount);        

        return accounts;
    }   

    return function(userName){
        var user;
        user = createUser(userName);
        user.accounts = createAccounts(user, nextPattern());
        return user;
    };
}

data = conf.names.map(generateDataForUser(conf));
console.log(JSON.stringify(data, null, 2));
