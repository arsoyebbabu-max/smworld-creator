import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", { phoneNumber, password });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary text-center">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex">
                <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                  <span className="text-sm">🇧🇩</span>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="rounded-l-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                Forget password?{" "}
              </span>
              <Button variant="link" className="p-0 h-auto text-primary">
                Reset
              </Button>
            </div>

            {/* Login Button */}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Create account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;