import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

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
}

export function CustomersTable({ customers, onCreatePetClick, fetchPetsByCustomerId,refreshId }: Props) {
  const [customerPets, setCustomerPets] = useState<Record<string, Pet[]>>({})
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set())

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

  return (
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      
    </Table>
  )
}
