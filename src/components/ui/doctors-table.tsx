import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Pencil, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Doctor {
  id: string;
  name: string;
}

interface Props {
  doctors: Doctor[];
  refreshDoctors: () => void;
}

export function DoctorsTable({ doctors, refreshDoctors }: Props) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleEditDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setName(doctor.name);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedDoctor) return;
    setIsSaving(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/doctors/${selectedDoctor.id} `,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token} `,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        }
      );
      if (!res.ok) throw new Error("Error al editar médico");
      setEditModalOpen(false);
      refreshDoctors();
    } catch (error) {
      console.error("Error al editar médico:", error);
      // Aquí podrías agregar un toast o alerta para mostrar el error
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8000/api/v1/doctors/${id} `, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token} `,
        },
      });
      if (!res.ok) throw new Error("No se pudo eliminar el médico");
      refreshDoctors();
    } catch (error) {
      console.error("Error al eliminar médico:", error);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doctor) => (
            <TableRow key={doctor.id}>
              <TableCell>{doctor.name}</TableCell>
              <TableCell>
                <button
                  onClick={() => handleEditDoctor(doctor)}
                  title="Editar médico"
                >
                  <Pencil className="h-5 w-5 text-green-600" />
                </button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button title="Eliminar médico">
                      <Trash className="h-5 w-5 text-red-600" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar médico?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteDoctor(doctor.id)}
                      >
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar médico</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre"
              className="w-full border px-2 py-1"
              disabled={isSaving}
            />
            <button
              onClick={handleSaveEdit}
              disabled={isSaving}
              className={`px-4 py-2 rounded text-white ${
                isSaving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
          
    </>
  );
}
