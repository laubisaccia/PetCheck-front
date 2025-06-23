import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Pencil, Trash  } from "lucide-react"


type Customer = {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
}

type Pet = {
  id: string
  name: string
}

type Props = {
  customers: Customer[]
  onCreatePetClick: (customerId: string) => void
  fetchPetsByCustomerId: (customerId: string) => Promise<Pet[]>
  refreshCustomerPets: (customerId: string) => void
  refreshId: string | null
  refreshCustomers: () => void 
}

export function CustomersTable({ customers, onCreatePetClick, fetchPetsByCustomerId,refreshId,refreshCustomers }: Props) {
  const [customerPets, setCustomerPets] = useState<Record<string, Pet[]>>({})
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set())
  const [editModalOpen, setEditModalOpen] = useState(false)
const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
const [firstName, setFirstName] = useState("")
const [lastName, setLastName] = useState("")
const [email, setEmail] = useState("")
const [phone, setPhone] = useState("")

  const loadPets = async (customerId: string) => {
    console.log(customerId)
    if (customerPets[customerId] || loadingIds.has(customerId)) return
    setLoadingIds((prev) => new Set(prev).add(customerId))
    const pets = await fetchPetsByCustomerId(customerId)
    console.log("Mascotas para", customerId, pets)

    setCustomerPets((prev) => ({ ...prev, [customerId]: pets }))
    setLoadingIds((prev) => {
      const updated = new Set(prev)
      updated.delete(customerId)
      return updated
    })
  }
  useEffect(() => {
    if (refreshId) {
      setLoadingIds((prev) => new Set(prev).add(refreshId))
      fetchPetsByCustomerId(refreshId).then((pets) => {
        setCustomerPets((prev) => ({ ...prev, [refreshId]: pets }))
        setLoadingIds((prev) => {
          const updated = new Set(prev)
          updated.delete(refreshId)
          return updated
        })
      })
    }
  }, [refreshId, fetchPetsByCustomerId])

  const handleEditCustomer = (customer: Customer) => {
  setSelectedCustomer(customer)
  setFirstName(customer.firstName)
  setLastName(customer.lastName)
  setEmail(customer.email || "")
  setPhone(customer.phone || "")
  setEditModalOpen(true)
}

const handleSaveEdit = async () => {
  if (!selectedCustomer) return
  const token = localStorage.getItem("token")
  try {
    const res = await fetch(`http://localhost:8000/api/v1/customers/${selectedCustomer.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, email, phone }),
    })
    if (!res.ok) throw new Error("Error al editar cliente")
    setEditModalOpen(false)
    refreshCustomers() 
  } catch (error) {
    console.error("Error al editar cliente:", error)
  }
}

const handleDeleteCustomer = async (id: string) => {
  const token = localStorage.getItem("token")
  try {
    const res = await fetch(`http://localhost:8000/api/v1/customers/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) throw new Error("No se pudo eliminar el cliente")
    refreshCustomers()
  } catch (error) {
    console.error("Error al eliminar cliente:", error)
  }
}

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
              <DropdownMenu onOpenChange={(isOpen) => {
  if (isOpen) loadPets(customer.id)
}}>
  <DropdownMenuTrigger asChild>
    <Button
      variant="outline"
      size="sm"
      disabled={loadingIds.has(customer.id)}
    >
      {loadingIds.has(customer.id) ? "Cargando..." : "Ver mascotas"}
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="z-50" side="bottom" align="start">
    <DropdownMenuLabel>Mascotas</DropdownMenuLabel>
    {customerPets[customer.id]?.length ? (
      customerPets[customer.id].map((pet) => (
        <DropdownMenuItem key={pet.id}>
          {pet.name}
        </DropdownMenuItem>
      ))
    ) : (
      <DropdownMenuItem disabled>No tiene mascotas</DropdownMenuItem>
    )}
  </DropdownMenuContent>
</DropdownMenu>
            </TableCell>
            <TableCell>
              <button onClick={() => onCreatePetClick(customer.id)} title="Crear mascota">
                <Plus className="h-5 w-5 text-blue-600" />
              </button>
            
  
    <button onClick={() => handleEditCustomer(customer)} title="Editar cliente">
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
          <AlertDialogAction onClick={() => handleDeleteCustomer(customer.id)}>
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
      <DialogTitle>Editar cliente</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Nombre" className="w-full border px-2 py-1" />
      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Apellido" className="w-full border px-2 py-1" />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border px-2 py-1" />
      <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Teléfono" className="w-full border px-2 py-1" />
      <DialogClose asChild>
        <button onClick={handleSaveEdit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Guardar cambios
        </button>
      </DialogClose>
    </div>
  </DialogContent>
</Dialog>
</>
  )
}
