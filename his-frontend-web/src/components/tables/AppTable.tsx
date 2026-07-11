import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material'
import { type ReactNode } from 'react'
import { EmptyState } from '@/components/empty/EmptyState'
import { LoadingState } from '@/components/loading/LoadingState'

export interface AppTableColumn<TRecord> {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
  render: (row: TRecord, index: number) => ReactNode
}

interface AppTableProps<TRecord> {
  columns: readonly AppTableColumn<TRecord>[]
  rows: readonly TRecord[]
  getRowId: (row: TRecord, index: number) => string
  isLoading?: boolean
  emptyTitle?: string
  page?: number
  rowsPerPage?: number
  totalRows?: number
  rowsPerPageOptions?: readonly number[]
  onPageChange?: (page: number) => void
  onRowsPerPageChange?: (rowsPerPage: number) => void
}

export function AppTable<TRecord>({
  columns,
  rows,
  getRowId,
  isLoading = false,
  emptyTitle,
  page,
  rowsPerPage,
  totalRows,
  rowsPerPageOptions = [5, 10, 25],
  onPageChange,
  onRowsPerPageChange,
}: AppTableProps<TRecord>) {
  if (isLoading) {
    return <LoadingState />
  }

  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} />
  }

  const hasPagination =
    page !== undefined &&
    rowsPerPage !== undefined &&
    totalRows !== undefined &&
    onPageChange &&
    onRowsPerPageChange

  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key} align={column.align} sx={{ fontWeight: 700 }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={getRowId(row, index)} hover>
                {columns.map((column) => (
                  <TableCell key={column.key} align={column.align}>
                    {column.render(row, index)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {hasPagination && (
        <TablePagination
          component="div"
          count={totalRows}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[...rowsPerPageOptions]}
          onPageChange={(_, nextPage) => onPageChange(nextPage)}
          onRowsPerPageChange={(event) => onRowsPerPageChange(Number(event.target.value))}
        />
      )}
    </Paper>
  )
}
