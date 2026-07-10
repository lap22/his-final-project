import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { useMemo, useState } from 'react'
import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/empty/EmptyState'
import { LoadingState } from '@/components/loading/LoadingState'
import { getStringValue, type UnknownRecord } from '@/utils/record'

export interface ResourceColumn {
  key: string
  label: string
  render: (row: UnknownRecord) => string
}

export interface ResourceFilterOption {
  label: string
  value: string
}

interface ResourceTablePageProps {
  title: string
  description: string
  columns: readonly ResourceColumn[]
  rows: readonly UnknownRecord[]
  isLoading?: boolean
  isError?: boolean
  emptyTitle?: string
  filterLabel?: string
  filterOptions?: readonly ResourceFilterOption[]
  getFilterValue?: (row: UnknownRecord) => string
  onRetry?: () => void
  onCreate?: () => void
  onEdit?: (row: UnknownRecord) => void
  onDelete?: (row: UnknownRecord) => void
}

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25]

function matchesSearch(row: UnknownRecord, searchTerm: string): boolean {
  return JSON.stringify(row).toLowerCase().includes(searchTerm.toLowerCase())
}

export function ResourceTablePage({
  title,
  description,
  columns,
  rows,
  isLoading = false,
  isError = false,
  emptyTitle,
  filterLabel = 'Filter',
  filterOptions = [],
  getFilterValue,
  onRetry,
  onCreate,
  onEdit,
  onDelete,
}: ResourceTablePageProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const isSearchMatched = searchTerm ? matchesSearch(row, searchTerm) : true
      const isFilterMatched =
        filterValue && getFilterValue ? getFilterValue(row) === filterValue : true

      return isSearchMatched && isFilterMatched
    })
  }, [filterValue, getFilterValue, rows, searchTerm])

  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <>
      <PageHeader title={title} description={description} />
      <Paper variant="outlined" sx={{ p: 2.5, mb: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: onCreate ? '1fr 260px auto' : '1fr 260px' },
            gap: 2,
            alignItems: 'center',
          }}
        >
          <TextField
            label="Search"
            value={searchTerm}
            onChange={(event) => {
              setPage(0)
              setSearchTerm(event.target.value)
            }}
            fullWidth
          />
          <TextField
            select
            label={filterLabel}
            value={filterValue}
            onChange={(event) => {
              setPage(0)
              setFilterValue(event.target.value)
            }}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            {filterOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          {onCreate && (
            <Button startIcon={<AddIcon />} variant="contained" onClick={onCreate}>
              Create
            </Button>
          )}
        </Box>
      </Paper>

      {isLoading && <LoadingState />}
      {isError && <ErrorState onRetry={onRetry} />}
      {!isLoading && !isError && rows.length === 0 && <EmptyState title={emptyTitle} />}
      {!isLoading && !isError && rows.length > 0 && filteredRows.length === 0 && (
        <EmptyState title="Không tìm thấy dữ liệu phù hợp" />
      )}
      {!isLoading && !isError && filteredRows.length > 0 && (
        <Paper variant="outlined">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.key} sx={{ fontWeight: 700 }}>
                      {column.label}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && <TableCell align="right">Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRows.map((row, index) => (
                  <TableRow key={getStringValue(row, ['id'], `${page}-${index}`)} hover>
                    {columns.map((column) => (
                      <TableCell key={column.key}>{column.render(row)}</TableCell>
                    ))}
                    {(onEdit || onDelete) && (
                      <TableCell align="right">
                        {onEdit && (
                          <Tooltip title="Edit">
                            <IconButton aria-label="Edit" onClick={() => onEdit(row)}>
                              <EditOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {onDelete && (
                          <Tooltip title="Delete">
                            <IconButton
                              aria-label="Delete"
                              color="error"
                              onClick={() => onDelete(row)}
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredRows.length}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            onPageChange={(_, nextPage) => setPage(nextPage)}
            onRowsPerPageChange={(event) => {
              setPage(0)
              setRowsPerPage(Number(event.target.value))
            }}
          />
        </Paper>
      )}
    </>
  )
}
