export default class ProvinceNameGenerator {
    constructor() {
        this.consonants = "bcdfghjklmnpqrstvwxyz";
        this.vowels = "aeiou";
        this.patterns = ["CVC", "CVVC", "VCV", "CVCV", "CVCCV"];
        this.generatedNames = new Set();
    }

    #randomLetter(str) {
        return str[Math.floor(Math.random() * str.length)];
    }

    generateName() {
        let name;
        do {
            const pattern = this.patterns[Math.floor(Math.random() * this.patterns.length)];
            name = "";
            for (const char of pattern) {
                name += char === "C"
                    ? this.#randomLetter(this.consonants)
                    : this.#randomLetter(this.vowels);
            }
            name = name.charAt(0).toUpperCase() + name.slice(1);
        } while (this.generatedNames.has(name));

        this.generatedNames.add(name);
        return name;
    }
}