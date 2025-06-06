import { useEffect, useState } from "react"
import { AppointmentsTable } from "@/components/ui/appointments-table"
import { InfoCardsGroup } from "@/components/info-cards-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export function Dashboard() {
     const [appointments, setAppointments] = useState([])

     useEffect(() => {
    fetch("http://localhost:8000/api/v1/appointments/with-names")
      .then((res) => res.json())
      .then((data) => setAppointments(data))
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
      //description: "Total para hoy",
      // badgeText: "+3%", 
      // badgeIcon: CalendarCheck,
      // footerText: "Respecto al promedio diario",
      // footerIcon: TrendingUp,
    },
    {
      title: "Turnos a futuro",
      value: futureAppointments.length.toString(),
      //description: "Upcoming scheduled",
      // badgeText: "+5%",
      // badgeIcon: CalendarCheck,
      // footerText: "Compared to last week",
      // footerIcon: TrendingUp,
    },
    // {
    //   title: "Registered Pets",
    //   value: "24",
    //   description: "Total active pets",
    //   badgeText: "+3%",
    //   badgeIcon: User,
    //   footerText: "Compared to last month",
    //   footerIcon: TrendingUp,
    // },
    // {
    //   title: "Other Metric",
    //   value: "42",
    //   description: "Description here",
    //   badgeText: "-2%",
    //   badgeIcon: TrendingUp,
    //   footerText: "Compared to last quarter",
    //   footerIcon: TrendingUp,
    // },
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
          <AppointmentsTable appointments={futureAppointments} />
        </TabsContent>

        <TabsContent value="pets">
         
          <h1 className="text-2xl font-semibold mt-8 mb-4">Listado de mascotas</h1>
          
          <p>Aquí podés listar las mascotas o agregar un componente de tabla.</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}