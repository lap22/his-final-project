import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { getAdminAppointments, updateAppointmentStatus } from '@/api/appointment.api'
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
    key: 'patient',
    label: 'Patient',
    render: (row) =>
      getStringValue(getNestedRecord(row, ['patient']) ?? row, ['patientName', 'name', 'email']),
  },
  {
    key: 'doctor',
    label: 'Doctor',
    render: (row) =>
      getStringValue(getNestedRecord(row, ['doctor']) ?? row, ['doctorName', 'name']),
  },
  {
    key: 'date',
    label: 'Date',
    render: (row) => getStringValue(row, ['appointmentDate', 'date', 'time', 'createdAt']),
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => getStringValue(row, ['status']),
  },
]

const appointmentFields: readonly EntityFormField[] = [
  {
    name: 'status',
    label: 'Status',
    options: [
      { label: 'Pending', value: 'PENDING' },
      { label: 'Confirmed', value: 'CONFIRMED' },
      { label: 'Cancelled', value: 'CANCELLED' },
      { label: 'Completed', value: 'COMPLETED' },
    ],
  },
]

const appointmentSchema = z.object({
  status: z.string().min(1, 'Status is required'),
})

export function AdminAppointmentsPage() {
  const queryClient = useQueryClient()
  const [editTarget, setEditTarget] = useState<UnknownRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<UnknownRecord | null>(null)
  const appointmentsQuery = useQuery({
    queryKey: QUERY_KEYS.ADMIN_APPOINTMENTS,
    queryFn: getAdminAppointments,
  })
  const updateStatusMutation = useMutation({
    mutationFn: (values: EntityFormValues) =>
      updateAppointmentStatus(getStringValue(editTarget ?? {}, ['id']), values.status),
    onSuccess() {
      toast.success('Appointment updated successfully')
      setEditTarget(null)
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_APPOINTMENTS })
    },
    onError() {
      toast.error('Cannot update appointment')
    },
  })

  function handleUnavailableAction(action: string) {
    toast.info(`${action} API is not available yet`)
  }

  return (
    <>
      <ResourceTablePage
        title="Appointments"
        description="Danh sách lịch hẹn toàn hệ thống."
        columns={columns}
        rows={appointmentsQuery.data ?? []}
        isLoading={appointmentsQuery.isLoading}
        isError={appointmentsQuery.isError}
        emptyTitle="Chưa có lịch hẹn"
        filterLabel="Status"
        filterOptions={[
          { label: 'Pending', value: 'PENDING' },
          { label: 'Confirmed', value: 'CONFIRMED' },
          { label: 'Cancelled', value: 'CANCELLED' },
          { label: 'Completed', value: 'COMPLETED' },
        ]}
        getFilterValue={(row) => getStringValue(row, ['status'], '')}
        onRetry={() => void appointmentsQuery.refetch()}
        onCreate={() => handleUnavailableAction('Create appointment')}
        onEdit={(row) => setEditTarget(row)}
        onDelete={(row) => setDeleteTarget(row)}
      />
      <EntityFormDialog
        open={Boolean(editTarget)}
        title="Update Appointment"
        fields={appointmentFields}
        schema={appointmentSchema}
        defaultValues={{
          status: getStringValue(editTarget ?? {}, ['status'], 'PENDING'),
        }}
        submitLabel="Update"
        isLoading={updateStatusMutation.isPending}
        onClose={() => setEditTarget(null)}
        onSubmit={(values) => updateStatusMutation.mutate(values)}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Appointment"
        description="Delete this appointment?"
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          setDeleteTarget(null)
          handleUnavailableAction('Delete appointment')
        }}
      />
    </>
  )
}
