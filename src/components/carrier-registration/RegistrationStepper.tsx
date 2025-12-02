import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  number: number;
  title: string;
  completed: boolean;
  active: boolean;
}

interface RegistrationStepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  language?: "en" | "vi";
  translations?: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
  };
}

export const RegistrationStepper = ({ currentStep, onStepClick, language = "en", translations }: RegistrationStepperProps) => {
  const defaultTranslations = {
    step1: "Company Information",
    step2: "Truck Information",
    step3: "Load Preferences",
    step4: "Verification",
  };

  const t = translations || defaultTranslations;

  const steps: Step[] = [
    {
      number: 1,
      title: t.step1,
      completed: currentStep > 1,
      active: currentStep === 1,
    },
    {
      number: 2,
      title: t.step2,
      completed: currentStep > 2,
      active: currentStep === 2,
    },
    {
      number: 3,
      title: t.step3,
      completed: currentStep > 3,
      active: currentStep === 3,
    },
    {
      number: 4,
      title: t.step4,
      completed: currentStep > 4,
      active: currentStep === 4,
    },
  ];

  return (
    <div className="flex flex-col space-y-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-start">
          {/* Step Circle */}
          <div className="flex flex-col items-center mr-4">
            <button
              onClick={() => onStepClick(step.number)}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors cursor-pointer hover:opacity-80",
                step.completed
                  ? "bg-primary text-primary-foreground"
                  : step.active
                  ? "bg-primary text-primary-foreground"
                  : "border-2 border-border bg-background text-muted-foreground"
              )}
            >
              {step.completed ? (
                <Check className="w-5 h-5" />
              ) : (
                <span>{step.number}</span>
              )}
            </button>
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-0.5 h-16 mt-2",
                  step.completed ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
          
          {/* Step Title */}
          <button
            onClick={() => onStepClick(step.number)}
            className="pt-2 cursor-pointer hover:opacity-80 text-left"
          >
            <p
              className={cn(
                "text-sm font-medium",
                step.active ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.title}
            </p>
          </button>
        </div>
      ))}
    </div>
  );
};
