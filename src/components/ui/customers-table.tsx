import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Customer = {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
}

type Props = {
  customers: Customer[]
}

export function CustomersTable({ customers }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Apellido</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Teléfono</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((c) => (
          <TableRow key={c.id}>
            <TableCell>{c.firstName}</TableCell>
            <TableCell>{c.lastName}</TableCell>
            <TableCell>{c.email || "-"}</TableCell>
            <TableCell>{c.phone || "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
