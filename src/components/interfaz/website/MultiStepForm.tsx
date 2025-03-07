"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import FormStep from "./FormStep";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

interface MultiStepFormProps {
  steps: {
    id: string;
    title: string;
    description: string;
    fields: any[];
  }[];
  onSubmit: (data: any) => void;
  validationSchema: z.ZodObject<any>;
}

export default function MultiStepForm({
  steps,
  onSubmit,
  validationSchema,
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const methods = useForm({
    resolver: zodResolver(validationSchema),
    mode: "onChange",
  });

  const {
    handleSubmit,
    trigger,
    formState: { errors, isValid },
  } = methods;

  const goToNextStep = async () => {
    const fields = steps[currentStep].fields.map((field) => field.name);
    const isStepValid = await trigger(fields);

    if (isStepValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const submitForm = (data: any) => {
    onSubmit(data);
  };
  console.log(errors);
  console.log(steps.length);
  console.log(currentStep);
  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  index < currentStep
                    ? "bg-primary border-primary text-primary-foreground "
                    : index === currentStep
                    ? "border-primary text-primary"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {index < currentStep - 1 ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={`text-xs mt-2 ${
                  index <= currentStep
                    ? "text-primary font-medium"
                    : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
              {index < steps.length && (
                <div
                  className={`h-[2px] w-24 mt-4 hidden sm:block ${
                    index < currentStep ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(submitForm)}>
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <CardDescription>
                {steps[currentStep].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormStep
                key={steps[currentStep].id}
                fields={steps[currentStep].fields}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={goToPreviousStep}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Atras
              </Button>
              <Button
                type="button"
                onClick={async () => {
                  const fields = steps[currentStep].fields.map(
                    (field) => field.name
                  );
                  const isStepValid = await trigger(fields);
                  if (isStepValid) {
                    if (currentStep === steps.length - 1) {
                      // Último paso: envía el formulario
                      handleSubmit(submitForm)();
                    } else {
                      // No es el último paso: avanza al siguiente
                      setCurrentStep((prev) => prev + 1);
                    }
                  }
                }}
              >
                {currentStep === steps.length - 1 ? (
                  "Enviar"
                ) : (
                  <>
                    Siguiente <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </FormProvider>
    </div>
  );
}
