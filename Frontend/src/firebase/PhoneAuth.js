// PhoneAuth.js
import { getAuth, signInWithPhoneNumber } from "firebase/auth";
import { initializeRecaptcha } from "./reCaptcha";
import app from './config';

const auth = getAuth(app);

const sendOtp = async (phoneNumber, recaptchaContainerId) => {
    try {
        window.recaptchaVerifier = new RecaptchaVerifier(
            recaptchaContainerId,
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

        const confirmationResult = await signInWithPhoneNumber(
            auth,
            phoneNumber,
            window.recaptchaVerifier
        );

        return confirmationResult;
    } catch (error) {
        throw error;
    }
};

export { sendOtp };
