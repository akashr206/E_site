import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { Button } from "./button";

const Prompt = ({ title, text, to, toValue, close }) => {
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div className="h-[100vh] w-[100vw] fixed top-0 left-0 flex items-center justify-center z-20">
            <motion.div
                className="absolute bg-black opacity-50 h-full w-full"
                aria-hidden="true"
                onClick={close}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            ></motion.div>

            <motion.div
                className="relative w-[300px] sm:w-[350px] bg-white rounded-md p-5 px-9 z-40 shadow-lg"
                role="dialog"
                aria-modal="true"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
            >
                <h2 className="text-center text-xl font-bold mb-4">{title}</h2>

                <p className="text-gray-500 mb-6">{text}.</p>

                <div className="flex justify-center space-x-3">
                    <Button variant={"outline"} onClick={close}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => navigate(`/${to}`)}
                        className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-700"
                    >
                        {toValue}
                        <ArrowUpRight className="w-4 h-4" />
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default Prompt;
