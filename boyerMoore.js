// Asumsi text yang dimasukkan sudah AGTC saja dan pattern hanya AGTC saja
const bmMatch = (text, pattern) => {
    const last = buildLast(pattern)
    const n = text.length
    const m = pattern.length
    let i = m - 1
    let stepCount = 0

    if (i > n - 1) {
        console.log("Jumlah perbandingan karakter: " + stepCount)
        return -1; // no match if pattern is longer than text
    }

    const mapCharacterToIndex = new Map([['A', 0],  ['C', 1], ['G', 2], ['T', 3]])
    let j = m - 1;

    do {
        stepCount++;
        if (pattern.charAt(j) == text.charAt(i)) {
            if (j == 0) {
                console.log("Jumlah perbandingan karakter: " + stepCount)
                return i // match
            }
            else { // looking-glass technique
                i--
                j--
            }
        } else { // character jump technique
            let lo = last[mapCharacterToIndex.get(text.charAt(i))]

            i = i + m - Math.min(j, 1 + lo)
            j = m - 1
        }
    } while (i <= n-1);

    console.log("Jumlah perbandingan karakter: " + stepCount)
    return -1; // no match
} // end of bmMatch()

const buildLast = (pattern) =>
/* Return array storing index of last
occurrence of each ASCII char in pattern. */
{
    const last = [-1, -1, -1, -1] // initialize array

    const mapCharacterToIndex = new Map([['A', 0],  ['C', 1], ['G', 2], ['T', 3]])

    for (let i = 0; i < pattern.length; i++) {
        last[mapCharacterToIndex.get(pattern.charAt(i))] = i
    }

    return last;
} // end of buildLast()

// Tes
let text = "ACTGCACGTCCAGTGACGATGAAACGTAGACATTCGTAACTAGTAAGTTAACAGATGGACAGTGGAAACGTGCA"
let pattern = "ATTCGTAACTAGTAAGTTA"

let idxFound = bmMatch(text, pattern)

if (idxFound == -1) {
    console.log("Pattern tidak ditemukan.")
} else {
    console.log("Pattern ditemukan pada indeks " + idxFound);
    console.log("Pattern yang ditemukan: " + text.substring(idxFound, idxFound + pattern.length))
}