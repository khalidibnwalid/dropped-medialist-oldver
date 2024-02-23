import DOMPurify from "dompurify";

export default function sanitizeString(string: string) {
    const sanitized = DOMPurify.sanitize(string);
    return sanitized;
}