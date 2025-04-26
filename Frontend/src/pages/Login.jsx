import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { API_URL } from "../config/api";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import googleImg from "../assets/google.png";

export default function Login() {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full mb-16 max-w-sm">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                        Sign in with your Google account to continue
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4 flex-col items-center justify-center">
                    <Button className="w-4/5 py-2" variant={"outline"}>
                        <Link
                            className="w-full h-full flex items-center gap-2 justify-center"
                            to={`${API_URL}/auth/google`}
                        >
                            <img
                                className="w-6 h-6"
                                src={googleImg}
                                alt="google-icon"
                            />
                            Continue with google
                        </Link>
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/") } className="w-4/5">
                        <ArrowLeft />
                        Back to Home
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
