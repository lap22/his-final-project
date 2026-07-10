import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { type UnknownRecord } from '@/utils/record'

export interface SimpleDataColumn {
  key: string
  label: string
  render: (row: UnknownRecord) => string
}

interface SimpleDataTableProps {
  columns: readonly SimpleDataColumn[]
  rows: readonly UnknownRecord[]
  getRowId: (row: UnknownRecord, index: number) => string
}

export function SimpleDataTable({ columns, rows, getRowId }: SimpleDataTableProps) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.key} sx={{ fontWeight: 700 }}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={getRowId(row, index)} hover>
              {columns.map((column) => (
                <TableCell key={column.key}>{column.render(row)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
