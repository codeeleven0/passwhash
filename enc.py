# Copyright (C) 2024 Code Eleven (Mustafa E / @codeeleven0)
# Hashing secrets are not for decoding. It protects hash collision.
import re
chs = 32
chss = chs - 1
def isEven(x: int) -> bool:
    if (x % 2) == 0:
        return True
    else:
        return False
def calcavg(x: list) -> int:
    return sum(x) // len(x)
def splitstring(x: str, secret: None = None) -> tuple[str, str]:
    even: str = "".join([x[c] for c in range(len(x)) if isEven(c)])
    odd: str = "".join([x[c] for c in range(len(x)) if not isEven(c)])
    return (even, odd)
def applysecret(x: tuple[str, str], secret: str) -> tuple[str, str]:
    splitted: tuple[str, str] = splitstring(secret)
    encoded: tuple[str, str] = (splitted[1] + x[0], splitted[0] + x[1])
    return encoded
def calculateintegrity(x: tuple[str, str]) -> tuple[int, int, int]:
    arr: list = [ord(c) for c in "".join(x)]
    if arr:
        sum1: int = max(arr)
        sum2: int = min(arr)
        sum3: int = calcavg(arr)
        chrs: str = "".join([chr(i) for i in range(33, 126)])
        if chr(sum3) in chrs:
            return sum1, sum2, sum3
        else:
            return sum1, sum2, arr[0]
    else:
        return 65, 66, 67
def makeintegrity(x: tuple[int, int, int]) -> str:
    return "".join([chr(c) for c in x])
def makeend(x: tuple[str, str]) -> str:
    return x[0] + x[1]
def hashit(x: str, secret: str) -> str:
    splitted: tuple[str, str] = splitstring(x)
    encoded: tuple[str, str] = applysecret(splitted, secret)
    integrity: tuple[int, int, int] = calculateintegrity(encoded)
    integritystr: str = makeintegrity(integrity)
    hashstr: str = makeend(encoded)
    lastsplit: tuple[str, str] = splitstring(hashstr + integritystr)
    hashstr2: str = makeend(lastsplit)
    nstr: str = hashstr2.replace(" ", "*")
    n: str = ""
    if len(nstr) < chss:
        n = nstr
    else:
        for s in re.findall("."*(len(nstr)//chss), nstr):
            a: list = [ord(c) for c in s]
            n += chr(sum(a) // len(a))
    if len(n) < chss:
        try:
            n = n.ljust(chss,  makeintegrity(calculateintegrity(splitstring(secret)))[-1])
        except:
            n = n.ljust(chs//2, integritystr[-1])
            n = n.ljust(chs // 2 + chs // 3,  integritystr[0])
            n = n.ljust(chss, integritystr[1])
    if len(n) > chss:
        n = re.findall("."*chss, n)[0]
    try:
        end: str = makeend(splitstring(n)[-1::-1]) + secret[-1]
    except:
        end: str = makeend(splitstring(n)[-1::-1]) + nstr[-1]
    return end
def _passwhash(x: str, secret: str):
    try:
        return hashit(x, secret)
    except:
        try:
            return hashit("", secret)
        except:
            try:
                return hashit(x, "")
            except:
                return chs*"0"
def __passwhash(x: str, secret: str) -> str:
    hr: str = _passwhash(x, secret).replace(" ","*").replace("\n","").replace("\0","").replace("\r","")
    if len(hr) != chs:
        hr = hr.ljust(chs, hr[-1])
    return hr
def toHex(s: str):
    a = "".join([hex(ord(c) // 1).split("0x")[-1] for c in s])
    return a
def passwhash(data: str, secret: str):
    hashs = toHex(__passwhash(data, secret))
    return hashs