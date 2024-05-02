
export default function appendObjKeysToFormData(formData: FormData, data: object) {
    for (const key in data) {
        const value = data[key as keyof typeof data];
        if (typeof value === 'object' || Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
            continue;
        }
        if (typeof value !== 'undefined') formData.append(key, String(value));
    }
}