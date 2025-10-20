import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

type CreatePetFormProps = {
  customerId: string;
  onClose: () => void;
  onCreated: (newPet: any) => void;
};

export function CreatePetForm({
  customerId,
  onClose,
  onCreated,
}: CreatePetFormProps) {
  const [name, setName] = useState("");
  const [animal, setAnimal] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/v1/pets`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          animal,
          breed,
          age: Number(age),
          customer_id: customerId,
        }),
      });

      if (res.ok) {
        const newPet = await res.json();
        toast.success("Mascota creada exitosamente");
        onCreated(newPet);
        onClose();
      } else {
        toast.error("Error al crear mascota");
      }
    } catch (error) {
      toast.error("Error al crear mascota");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear nueva mascota</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Firulais"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="animal">Animal</Label>
            <Input
              id="animal"
              required
              value={animal}
              onChange={(e) => setAnimal(e.target.value)}
              placeholder="Ej: Perro, Gato"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="breed">Raza</Label>
            <Input
              id="breed"
              required
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="Ej: Labrador"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Edad (años)</Label>
            <Input
              id="age"
              required
              type="number"
              min={0}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Ej: 3"
            />
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear mascota"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
