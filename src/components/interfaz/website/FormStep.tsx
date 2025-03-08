"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface FormStepProps {
  fields: any[];
}

export default function FormStep({ fields }: FormStepProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-6">
      {fields.map((field) => {
        const fieldName = field.name;

        switch (field.type) {
          case "text":
          case "email":
          case "tel":
          case "url":
          case "password":
            return (
              <FormField
                key={fieldName}
                control={control}
                name={fieldName}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>
                      {field.label}
                      {field.required && (
                        <span className="text-[color:var(--app-primary)] ml-1">
                          *
                        </span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        readOnly={field.readonly ? true : false}
                        className={
                          field.readonly ? "bg-gray-100 cursor-not-allowed" : ""
                        }
                        {...formField}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );

          case "textarea":
            return (
              <FormField
                key={fieldName}
                control={control}
                name={fieldName}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>
                      {field.label}
                      {field.required && (
                        <span className="text-[color:var(--app-primary)] ml-1">
                          *
                        </span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={field.placeholder}
                        {...formField}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );

          case "select":
            return (
              <FormField
                key={fieldName}
                control={control}
                name={fieldName}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>
                      {field.label}
                      {field.required && (
                        <span className="text-[color:var(--app-primary)] ml-1">
                          *
                        </span>
                      )}
                    </FormLabel>
                    <Select
                      onValueChange={formField.onChange}
                      defaultValue={formField.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {field.options.map((option: any) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );

          case "radio":
            return (
              <FormField
                key={fieldName}
                control={control}
                name={fieldName}
                render={({ field: formField }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>
                      {field.label}
                      {field.required && (
                        <span className="text-[color:var(--app-primary)] ml-1">
                          *
                        </span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={formField.value}
                        onValueChange={formField.onChange}
                        className="flex flex-col space-y-2"
                      >
                        {field.options.map((option: any) => (
                          <div
                            key={option.value}
                            className="flex items-center space-x-2 border rounded-lg p-4 shadow transition hover:border-[color:var(--app-primary)]"
                          >
                            <RadioGroupItem
                              value={option.value}
                              id={`${fieldName}-${option.value}`}
                            />
                            <Label htmlFor={`${fieldName}-${option.value}`}>
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );

          case "checkbox":
            return (
              <FormField
                key={fieldName}
                control={control}
                name={fieldName}
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>
                        {field.label}
                        {field.required && (
                          <span className="text-[color:var(--app-primary)] ml-1">
                            *
                          </span>
                        )}
                      </FormLabel>
                    </div>
                    {field.options.map((option: any) => (
                      <FormField
                        key={option.value}
                        control={control}
                        name={`${fieldName}.${option.value}`}
                        render={({ field: checkboxField }) => {
                          return (
                            <FormItem
                              key={option.value}
                              className="flex flex-row items-start space-x-3 space-y-0 mb-2"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={checkboxField.value}
                                  onCheckedChange={checkboxField.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            );

          case "array":
            return (
              <ArrayField
                key={fieldName}
                name={fieldName}
                label={field.label}
                itemTemplate={field.itemTemplate}
                required={field.required}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

interface ArrayFieldProps {
  name: string;
  label: string;
  itemTemplate: Record<string, any>;
  required?: boolean;
}

function ArrayField({ name, label, itemTemplate, required }: ArrayFieldProps) {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <FormLabel>
          {label}
          {required && (
            <span className="text-[color:var(--app-primary)] ml-1">*</span>
          )}
        </FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const newItem = Object.keys(itemTemplate).reduce((acc, key) => {
              acc[key] = "";
              return acc;
            }, {} as Record<string, string>);
            append(newItem);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Añadir
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="text-sm text-muted-foreground italic">
          No hay elementos añadidos aún. Haz clic en "Añadir" para agregar uno.
        </div>
      )}

      {fields.map((item, index) => (
        <div key={item.id} className="border rounded-md p-4 relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => remove(index)}
          >
            <Trash2 className="h-4 w-4 text-[color:var(--app-primary)]" />
          </Button>

          <div className="grid gap-4 mt-2">
            {Object.entries(itemTemplate).map(([fieldKey, fieldConfig]) => {
              const fieldPath = `${name}.${index}.${fieldKey}`;

              if (fieldConfig.type === "select") {
                return (
                  <FormField
                    key={fieldPath}
                    control={control}
                    name={fieldPath}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel>{fieldConfig.label}</FormLabel>
                        <Select
                          onValueChange={formField.onChange}
                          defaultValue={formField.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una opción" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {fieldConfig.options.map((option: any) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              }

              return (
                <FormField
                  key={fieldPath}
                  control={control}
                  name={fieldPath}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>{fieldConfig.label}</FormLabel>
                      <FormControl>
                        <Input
                          type={fieldConfig.type}
                          placeholder={fieldConfig.placeholder}
                          {...formField}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
