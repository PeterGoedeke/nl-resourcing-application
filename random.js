var random = (function() {
    const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
    var lastGeneratedLetter = "a";
    const NAMES = ["Thanh", "Clifton", "Vincent", "Len", "Orlando", "Marcel", "Christoper", "Granville", "Brenton", "Buford", "Jerry", "Michal", "Corey", "Simon", "Marvin", "Gerry", "Rufus", "Darrell", "Benton", "Jonathon", "Gerardo", "Deangelo", "Gabriel", "Bill", "Carol", "Demetrius", "Sammie", "Wendell", "Tim", "Jermaine", "Trey", "Scott", "Jamar", "Jacob", "Gus", "Alvaro", "Luther", "Weston", "Rodolfo", "Mac", "Branden", "Julio", "Royce", "Malcolm", "Ramiro", "Kelvin", "Elliot", "Ethan", "Waldo", "Joesph"];
    var lastGeneratedName = "Thanh";
    var lastGeneratedNumber = 2;
    var coinflip = () => Math.random() > 0.5;
    return {
        letter: function() {
            do {
                var letter = ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
            } while(letter == lastGeneratedLetter);
            lastGeneratedLetter = letter;
            return letter;
        },
        name: function() {
            do {
                name = NAMES[Math.floor(Math.random() * NAMES.length)];
            } while(name == lastGeneratedName);
            lastGeneratedName = name;
            return name;
        },
        number: function(lower, upper, negativesEnabled, selectedType, chanceOfOne) {
            if (Math.random() < chanceOfOne) return 1;
            var number = 0;
            do {
                if(selectedType == "scaling" || selectedType == "scalingEven") {
                    number = Math.floor(Math.abs(Math.random() - Math.random()) * (1 + upper - lower) + lower);
                } else {
                    number = Math.floor(Math.random() * (upper - lower + 1) + lower);
                }
                if(negativesEnabled && coinflip()) number *= -1;
                if(number % 2 != 0 && (selectedType == "even" || selectedType == "scalingEven")) number ++;
            } while(Math.abs(number) == Math.abs(lastGeneratedNumber));
            lastGeneratedNumber = number;
            return number;
        },
        coinflip: coinflip
    }
})();