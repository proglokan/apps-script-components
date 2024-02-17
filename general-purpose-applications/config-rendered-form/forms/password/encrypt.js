'use strict';
async function encryptData(data, key) {
    return crypto.subtle.encrypt({ name: 'AES-GCM', iv: new Uint8Array(12) }, key, data);
}
async function decryptData(encryptedData, key) {
    return crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(12) }, key, encryptedData);
}
(async () => {
    // Generate a symmetric key
    const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
    // Data to encrypt
    const data = new TextEncoder().encode('Hello, world!'); //?
    // Encrypt the data
    const encryptedData = await encryptData(data, key);
    // Decrypt the data
    const decryptedData = await decryptData(encryptedData, key);
    const decryptedText = new TextDecoder().decode(decryptedData);
    console.log('Decrypted text:', decryptedText);
})();
//# sourceMappingURL=encrypt.js.map