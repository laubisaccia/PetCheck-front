import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type Props = {
  onCreated?: () => void;
};
export function CreateDoctorForm({ onCreated }: Props) {
  const [name, setName] = useState("");

  const handleCreateDoctor = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/api/v1/doctors/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error("Error al crear médico", {
        description: data.detail || "Datos incorrectos",
      });
      return;
    }

    toast.success("Médico creado correctamente");
    setName("");
    if (onCreated) {
      onCreated();
    }
  };

  return (
    <Card className="max-w-md mt-4">
      <CardHeader>
        <CardTitle>Crear nuevo médico</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <Label>Nombre</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <Button onClick={handleCreateDoctor}>Crear médico</Button>
      </CardContent>
    </Card>
  );
}
