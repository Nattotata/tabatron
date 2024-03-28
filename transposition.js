const sequence = "imbnaortnqcl wpmu fm icwhmp svsn acps smjsv. Hntkc bkcam, Chcum. Dnh d nsmqkmie fepdcp bnunae znsmd, hclm p qrvfeseu bkmhumsv, dsmkr wpmu se imaocl qm paokciam, c icdnima bnunae plnq q dkefnqam. Psepdie ske slcae sdc q snusn bnkch c hnpscimp pm qmi"

const transpose = (char) => {
    const mappingObject = {
        g: "q",
        x: "w",
        m: "e",
        k: "r",
        s: "t",
        r: "y",
        v: "u",
        e: "i",
        n: "o",
        b: "p",
        c: "a",
        p: "s",
        h: "d",
        z: "f",
        y: "g",
        o: "h",
        w: "j",
        d: "k",
        l: "l",
        f: "z",
        j: "x",
        a: "c",
        q: "v",
        t: "b",
        i: "n",
        u: "m",
        " ": " "
    }
    return mappingObject[char]
}

const result = Array
    .from(sequence)
    .map((char) => transpose(char))
    .join("")
console.info(`
_______________________________
input:

${sequence}
_______________________________`
)

console.info(`
_______________________________
output:

${result}
_______________________________`)