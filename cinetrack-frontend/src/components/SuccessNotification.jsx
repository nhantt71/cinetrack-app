import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuccessNotification({ message, onContinue, onButtonText = "Continue" }) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Success!</h1>
        <p className="text-muted-foreground">{message}</p>
      </div>

      <div className="space-y-4">
        <Button
          onClick={onContinue}
          className="w-full"
        >
          {onButtonText}
        </Button>
      </div>
    </div>
  );
}

