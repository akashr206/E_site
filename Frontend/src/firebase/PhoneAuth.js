// PhoneAuth.js
import { getAuth, signInWithPhoneNumber } from "firebase/auth";
import { initializeRecaptcha } from "./reCaptcha";
import app from './config';

const auth = getAuth(app);

const sendOtp = async (phoneNumber, recaptchaContainerId) => {
    try {
        await initializeRecaptcha(auth, recaptchaContainerId);

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
