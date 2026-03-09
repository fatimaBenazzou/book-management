"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function DangerZoneSection() {
  // TODO: requires backend support — no DELETE /users/me endpoint exists
  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription>
          Irreversible actions that affect your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-block">
              <Button variant="destructive" disabled type="button">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Not available yet</p>
          </TooltipContent>
        </Tooltip>
        <p className="mt-2 text-sm text-muted-foreground">
          Account deletion is not currently available. Contact support for
          assistance.
        </p>
      </CardContent>
    </Card>
  );
}
