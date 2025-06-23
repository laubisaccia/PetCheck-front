import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { useState } from "react"

type CreatePetFormProps = {
  customerId: string
  onClose: () => void
  onCreated: (newPet: any) => void
}

export function CreatePetForm({ customerId, onClose, onCreated }: CreatePetFormProps) {
  const [name, setName] = useState("")
  const [animal, setAnimal] = useState("")
  const [breed, setBreed] = useState("")
  const [age, setAge] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem("token")
    const res = await fetch(`http://localhost:8000/api/v1/pets`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        animal,
        breed,
        age: Number(age),
        customer_id: customerId,
      }),
    })

    if (res.ok) {
      const newPet = await res.json()
      onCreated(newPet)
      onClose()
    } else {
      alert("Error al crear mascota")
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Crear nueva mascota</DialogTitle>
          <DialogClose asChild>
            <button className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">X</button>
          </DialogClose>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Nombre</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label>Animal</label>
            <input
              required
              value={animal}
              onChange={(e) => setAnimal(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label>Raza</label>
            <input
              required
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label>Edad</label>
            <input
              required
              type="number"
              min={0}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Crear mascota
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
