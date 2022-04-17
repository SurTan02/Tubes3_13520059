// TODO
// 1. REGEX
// 2. Step Count

// Border Function
function computeFail(pattern){
    let prefix, suffix, temp;

	let j = pattern.length-1; 
	let fail = []

    fail[0] = 0;
    fail[1] = 0;
	for (let k = 2; k< j; k++){     
        temp = 0;                   //Panjang sekuens dari prefix/sufix yang sama
        for (i = 0; i < k; i++){
            prefix = pattern.substring(0, i+1);
            suffix = pattern.substring(k-i, k+1);
            if (prefix === suffix){          //prefix terbesar dari p[0..k] yang juga suffix dri p[1..k]
                temp = prefix.length; 
            }
        }
        fail[k] = temp
	}
	return fail;
}

// KMP
function kmpMatch(text, pattern){
    let n = text.length;
    let m = pattern.length;

    let fail = computeFail(pattern);

    let i = 0;
    let j = 0;

    while (i<n){
        if (pattern[j] == text[i]) {
            if (j == m-1) {
                return i - m + 1;                       //Index text yang sesuai pattern
            }
            i++;
            j++;
        } else if (j>0){
            j = fail[j-1]
        } else{
            i++;
        }
    }
    return -1
}



// Tes
// console.log(kmpMatch("12345ATTCGTAACTAGTAAGTTA", "ATTCGTAACTAGTAAGTTA"));