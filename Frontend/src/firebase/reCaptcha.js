// Recaptcha.js
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import app from './config'
const Auth = getAuth(app);

const initializeRecaptcha = async (auth = Auth, containerId) => {
    return new Promise((resolve, reject) => {
        try {
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
            }

            window.recaptchaVerifier = new RecaptchaVerifier(
                auth, containerId,
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
                }
                
            );

            window.recaptchaVerifier.render().then(() => resolve());
        } catch (error) {
            reject(error);
        }
    });
};

export { initializeRecaptcha };
