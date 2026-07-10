import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { getDepartments } from '@/api/department.api'
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog'
import {
  EntityFormDialog,
  type EntityFormField,
  type EntityFormValues,
} from '@/components/dialogs/EntityFormDialog'
import { ResourceTablePage, type ResourceColumn } from '@/components/tables/ResourceTablePage'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { getStringValue, type UnknownRecord } from '@/utils/record'

const columns: readonly ResourceColumn[] = [
  {
    key: 'name',
    label: 'Department',
    render: (row) => getStringValue(row, ['name', 'specialtyName', 'specialization']),
  },
  {
    key: 'doctorCount',
    label: 'Doctor Count',
    render: (row) => getStringValue(row, ['doctorCount', 'count']),
  },
  {
    key: 'description',
    label: 'Description',
    render: (row) => getStringValue(row, ['description']),
  },
]

const departmentFields: readonly EntityFormField[] = [
  { name: 'name', label: 'Department' },
  { name: 'description', label: 'Description' },
]

const departmentSchema = z.object({
  name: z.string().min(1, 'Department is required'),
  description: z.string(),
})

export function AdminDepartmentsPage() {
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<UnknownRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<UnknownRecord | null>(null)
  const departmentsQuery = useQuery({
    queryKey: QUERY_KEYS.ADMIN_DEPARTMENTS,
    queryFn: getDepartments,
  })

  function handleUnavailableAction(action: string) {
    toast.info(`${action} API is not available yet`)
  }

  const defaultValues: EntityFormValues = {
    name: getStringValue(selectedDepartment ?? {}, ['name', 'specialtyName', 'specialization'], ''),
    description: getStringValue(selectedDepartment ?? {}, ['description'], ''),
  }

  return (
    <>
      <ResourceTablePage
        title="Departments"
        description="Danh sách chuyên khoa/phòng ban từ hệ thống."
        columns={columns}
        rows={departmentsQuery.data ?? []}
        isLoading={departmentsQuery.isLoading}
        isError={departmentsQuery.isError}
        emptyTitle="Chưa có departments"
        filterOptions={[]}
        onRetry={() => void departmentsQuery.refetch()}
        onCreate={() => setFormMode('create')}
        onEdit={(row) => {
          setSelectedDepartment(row)
          setFormMode('edit')
        }}
        onDelete={(row) => setDeleteTarget(row)}
      />
      <EntityFormDialog
        open={Boolean(formMode)}
        title={formMode === 'edit' ? 'Edit Department' : 'Create Department'}
        fields={departmentFields}
        schema={departmentSchema}
        defaultValues={defaultValues}
        submitLabel={formMode === 'edit' ? 'Update' : 'Create'}
        onClose={() => {
          setFormMode(null)
          setSelectedDepartment(null)
        }}
        onSubmit={() => {
          handleUnavailableAction(formMode === 'edit' ? 'Update department' : 'Create department')
          setFormMode(null)
          setSelectedDepartment(null)
        }}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Department"
        description="Delete this department?"
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          setDeleteTarget(null)
          handleUnavailableAction('Delete department')
        }}
      />
    </>
  )
}
