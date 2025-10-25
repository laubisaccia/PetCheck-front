import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AppointmentsTable } from "@/components/ui/appointments-table";
import { CustomersTable } from "@/components/ui/customers-table";
import { CreateUserForm } from "@/components/ui/create-user-form";
import { CreateDoctorForm } from "@/components/ui/create-doctor-form";
import { DoctorsTable } from "@/components/ui/doctors-table";

import { InfoCardsGroup } from "@/components/info-cards-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { InfoCardsGroupSkeleton } from "@/components/ui/card-skeleton";
import { CalendarView } from "@/components/ui/calendar-view";
import { Calendar, TableIcon, CalendarCheck, TrendingUp, Users, PawPrint } from "lucide-react";

import type { Appointment } from "@/components/ui/appointments-table";

import { getUserFromToken } from "@/utils/auth";
import { CreateCustomerForm } from "@/components/ui/create-customer-form";
import { CreatePetForm } from "@/components/ui/create-pet-form";
import { useTheme } from "next-themes";

import logoLight from "@/assets/pet_check_logo.png";
import logoDark from "@/assets/pet_check_logo_fondo_oscuro.png";

const translateRole = (role: string): string => {
  switch (role) {
    case "admin":
      return "Administrador";
    case "employee":
      return "Empleado";
    default:
      return role;
  }
};

