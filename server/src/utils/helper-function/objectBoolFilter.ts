export default function objectBoolFilter(obj: object) {
    let newObj = {};
    for (let key in obj) {
        newObj[key] = obj[key] === "true" ? true
            : (obj[key] === "false" ? false
                : obj[key]);
    }
    return newObj;
}

//turn string boolean values such as ["true"] into the boolean [true]