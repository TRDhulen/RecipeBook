// modules.export single function/class/etc in commonJS (also use require in importing file)
// export = {} multiple functions/classes/etc in ES6JS

/**
 * capitalize the first letter of a String
 * @param {String} str single word String
 * @returns String with first letter capitalized
 */
export function capFirst(str) {
    console.info("capFirst function called.");
    if(str.length == 0) {
        console.warn("String length expected: > 0, recieved: " + str.length, str);
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * capitalize each first letter in a sentence String
 * @param {String} sentence sentence String
 * @returns String with each first letter capitalized
 */
export function capFirstEach(sentence) {
    console.info("capFirstEach function called.");
    return splitStringIntoArray(sentence).map(word => capFirst(word)).join(' ');    
}

/**
 * splits multi-word String into an array
 * @param {String} sentence sentence String
 * @returns array containing String elements
 */
export function splitStringIntoArray(sentence) {
    console.info("splitStringIntoArray function called.")
    return sentence.split(' ');
}

// Possibly splice arrays splice(index, numOfElementsReplace, data)