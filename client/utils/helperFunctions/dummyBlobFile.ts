export default function dummyBlobFile() {
    const blob = new Blob(["dummy"], { type: "text/plain" });
    return blob;
}