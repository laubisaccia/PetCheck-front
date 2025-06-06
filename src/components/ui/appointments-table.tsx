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
import { useState } from "react"
import { Eye } from "lucide-react"

type Appointment = {
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
}

export function AppointmentsTable({ appointments }: Props) {
  const [selectedPet, setSelectedPet] = useState<PetDetails | null>(null)
  const [open, setOpen] = useState(false)
  const [owner, setOwner] = useState<{ firstName: string; lastName: string } | null>(null)


  function getOwnerFullName(owner: { firstName: string; lastName: string }) {
  return `${owner.firstName} ${owner.lastName}`;
}


const handleOpenModal = async (
  petId: string,
  ownerData: { firstName: string; lastName: string }
) => {
  try {
    const res = await fetch(`http://localhost:8000/api/v1/pets/${petId}`)
    const data = await res.json()
    setSelectedPet(data)
    setOwner(ownerData)
    setOpen(true)
  } catch (error) {
    console.error("Error fetching pet:", error)
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
          const appointment_time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
                 <button
onClick={() => handleOpenModal(a.pet.id, a.pet.owner)}
  className="text-blue-600 hover:text-blue-800"
  title="Ver mascota"
>
  <Eye className="h-4 w-4" />
</button>
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
      </>

    
  )
}
