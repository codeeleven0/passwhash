// Copyright (C) 2024 Code Eleven (Mustafa E / @codeeleven0)
// Hashing secrets are not for decoding. It protects hash collision.
const chs = 32;
const isEven = (x) => {
    return (x % 2) == 0;
}
const len = (x) => {
    return x.length;
}
const sum = (x) => {
    s = 0;
    x.forEach(h => s+=h);
    return s;
}
const div = (x, y) => {
    return Math.round(x / y);
} 
const ord = (x) => {
    return x.charCodeAt(0);
}
const chr = (x) => {
    return String.fromCharCode(x);
}
const max = (x) => {
    maxx = Number.MIN_VALUE;
    for(let i = 0; i < len(x); i++){
        if (x[i] > maxx){
            maxx = x[i];
        }
    }
    return maxx;
}
const min = (x) => {
    minn = Number.MAX_VALUE;
    for(let i = 0; i < len(x); i++){
        if (minn > x[i]){
            minn = x[i];
        }
    }
    return minn;
}
const findall = (pat, str) => {
    a = new RegExp(pat, "g");
    return str.match(a);
}
const strby = (s, by) => {
    ns = [];
    for(let i = 0; i < by; i++){
        ns.push(s)
    }
    return ns.join("");
}
const ljust = (str, times, d) => {
    ln = len(str);
    while(ln < times){
        str += d;
        ln = len(str);
        if (ln == times){
            break;
        }
    }
    return str;
}
const reversearr = (arr) => {
    return arr.reverse();
}
const calcAvg = (x) => {
    return div(sum(x), len(x));
}
const splitstring = (x) => {
    even = ""
    odd = ""
    for(let i = 0; i < len(x); i++){
        if (isEven(i)){
            even += x[i];
        }else{
            odd += x[i];
        }
    }
    return [even, odd];
}
const applysecret = (x, secret) => {
    splitted = splitstring(secret);
    encoded = [splitted[1] + x[0], splitted[0] + x[1]];
    return encoded;
}
const calculateintegrity = (x) => {
    s = x.join("");
    arr = [];
    for(let i = 0; i < len(s); i++){
        arr.push(s.charCodeAt(i));
    }
    if (arr){
        sum1 = max(arr);
        sum2 = min(arr);
        sum3 = calcAvg(arr);
        chrs = "";
        for(let j = 33; j < 126; j++){
            chrs += chr(j);
        }
        if (chrs.includes(chr(sum3))){
            return [sum1, sum2, sum3];
        }else{
            return [sum1, sum2, arr[0]];
        }
    }else{
        return [65, 66, 67];
    }
}
const makeintegrity = (x) => {
    s = "";
    for(let j = 0; j < len(x); j++){
        s += chr(x[j]);
    }
    return s;
}
const makeend = (x) => {
    return x[0] + x[1];
}
const hashit = (x, secret) => {
    splitted = splitstring(x);
    encoded = applysecret(splitted, secret);
    integrity = calculateintegrity(encoded);
    integritystr = makeintegrity(integrity);
    hashstr = makeend(encoded);
    lastsplit = splitstring(hashstr + integritystr);
    hashstr2 = makeend(lastsplit);
    nstr = hashstr2.replaceAll(" ","*");
    n = "";
    if (len(nstr) < chs-1){
        n = nstr;
    }else{
        a = findall(strby(".",div(len(nstr), chs-1)), nstr);
        for(let s = 0; s < len(a); s++){
            ac = [];
            for (let i = 0; i < len(a[s]); i++){
                ac.push(ord(a[s][i]));
                n += chr(div(sum(ac), len(ac)));
            }
        }
    }
    if (len(n) < chs-1){
        try{
            c = makeintegrity(calculateintegrity(splitstring(secret)))
            n = ljust(n, chs-1, chr(c.charCodeAt(c.length-1)));
        }catch(e){
            n = ljust(n, div(chs, 2), integritystr[-1]),
            n = ljust(n, div(chs, 2) + div(chs, 3), integritystr[0]),
            n = ljust(n, chs-1, integritystr[1]);
        }
    }
    if (len(n) > chs-1){
        n = findall(strby(".",chs-1), n)[0];
    }
    try{
        end = makeend(reversearr(splitstring(n))) + chr(secret.charCodeAt(secret.length-1));
    }catch(x){
        end = makeend(reversearr(splitstring(n))) + chr(nstr.charCodeAt(nstr.length-1));
    }
    return end;
}
const _passwhash = (x, secret) => {
    try{
        return hashit(x, secret);
    }catch(e0){
        try{
            console.error(e0);
            return hashit("", secret);
        }catch(e1){
            try{
                console.error(e1);
                return hashit(x, "");
            }catch(e2){
                console.error(e2);
                return strby("0", chs);
            }
        }
    }
}
const passwhash = (x, secret) => {
    hr = _passwhash(x, secret).replaceAll(" ","*").replaceAll("\n","").replaceAll("\r","").replaceAll("\0","");
    if(len(hr) != chs){
        hr = ljust(hr, chs, hr[hr.length-1]);
    }
    return hr;
}