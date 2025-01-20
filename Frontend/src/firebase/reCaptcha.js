// Recaptcha.js
import { RecaptchaVerifier } from "firebase/auth";

/**
 * Initializes and renders the reCAPTCHA verifier.
 *
 * @param {object} auth - The Firebase Auth instance.
 * @param {string} containerId - The HTML element ID where the reCAPTCHA will be rendered.
 * @returns {Promise<void>} Resolves when the reCAPTCHA verifier is ready.
 */
const initializeRecaptcha = async (auth, containerId) => {
    return new Promise((resolve, reject) => {
        try {
            if (window.recaptchaVerifier) {
                resolve();
                return;
            }

            window.recaptchaVerifier = new RecaptchaVerifier(
                containerId,
                {
                    size: "invisible",
                    callback: (response) => {
                        console.log("reCAPTCHA solved:", response);
                        resolve();
                    },
                    "expired-callback": () => {
                        console.warn("reCAPTCHA expired. Please try again.");
                        reject("reCAPTCHA expired.");
                    },
                },
                auth
            );

            window.recaptchaVerifier.render().then(() => resolve());
        } catch (error) {
            reject(error);
        }
    });
};

export { initializeRecaptcha };
