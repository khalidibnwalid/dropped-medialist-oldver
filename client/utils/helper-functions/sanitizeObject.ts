import DOMPurify from "dompurify";

export default function sanitizeObject(obj: Record<string, any>) {
    for (let key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitizeObject(obj[key]);
        } else if (typeof obj[key] === 'boolean') {
            // to save boolean from being disorted from a needless santization.
        } else if (obj[key] === null || obj[key] === undefined) {
            // same as boolean
        } else {
            obj[key] = DOMPurify.sanitize(obj[key]);
        } 

    }
}


//just santize by being called alone, without being assinged to a variable such as:
// const data = ...
// sanitizeObject(data)