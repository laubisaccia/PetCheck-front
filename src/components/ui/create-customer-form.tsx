import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
};

type CreateCustomerFormParams = {
  onCreated: (newCustomer: Customer) => void;
};

export function CreateCustomerForm({ onCreated }: CreateCustomerFormParams) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    const phoneNumber = Number(form.phone);
    if (
      isNaN(phoneNumber) ||
      phoneNumber < 1000000 ||
      phoneNumber > 9999999999
    ) {
      toast.error("El teléfono debe ser un número entre 7 y 10 caracteres");
      return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/api/v1/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        phone: phoneNumber,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error("Error al crear cliente", {
        description: data.detail,
      });
      return;
    }

    const data = await res.json();
    toast.success("Cliente creado correctamente");
    onCreated(data);
  };

  return (
    <div className="border p-4 mb-4 rounded space-y-2">
      <Input
        name="firstName"
        placeholder="Nombre"
        value={form.firstName}
        onChange={handleChange}
      />
      <Input
        name="lastName"
        placeholder="Apellido"
        value={form.lastName}
        onChange={handleChange}
      />
      <Input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <Input
        name="phone"
        type="tel"
        placeholder="Teléfono"
        value={form.phone}
        onChange={handleChange}
      />
      <Button onClick={handleSubmit}>Guardar cliente</Button>
    </div>
  );
}