export function Dashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState([]);
  const [showCreateCustomer, setShowCreateCustomer] = useState(false);
  const [showCreatePetModal, setShowCreatePetModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  const [refreshId, setRefreshId] = useState<string | null>(null);
  const [doctors, setDoctors] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");

  const navigate = useNavigate();
  const user = getUserFromToken();
  const { theme } = useTheme();

  const logo = theme === "dark" ? logoDark : logoLight;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  const fetchAppointments = () => {
    const token = localStorage.getItem("token");
    setLoadingAppointments(true);

    fetch("http://localhost:8000/api/v1/appointments/with-names", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAppointments(data);
        } else {
          setAppointments([]);
        }
      })
      .finally(() => setLoadingAppointments(false));
  };

  const fetchCustomers = () => {
    const token = localStorage.getItem("token");
    setLoadingCustomers(true);

    fetch("http://localhost:8000/api/v1/customers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .finally(() => setLoadingCustomers(false));
  };
  const fetchDoctors = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    setLoadingDoctors(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/doctors", {
        headers: {
          Authorization: `Bearer ${token} `,
        },
      });

      if (!res.ok) {
        throw new Error("Error al obtener médicos");
      }

      const data = await res.json();
      setDoctors(data);
    } catch (error) {
      console.error("Error al cargar médicos:", error);
    } finally {
      setLoadingDoctors(false);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchAppointments();
    fetchCustomers();
    fetchDoctors();
  }, [navigate]);

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const futureAppointments = appointments
    .filter((a) => a.date && new Date(a.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const todaysAppointments = futureAppointments.filter((a) =>
    a.date.startsWith(todayStr)
  );
  const handleCustomerCreated = (newCustomer) => {
    setCustomers([...customers, newCustomer]);
    setShowCreateCustomer(false);
  };
  const openCreatePetModal = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setShowCreatePetModal(true);
  };
  const closeCreatePetModal = () => {
    setShowCreatePetModal(false);
    setSelectedCustomerId(null);
  };
  const fetchPetsByCustomerId = async (customerId: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:8000/api/v1/pets/by-customer/${customerId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) {
      console.error("No se pudieron obtener las mascotas del cliente");
      return [];
    }
    return res.json();
  };

  const refreshCustomerPets = (customerId: string) => {
    setRefreshId(customerId);
  };

  // Calcular turnos de esta semana
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + 7);

  const thisWeekAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.date);
    return aptDate >= today && aptDate <= endOfWeek;
  });

  // Contar mascotas únicas
  const uniquePets = new Set(appointments.map((apt) => apt.pet.id)).size;

  const cardsData = [
    {
      title: "Turnos del día",
      value: todaysAppointments.length.toString(),
      description: "Citas programadas para hoy",
      badgeIcon: CalendarCheck,
      badgeText: "Hoy",
    },
    {
      title: "Turnos esta semana",
      value: thisWeekAppointments.length.toString(),
      description: "Próximos 7 días",
      badgeIcon: TrendingUp,
      badgeText: "7 días",
    },
    {
      title: "Total Clientes",
      value: customers.length.toString(),
      description: "Clientes registrados",
      badgeIcon: Users,
      badgeText: "Activos",
    },
    {
      title: "Total Mascotas",
      value: uniquePets.toString(),
      description: "Mascotas en el sistema",
      badgeIcon: PawPrint,
      badgeText: "Únicas",
    },
  ];
  return (
    <div className="p-6">
      {user && (
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-muted-foreground flex flex-col gap-1">
            <Badge variant="outline">{user.email}</Badge>
            <Badge variant="secondary">{translateRole(user.role)}</Badge>
          </div>
          <img src={logo} alt="PetCheck Logo" className="h-15 w-auto ml-4" />
        </div>
      )}
      <div className="flex justify-end gap-2 mb-4">
        <ThemeToggle />
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="appointments">Turnos</TabsTrigger>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
          {user?.role === "admin" && (
            <TabsTrigger value="users">Usuarios</TabsTrigger>
          )}
          {user?.role === "admin" && (
            <TabsTrigger value="doctors">Medicos</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="appointments">
          {loadingAppointments ? (
            <>
              <InfoCardsGroupSkeleton count={4} />
              <h1 className="text-2xl font-semibold mt-8 mb-4">Próximos turnos</h1>
              <TableSkeleton rows={5} columns={5} />
            </>
          ) : (
            <>
              <InfoCardsGroup cards={cardsData} />
              <div className="flex items-center justify-between mt-8 mb-4">
                <h1 className="text-2xl font-semibold">Próximos turnos</h1>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "table" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                  >
                    <TableIcon className="h-4 w-4 mr-2" />
                    Tabla
                  </Button>
                  <Button
                    variant={viewMode === "calendar" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("calendar")}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendario
                  </Button>
                </div>
              </div>

              {viewMode === "table" ? (
                <AppointmentsTable
                  appointments={futureAppointments}
                  refreshAppointments={fetchAppointments}
                />
              ) : (
                <CalendarView
                  events={futureAppointments.map((apt) => {
                    const appointmentDate = new Date(apt.date);
                    const hours = appointmentDate.getHours().toString().padStart(2, '0');
                    const minutes = appointmentDate.getMinutes().toString().padStart(2, '0');

                    return {
                      id: apt.id,
                      date: apt.date,
                      time: `${hours}:${minutes}`,
                      customerName: `${apt.pet.owner.firstName} ${apt.pet.owner.lastName}`,
                      petName: apt.pet.name,
                      doctorName: apt.doctor.name,
                    };
                  })}
                  onEventClick={(event) => {
                    console.log("Evento clickeado:", event);
                  }}
                />
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="customers">
          <h1 className="text-2xl font-semibold mt-8 mb-4">
            Listado de clientes
          </h1>
          <Button className="mb-4" onClick={() => setShowCreateCustomer(true)}>
            Crear cliente
          </Button>
          {showCreateCustomer && (
            <CreateCustomerForm onCreated={handleCustomerCreated} />
          )}
          {loadingCustomers ? (
            <TableSkeleton rows={5} columns={4} />
          ) : (
            <CustomersTable
              customers={customers}
              onCreatePetClick={openCreatePetModal}
              fetchPetsByCustomerId={fetchPetsByCustomerId}
              refreshCustomerPets={refreshCustomerPets}
              refreshId={refreshId}
              refreshCustomers={fetchCustomers}
              refreshAppointments={fetchAppointments}
            />
          )}
          {showCreatePetModal && selectedCustomerId && (
            <CreatePetForm
              customerId={selectedCustomerId}
              onClose={closeCreatePetModal}
              onCreated={() => {
                refreshCustomerPets(selectedCustomerId);
                closeCreatePetModal();
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="users">
          <h1 className="text-2xl font-semibold mt-8 mb-4">Crear usuario</h1>
          <CreateUserForm />
        </TabsContent>
        <TabsContent value="doctors">
          <h1 className="text-2xl font-semibold mt-8 mb-4">Crear médico</h1>
          <CreateDoctorForm onCreated={fetchDoctors} />

          <h2 className="text-xl font-semibold mt-8 mb-4">
            Listado de médicos
          </h2>
          {loadingDoctors ? (
            <TableSkeleton rows={3} columns={2} />
          ) : (
            <DoctorsTable doctors={doctors} refreshDoctors={fetchDoctors} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
