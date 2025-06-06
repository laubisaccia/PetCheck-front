import { useEffect, useState } from "react"
import { AppointmentsTable } from "@/components/ui/appointments-table"
import { InfoCardsGroup } from "@/components/info-cards-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export function Dashboard() {
     const [appointments, setAppointments] = useState([])
     

    const fetchAppointments = () => {
      fetch("http://localhost:8000/api/v1/appointments/with-names")
        .then((res) => res.json())
        .then((data) => setAppointments(data))
    }

    useEffect(() => {
    fetchAppointments()
    }, [])

 
  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]

 const futureAppointments = appointments
  .filter((a) => new Date(a.date) >= today)
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

const todaysAppointments = futureAppointments.filter((a) =>
  a.date.startsWith(todayStr)
)
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
      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="appointments">Turnos</TabsTrigger>
          <TabsTrigger value="pets">Mascotas</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments">
          <InfoCardsGroup cards={cardsData} />
          <h1 className="text-2xl font-semibold mt-8 mb-4">Próximos turnos</h1>
          <AppointmentsTable appointments={futureAppointments} refreshAppointments={fetchAppointments}/>
        </TabsContent>

        <TabsContent value="pets">
         
          <h1 className="text-2xl font-semibold mt-8 mb-4">Listado de mascotas</h1>
          
          <p>Aquí podés listar las mascotas o agregar un componente de tabla.</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}