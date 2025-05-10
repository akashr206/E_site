import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle, Lock, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdminUnauthorized({ 
  redirectPath = "/", 
  redirectTime = 10, 
  message = "You don't have permission to access this admin panel",
  showRedirectTimer = true 
}) {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(redirectTime);

  useEffect(() => {
    if (!showRedirectTimer) return;

    const timer = countdown > 0 && setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    
    if (countdown === 0) {
      navigate(redirectPath);
    }
    
    return () => clearInterval(timer);
  }, [countdown, redirectPath, navigate, showRedirectTimer]);

  const handleRedirect = () => {
    navigate(redirectPath);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-6 w-6 text-red-500" />
            <CardTitle>Access Denied</CardTitle>
          </div>
          <CardDescription>Administrator privileges required</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unauthorized</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
          <p className="mt-4 text-sm text-gray-600">
            If you believe this is an error, please contact the system administrator
            or try logging in again with an authorized account.
          </p>
          {showRedirectTimer && (
            <p className="mt-2 text-sm text-gray-500">
              Redirecting to homepage in {countdown} seconds...
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleRedirect} variant="outline" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to {redirectPath === "/" ? "Homepage" : "Previous Page"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}