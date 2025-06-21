import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

import { useState } from "react"
import { Eye,Pencil, Trash  } from "lucide-react"

export type Appointment = {
  id: string
  date: string
  diagnosis: string
  treatment: string
  pet: {
    id: string
    name: string
    owner:{
      firstName:string,
      id:string,
      lastName:string
    }
  }
  doctor: {
    id: string
    name: string
  }
}

type PetDetails = {
  id: string
  name: string
  animal: string
  breed: string
  age: number
  customer_id: string
}


type Props = {
  appointments: Appointment[]
refreshAppointments: () => void}

const fetchWithAuth = (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token")

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      ...(options.method === "POST" || options.method === "PATCH"
        ? { "Content-Type": "application/json" }
        : {}),
    },
  })
}
export function AppointmentsTable({ appointments,refreshAppointments }: Props) {
  const [selectedPet, setSelectedPet] = useState<PetDetails | null>(null)
  const [open, setOpen] = useState(false)
  const [owner, setOwner] = useState<{ firstName: string; lastName: string } | null>(null)

  const [editModalOpen, setEditModalOpen] = useState(false)
const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
const [newDate, setNewDate] = useState("")
const [newTime, setNewTime] = useState("")


  function getOwnerFullName(owner: { firstName: string; lastName: string }) {
  return `${owner.firstName} ${owner.lastName}`;
}


const handleOpenModal = async (
  petId: string,
  ownerData: { firstName: string; lastName: string }
) => {
  try {
    const res = await fetchWithAuth(`http://localhost:8000/api/v1/pets/${petId}`)
    const data = await res.json()
    setSelectedPet(data)
    setOwner(ownerData)
    setOpen(true)
  } catch (error) {
    console.error("Error fetching pet:", error)
  }
}

const handleEditClick = (appointment: Appointment) => {
  setSelectedAppointment(appointment)

  const dateObj = new Date(appointment.date)
  setNewDate(dateObj.toISOString().split("T")[0]) // yyyy-mm-dd
  setNewTime(dateObj.toTimeString().slice(0, 5))   // hh:mm
  setEditModalOpen(true)
}

const handleSaveEdit = async () => {
  if (!selectedAppointment) return

  const localDate = new Date(`${newDate}T${newTime}`);
  const timezoneOffset = localDate.getTimezoneOffset() * 60000; // en ms
  const correctedDate = new Date(localDate.getTime() - timezoneOffset);

  try {
    const res = await fetchWithAuth(`http://localhost:8000/api/v1/appointments/${selectedAppointment.id}`, {
      method: "PATCH",
     
      body: JSON.stringify({ date: correctedDate.toISOString() }),
    })
    refreshAppointments()
    if (!res.ok) throw new Error("Error al actualizar turno")

    const updatedAppointment = await res.json()
    console.log("Actualizado:", updatedAppointment)

    setEditModalOpen(false)
    setSelectedAppointment(null)
  } catch (error) {
    console.error("Error al actualizar el turno:", error)
  }
}

const handleDelete = async (id: string) => {
  try {
    const res = await fetchWithAuth(`http://localhost:8000/api/v1/appointments/${id}`, {
      method: "DELETE",
    })
    if (!res.ok) throw new Error("NO se pudo eliminar el turno")
    refreshAppointments()
  } catch (error) {
    console.log(error)
  }
}



  return (
    <> 
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Hora</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Mascota</TableHead>
          <TableHead>Tratamiento</TableHead>
          <TableHead>Diagnóstico</TableHead>
          <TableHead>Médico</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((a) => {
        
          const dateObj = new Date(a.date)
          const appointment_date = dateObj.toLocaleDateString()
          const appointment_time = dateObj.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
          })
          const ownerFullName=getOwnerFullName(a.pet.owner)

          return (
            <TableRow key={a.id}>
              <TableCell>{appointment_date}</TableCell>
              <TableCell>{appointment_time}</TableCell>
              <TableCell>{ownerFullName}</TableCell> 
               <TableCell>{a.pet.name}</TableCell> 
              <TableCell>{a.diagnosis}</TableCell>
              <TableCell>{a.treatment}</TableCell>
              <TableCell>{a.doctor.name}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                 <button
                    onClick={() => handleOpenModal(a.pet.id, a.pet.owner)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Ver mascota">
                      <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEditClick(a)} 
                    className="text-green-600 hover:text-green-800"
                    title="Editar turno">
                      <Pencil className="h-4 w-4" />
                  </button>
                    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="text-red-600 hover:text-red-800"
          title="Eliminar turno"
        >
          <Trash className="h-4 w-4" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estas seguro de eliminar este turno?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete(a.id)}>
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
                  
                </div>
                </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">


          <DialogHeader>
            <DialogTitle>Información de la mascota</DialogTitle>
          </DialogHeader>

          {selectedPet ? (
            <div className="space-y-2">
              <p><strong>Nombre:</strong> {selectedPet.name}</p>
              <p><strong>Especie:</strong> {selectedPet.animal}</p>
              <p><strong>Raza:</strong> {selectedPet.breed}</p>
              <p><strong>Edad:</strong> {selectedPet.age} años</p>
              <p><strong>Dueño:</strong>  {owner ? getOwnerFullName(owner) : "Desconocido"}</p>

              <DialogClose asChild>
                <button
                  onClick={() => {
                    console.log("Pedir turno para mascota ID:", selectedPet.id)
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Pedir turno
                </button>
              </DialogClose>
            </div>
          ) : (
            <p>Cargando información...</p>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <DialogHeader>
        <DialogTitle>Editar turno</DialogTitle>
      </DialogHeader>

    {selectedAppointment && (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nueva fecha</label>
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Nuevo horario</label>
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1"
          />
        </div>
        <DialogClose asChild>
          <button
            onClick={handleSaveEdit}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Guardar cambios
          </button>
        </DialogClose>
        
      </div>
    )}
  </DialogContent>
</Dialog>

      </>

    
  )
}
