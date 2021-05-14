import crypto from "crypto";

const encryptionKey = "FmqmfrEnPFYW0Rahhf7aGdqKbVJYiFqd";

/**
 * Encrypt text
 * @param {*} text
 */
export const encrypt = async text => {
    const IV_LENGTH = 16;
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv(
        "aes-256-cbc",
        Buffer.from(encryptionKey),
        iv
    );
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
};

/**
 * Decrypt text
 * @param {*} text
 */
export const decrypt = async text => {
    let textParts = text.split(":");
    let iv = Buffer.from(textParts.shift(), "hex");
    let encryptedText = Buffer.from(textParts.join(":"), "hex");
    let decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(encryptionKey),
        iv
    );
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
};

export default {
    encrypt,
    decrypt,
};
