import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
}
export const formDataToJson = (formData) => {
    const jsonObject = {};

    formData.forEach((value, key) => {
        if (key.endsWith("[]")) {
            const cleanKey = key.slice(0, -2);
            if (!jsonObject[cleanKey]) {
                jsonObject[cleanKey] = [];
            }
            jsonObject[cleanKey].push(value);
        } else if (jsonObject[key]) {
            if (!Array.isArray(jsonObject[key])) {
                jsonObject[key] = [jsonObject[key]];
            }
            jsonObject[key].push(value);
        } else {
            jsonObject[key] = value;
        }
    });

    return jsonObject;
};
