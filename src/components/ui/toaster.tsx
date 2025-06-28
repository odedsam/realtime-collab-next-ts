"use client";
import { Toaster as SonnerToaster } from "sonner";

export const Toaster = () => {
  return (
    <SonnerToaster
      position="top-right"
      richColors={true}
      closeButton
      toastOptions={{
        classNames: {
          toast: "bg-primary border border-quinary rounded-lg text-white",

          title: "text-white font-medium",
          description: "text-white/90",
          closeButton: "text-white/70 hover:text-white border-quinary",

          success: "bg-green-600 border border-green-500 rounded-lg text-white",
          error: "bg-red-600 border border-red-500 rounded-lg text-white",
          warning: "bg-yellow-600 border border-yellow-500 rounded-lg text-white",
          info: "bg-primary border border-quinary rounded-lg text-white",
        },
      }}
    />
  );
};
