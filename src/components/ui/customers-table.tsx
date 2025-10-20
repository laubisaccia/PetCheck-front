import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash, CalendarPlus } from "lucide-react";

type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
};

type Pet = {
  id: string;
  name: string;
};

type Doctor = {
  id: string;
  name: string;
};
type Props = {
  customers: Customer[];
  onCreatePetClick: (customerId: string) => void;
  fetchPetsByCustomerId: (customerId: string) => Promise<Pet[]>;
  refreshCustomerPets: (customerId: string) => void;
  refreshId: string | null;
  refreshCustomers: () => void;
  refreshAppointments: () => void;
};

export function CustomersTable({
  customers,
  onCreatePetClick,
  fetchPetsByCustomerId,
  refreshId,
  refreshCustomers,
  refreshAppointments,
}: Props) {
  const [customerPets, setCustomerPets] = useState<Record<string, Pet[]>>({});
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [availableDoctors, setAvailableDoctors] = useState<Doctor[]>([]);
  const [selectedPetId, setSelectedPetId] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newAppointmentModalOpen, setNewAppointmentModalOpen] = useState(false);
  const [appointmentCustomerId, setAppointmentCustomerId] = useState<
    string | null
  >(null);

  const loadPets = async (customerId: string) => {
    console.log(customerId);
    if (customerPets[customerId] || loadingIds.has(customerId)) return;
    setLoadingIds((prev) => new Set(prev).add(customerId));
    const pets = await fetchPetsByCustomerId(customerId);
    console.log("Mascotas para", customerId, pets);

    setCustomerPets((prev) => ({ ...prev, [customerId]: pets }));
    setLoadingIds((prev) => {
      const updated = new Set(prev);
      updated.delete(customerId);
      return updated;
    });
  };

  useEffect(() => {
    if (refreshId) {
      setLoadingIds((prev) => new Set(prev).add(refreshId));
      fetchPetsByCustomerId(refreshId).then((pets) => {
        setCustomerPets((prev) => ({ ...prev, [refreshId]: pets }));
        setLoadingIds((prev) => {
          const updated = new Set(prev);
          updated.delete(refreshId);
          return updated;
        });
      });
    }
  }, [refreshId, fetchPetsByCustomerId]);

  //me traigo los docs
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
    fetch("http://localhost:8000/api/v1/doctors", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => setAvailableDoctors(data))
      .catch((err) => console.error("Error al traer doctores:", err));
  }, []);

  //aca se cargan las pets del cliente cuando abro modal de turno
  useEffect(() => {
    if (appointmentCustomerId && !customerPets[appointmentCustomerId]) {
      loadPets(appointmentCustomerId);
    }
  }, [appointmentCustomerId]);

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFirstName(customer.firstName);
    setLastName(customer.lastName);
    setEmail(customer.email || "");
    setPhone(customer.phone || "");
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedCustomer) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/customers/${selectedCustomer.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ firstName, lastName, email, phone }),
        }
      );
      if (!res.ok) throw new Error("Error al editar cliente");
      setEditModalOpen(false);
      refreshCustomers();
    } catch (error) {
      console.error("Error al editar cliente:", error);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8000/api/v1/customers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("No se pudo eliminar el cliente");
      refreshCustomers();
      refreshAppointments();
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
    }
  };
  const handleCreateAppointment = async () => {
    const token = localStorage.getItem("token");
    const dateObj = new Date(`${newDate}T${newTime}`);
    const correctedDate = new Date(
      dateObj.getTime() - dateObj.getTimezoneOffset() * 60000
    );

    try {
      const res = await fetch("http://localhost:8000/api/v1/appointments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pet_id: selectedPetId,
          doctor_id: selectedDoctorId,
          date: correctedDate.toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Error al crear turno");
      refreshAppointments();
      refreshCustomers();
      setNewAppointmentModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const openAppointmentModal = (customerId: string) => {
    setAppointmentCustomerId(customerId);
    setSelectedPetId("");
    setSelectedDoctorId("");
    setNewDate("");
    setNewTime("");
    setNewAppointmentModalOpen(true);
  };
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellido</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Mascotas</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.firstName}</TableCell>
              <TableCell>{customer.lastName}</TableCell>
              <TableCell>{customer.email || "-"}</TableCell>
              <TableCell>{customer.phone || "-"}</TableCell>
              <TableCell>
                <DropdownMenu
                  onOpenChange={(isOpen) => {
                    if (isOpen) loadPets(customer.id);
                  }}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={loadingIds.has(customer.id)}
                    >
                      {loadingIds.has(customer.id)
                        ? "Cargando..."
                        : "Ver mascotas"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="z-50"
                    side="bottom"
                    align="start"
                  >
                    <DropdownMenuLabel>Mascotas</DropdownMenuLabel>
                    {customerPets[customer.id]?.length ? (
                      customerPets[customer.id].map((pet) => (
                        <DropdownMenuItem key={pet.id}>
                          {pet.name}
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <DropdownMenuItem disabled>
                        No tiene mascotas
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>
                <button
                  onClick={() => onCreatePetClick(customer.id)}
                  title="Crear mascota"
                >
                  <Plus className="h-5 w-5 text-blue-600" />
                </button>
                <button
                  onClick={() => handleEditCustomer(customer)}
                  title="Editar cliente"
                >
                  <Pencil className="h-5 w-5 text-green-600" />
                </button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button title="Eliminar cliente">
                      <Trash className="h-5 w-5 text-red-600" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteCustomer(customer.id)}
                      >
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
              <TableCell>
                <button
                  onClick={() => openAppointmentModal(customer.id)}
                  title="Crear turno"
                >
                  <CalendarPlus className="h-5 w-5 text-purple-600" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Nombre"
              className="w-full border px-2 py-1"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Apellido"
              className="w-full border px-2 py-1"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border px-2 py-1"
            />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Teléfono"
              className="w-full border px-2 py-1"
            />
            <DialogClose asChild>
              <button
                onClick={handleSaveEdit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Guardar cambios
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={newAppointmentModalOpen}
        onOpenChange={setNewAppointmentModalOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo turno</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {availableDoctors.length === 0 && (
              <p className="text-sm text-destructive">
                No hay médicos disponibles. Por favor crea uno antes de asignar
                turnos.
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="pet-select">Mascota</Label>
              <select
                id="pet-select"
                value={selectedPetId}
                onChange={(e) => setSelectedPetId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Seleccioná una mascota</option>
                {appointmentCustomerId &&
                  customerPets[appointmentCustomerId]?.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctor-select">Médico</Label>
              <select
                id="doctor-select"
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Seleccioná un médico</option>
                {availableDoctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointment-date">Fecha</Label>
              <Input
                id="appointment-date"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointment-time">Horario</Label>
              <Input
                id="appointment-time"
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setNewAppointmentModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleCreateAppointment}
                disabled={
                  !selectedPetId ||
                  !selectedDoctorId ||
                  !newDate ||
                  !newTime ||
                  availableDoctors.length === 0
                }
              >
                Crear turno
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
