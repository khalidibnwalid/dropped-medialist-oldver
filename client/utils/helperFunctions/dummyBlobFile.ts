export default function dummyBlobFile(size = 5 /** in Bytes */) {
    // you can differentiate between dummy files by the size
    const text = generateWord(size);
    const blob = new Blob([text], { type: "text/plain" });
    return blob;
}

function generateWord(length: number) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let word = '';
    for (let i = 0; i < length; i++) {
        word += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return word;
}