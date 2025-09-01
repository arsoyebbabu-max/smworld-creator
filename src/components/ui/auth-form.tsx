import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean
}

export function AuthForm({ className, isLoading, ...props }: AuthFormProps) {
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading} className="w-full">
            {isLoading && (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current" />
            )}
            Sign In with Email
          </Button>
        </div>
      </form>
    </div>
  )
}