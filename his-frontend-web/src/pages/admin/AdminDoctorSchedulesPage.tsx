import { useState } from 'react'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog'
import {
  EntityFormDialog,
  type EntityFormField,
  type EntityFormValues,
} from '@/components/dialogs/EntityFormDialog'
import { ResourceTablePage, type ResourceColumn } from '@/components/tables/ResourceTablePage'

const columns: readonly ResourceColumn[] = [
  {
    key: 'doctor',
    label: 'Doctor',
    render: () => '-',
  },
  {
    key: 'date',
    label: 'Date',
    render: () => '-',
  },
  {
    key: 'time',
    label: 'Time',
    render: () => '-',
  },
  {
    key: 'status',
    label: 'Status',
    render: () => '-',
  },
]

const scheduleFields: readonly EntityFormField[] = [
  { name: 'doctorId', label: 'Doctor ID', type: 'number' },
  { name: 'date', label: 'Date', type: 'date' },
  { name: 'startTime', label: 'Start Time' },
  { name: 'endTime', label: 'End Time' },
  { name: 'maxPatient', label: 'Max Patients', type: 'number' },
]

const scheduleSchema = z.object({
  doctorId: z.string().min(1, 'Doctor ID is required'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  maxPatient: z.string().min(1, 'Max patients is required'),
})

const defaultScheduleValues: EntityFormValues = {
  doctorId: '',
  date: '',
  startTime: '',
  endTime: '',
  maxPatient: '',
}

export function AdminDoctorSchedulesPage() {
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  function handleUnavailableAction(action: string) {
    toast.info(`${action} API is not available yet`)
  }

  return (
    <>
      <ResourceTablePage
        title="Doctor Schedules"
        description="Quản lý lịch làm việc của bác sĩ."
        columns={columns}
        rows={[]}
        emptyTitle="Chưa có API danh sách schedules cho Admin"
        filterOptions={[
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
        ]}
        onCreate={() => setFormMode('create')}
        onEdit={() => setFormMode('edit')}
        onDelete={() => setIsDeleteOpen(true)}
      />
      <EntityFormDialog
        open={Boolean(formMode)}
        title={formMode === 'edit' ? 'Edit Schedule' : 'Create Schedule'}
        fields={scheduleFields}
        schema={scheduleSchema}
        defaultValues={defaultScheduleValues}
        submitLabel={formMode === 'edit' ? 'Update' : 'Create'}
        onClose={() => setFormMode(null)}
        onSubmit={() => {
          handleUnavailableAction(formMode === 'edit' ? 'Update schedule' : 'Create schedule')
          setFormMode(null)
        }}
      />
      <ConfirmDialog
        open={isDeleteOpen}
        title="Delete Schedule"
        description="Delete this schedule?"
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          setIsDeleteOpen(false)
          handleUnavailableAction('Delete schedule')
        }}
      />
    </>
  )
}
