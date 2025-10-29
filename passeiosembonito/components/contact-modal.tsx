"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ContactModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function ContactModal({ isOpen, setIsOpen }: ContactModalProps) {
  console.log("ContactModal rendered, isOpen:", isOpen);
  const router = useRouter(); // Initialize useRouter
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    // Basic validation
    if (!name.trim()) {
      setMessage("Por favor, insira seu nome.");
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      setMessage("O nome deve conter apenas caracteres alfabéticos.");
      return;
    }
    if (!whatsapp.trim()) {
      setMessage("Por favor, insira seu número de WhatsApp.");
      return;
    }
    if (!/^\d+$/.test(whatsapp)) {
      setMessage("O número de WhatsApp deve conter apenas dígitos.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, whatsapp }),
      });

      const data = await response.json();

      if (response.ok) {
        setName("");
        setWhatsapp("");
        router.push("/obrigado"); // Redirect to /obrigado page
      } else {
        setMessage(data.error || "Algo deu errado. Por favor, tente novamente.");
      }
    } catch (error) {
      setMessage("Ocorreu um erro inesperado. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[90vw] max-w-md">
        <DialogHeader>
          <DialogTitle>Entre em Contato!</DialogTitle>
          <DialogDescription>
            Deixe seus dados e entraremos em contato via WhatsApp.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="whatsapp" className="text-right">
              WhatsApp
            </Label>
            <Input
              id="whatsapp"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="col-span-3"
              placeholder="(XX) XXXXX-XXXX"
              required
            />
          </div>
          {message && <p className="text-center text-sm">{message}</p>}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}