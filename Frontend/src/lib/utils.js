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
    if (dateString)
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(date);
    else return "NA";
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

export function getMonth(monthNumber) {
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    const index = (monthNumber - 1) % 12;
    
    return months[index >= 0 ? index : index + 12] || "Invalid month";
}

export function formatIndianNumber(num) {
    const numStr = num.toString().split(".");
    let integerPart = numStr[0];
    const decimalPart = numStr[1] ? "." + numStr[1] : "";
  
    const lastThree = integerPart.slice(-3);
    const otherDigits = integerPart.slice(0, -3);
  
    const formattedOther = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  
    return (formattedOther ? formattedOther + "," : "") + lastThree + decimalPart;
  }