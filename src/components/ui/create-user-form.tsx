import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function CreateUserForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");

  const handleCreateUser = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, password, role }),
    });

    if (!res.ok) {
      const data = await res.json();
      toast.error("Error al crear usuario", {
        description: data.detail,
      });
      return;
    }

    toast.success("Usuario creado correctamente", {
      description: `${email} (${role})`,
    });

    setEmail("");
    setPassword("");
    setRole("employee");
  };

  return (
    <Card className="max-w-md mt-8">
      <CardHeader>
        <CardTitle>Crear nuevo usuario</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label>Contraseña</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <Label>Rol</Label>
          <select
            className="border rounded p-2 w-full"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="employee">Empleado</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <Button onClick={handleCreateUser}>Crear usuario</Button>
      </CardContent>
    </Card>
  );
}
