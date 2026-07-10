import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { getDoctors } from '@/api/doctor.api'
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog'
import {
  EntityFormDialog,
  type EntityFormField,
  type EntityFormValues,
} from '@/components/dialogs/EntityFormDialog'
import { ResourceTablePage, type ResourceColumn } from '@/components/tables/ResourceTablePage'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { getNestedRecord, getStringValue, type UnknownRecord } from '@/utils/record'

const columns: readonly ResourceColumn[] = [
  {
    key: 'name',
    label: 'Name',
    render: (row) =>
      getStringValue(getNestedRecord(row, ['user']) ?? row, ['fullName', 'name', 'email']),
  },
  {
    key: 'specialization',
    label: 'Specialization',
    render: (row) => getStringValue(row, ['specialization', 'specialty']),
  },
  {
    key: 'qualification',
    label: 'Qualification',
    render: (row) => getStringValue(row, ['qualification']),
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => getStringValue(row, ['status']),
  },
]

const doctorFields: readonly EntityFormField[] = [
  { name: 'name', label: 'Name' },
  { name: 'specialization', label: 'Specialization' },
  { name: 'qualification', label: 'Qualification' },
  { name: 'status', label: 'Status' },
]

const doctorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  specialization: z.string().min(1, 'Specialization is required'),
  qualification: z.string().min(1, 'Qualification is required'),
  status: z.string().min(1, 'Status is required'),
})

export function AdminDoctorsPage() {
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null)
  const [selectedDoctor, setSelectedDoctor] = useState<UnknownRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<UnknownRecord | null>(null)
  const doctorsQuery = useQuery({ queryKey: QUERY_KEYS.ADMIN_DOCTORS, queryFn: getDoctors })

  function handleUnavailableAction(action: string) {
    toast.info(`${action} API is not available yet`)
  }

  const defaultValues: EntityFormValues = {
    name: selectedDoctor
      ? getStringValue(getNestedRecord(selectedDoctor, ['user']) ?? selectedDoctor, [
          'fullName',
          'name',
          'email',
        ])
      : '',
    specialization: getStringValue(selectedDoctor ?? {}, ['specialization', 'specialty'], ''),
    qualification: getStringValue(selectedDoctor ?? {}, ['qualification'], ''),
    status: getStringValue(selectedDoctor ?? {}, ['status'], ''),
  }

  return (
    <>
      <ResourceTablePage
        title="Doctors"
        description="Danh sách bác sĩ trong hệ thống."
        columns={columns}
        rows={doctorsQuery.data ?? []}
        isLoading={doctorsQuery.isLoading}
        isError={doctorsQuery.isError}
        emptyTitle="Chưa có bác sĩ"
        filterLabel="Specialization"
        filterOptions={[]}
        onRetry={() => void doctorsQuery.refetch()}
        onCreate={() => setFormMode('create')}
        onEdit={(row) => {
          setSelectedDoctor(row)
          setFormMode('edit')
        }}
        onDelete={(row) => setDeleteTarget(row)}
      />
      <EntityFormDialog
        open={Boolean(formMode)}
        title={formMode === 'edit' ? 'Edit Doctor' : 'Create Doctor'}
        fields={doctorFields}
        schema={doctorSchema}
        defaultValues={defaultValues}
        submitLabel={formMode === 'edit' ? 'Update' : 'Create'}
        onClose={() => {
          setFormMode(null)
          setSelectedDoctor(null)
        }}
        onSubmit={() => {
          handleUnavailableAction(formMode === 'edit' ? 'Update doctor' : 'Create doctor')
          setFormMode(null)
          setSelectedDoctor(null)
        }}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Doctor"
        description="Delete this doctor?"
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          setDeleteTarget(null)
          handleUnavailableAction('Delete doctor')
        }}
      />
    </>
  )
}
