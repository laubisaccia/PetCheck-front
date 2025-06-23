import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { AppointmentsTable } from "@/components/ui/appointments-table"
import { CustomersTable } from "@/components/ui/customers-table"
import { CreateUserForm } from "@/components/ui/create-user-form"

import { InfoCardsGroup } from "@/components/info-cards-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import type{ Appointment } from "@/components/ui/appointments-table"

import { getUserFromToken } from "@/utils/auth"
import { CreateCustomerForm } from "@/components/ui/create-customer-form"
import { CreatePetForm } from "@/components/ui/create-pet-form"

const translateRole = (role: string): string => {
  switch (role) {
    case "admin":
      return "Administrador"
    case "employee":
      return "Empleado"
    default:
      return role
  }
}

export function Dashboard() {

    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [customers, setCustomers] = useState([])
    const [showCreateCustomer, setShowCreateCustomer] = useState(false)
    const [showCreatePetModal, setShowCreatePetModal] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
    const [refreshId, setRefreshId] = useState<string | null>(null)


const navigate = useNavigate()
const user = getUserFromToken()

const handleLogout = () => {
  localStorage.removeItem("token")
  navigate("/")
}
    const fetchAppointments = () => {
    const token = localStorage.getItem("token")

    fetch("http://localhost:8000/api/v1/appointments/with-names", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAppointments(data)
        } else {
          setAppointments([])
        }
      })
      }

    const fetchCustomers = () => {
      const token = localStorage.getItem("token")

      fetch("http://localhost:8000/api/v1/customers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      })
        .then((res) => res.json())
        .then((data) => setCustomers(data))
    }

    useEffect(() => {
      const token = localStorage.getItem("token")
  if (!token) {
    navigate("/")
    return
  }
    fetchAppointments()
    fetchCustomers()
    }, [navigate])

 
  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]

 const futureAppointments = appointments
  .filter((a) => a.date && new Date(a.date) >= today)
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const todaysAppointments = futureAppointments.filter((a) =>
  a.date.startsWith(todayStr)
)
const handleCustomerCreated = (newCustomer) => {
  setCustomers([...customers, newCustomer])
  setShowCreateCustomer(false)
}
const openCreatePetModal = (customerId: string) => {
  setSelectedCustomerId(customerId);
  setShowCreatePetModal(true);
}
const closeCreatePetModal = () => {
  setShowCreatePetModal(false);
  setSelectedCustomerId(null);
}
const fetchPetsByCustomerId = async (customerId: string) => {
  const token = localStorage.getItem("token")
  const res = await fetch(`http://localhost:8000/api/v1/pets/by-customer/${customerId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    console.error("No se pudieron obtener las mascotas del cliente")
    return []
  }
  return res.json()
}

const refreshCustomerPets = (customerId: string) => {
  setRefreshId(customerId) 
}
 const cardsData = [
    {
      title: "Turnos del día",
      value: todaysAppointments.length.toString(),
     
    },
    {
      title: "Turnos a futuro",
      value: futureAppointments.length.toString(),
      
    },
    
  ]
  return (
  
     <div className="p-6">
     {user && (
  <div className="text-sm text-muted-foreground flex flex-col gap-1">
      <Badge variant="outline">{user.email}</Badge>
<Badge variant="secondary">{translateRole(user.role)}</Badge>  </div>
)}
      <div className="flex justify-end mb-4">
  <Button variant="outline" onClick={handleLogout}>
    Logout
  </Button>
</div>
      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="appointments">Turnos</TabsTrigger>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
          {user?.role === "admin" && <TabsTrigger value="users">Usuarios</TabsTrigger>}
        </TabsList>

        <TabsContent value="appointments">
          <InfoCardsGroup cards={cardsData} />
          <h1 className="text-2xl font-semibold mt-8 mb-4">Próximos turnos</h1>
          
          <AppointmentsTable appointments={futureAppointments} 
          refreshAppointments={fetchAppointments}/>
        </TabsContent>

        <TabsContent value="customers">
         
          <h1 className="text-2xl font-semibold mt-8 mb-4">Listado de clientes</h1>
          <Button className="mb-4" onClick={() => setShowCreateCustomer(true)}>
  Crear cliente
</Button>
{showCreateCustomer && <CreateCustomerForm onCreated={handleCustomerCreated} />}
          <CustomersTable customers={customers} 
            onCreatePetClick={openCreatePetModal}
            fetchPetsByCustomerId={fetchPetsByCustomerId}
             refreshCustomerPets={refreshCustomerPets}
             refreshId={refreshId}
             refreshCustomers={fetchCustomers}
             refreshAppointments={fetchAppointments}
          />
          {showCreatePetModal && selectedCustomerId && (
    <CreatePetForm
      customerId={selectedCustomerId}
      onClose={closeCreatePetModal}
      onCreated={() => {
        refreshCustomerPets(selectedCustomerId)
        closeCreatePetModal();
      }}
    />
  )}
        </TabsContent>
       
  <TabsContent value="users">
    <h1 className="text-2xl font-semibold mt-8 mb-4">Crear usuario</h1>
    <CreateUserForm />
  </TabsContent>

      </Tabs>
    </div>
  )
}