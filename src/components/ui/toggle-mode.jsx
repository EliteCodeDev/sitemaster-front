"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./button";

export default function MyComponent() {
  const { setTheme } = useTheme();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-200">
            <Sun className="h-5 w-5 transition-all dark:hidden" />
            <Moon className="hidden h-5 w-5 transition-all dark:block" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Claro
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Oscuro
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            Sistema
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
