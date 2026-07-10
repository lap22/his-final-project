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
    key: 'setting',
    label: 'Setting',
    render: () => '-',
  },
  {
    key: 'value',
    label: 'Value',
    render: () => '-',
  },
  {
    key: 'status',
    label: 'Status',
    render: () => '-',
  },
]

const settingFields: readonly EntityFormField[] = [
  { name: 'setting', label: 'Setting' },
  { name: 'value', label: 'Value' },
  {
    name: 'status',
    label: 'Status',
    options: [
      { label: 'Enabled', value: 'enabled' },
      { label: 'Disabled', value: 'disabled' },
    ],
  },
]

const settingSchema = z.object({
  setting: z.string().min(1, 'Setting is required'),
  value: z.string().min(1, 'Value is required'),
  status: z.string().min(1, 'Status is required'),
})

const defaultSettingValues: EntityFormValues = {
  setting: '',
  value: '',
  status: 'enabled',
}

export function AdminSettingsPage() {
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  function handleUnavailableAction(action: string) {
    toast.info(`${action} API is not available yet`)
  }

  return (
    <>
      <ResourceTablePage
        title="Settings"
        description="Thiết lập hệ thống."
        columns={columns}
        rows={[]}
        emptyTitle="Chưa có API settings"
        filterOptions={[
          { label: 'Enabled', value: 'enabled' },
          { label: 'Disabled', value: 'disabled' },
        ]}
        onCreate={() => setFormMode('create')}
        onEdit={() => setFormMode('edit')}
        onDelete={() => setIsDeleteOpen(true)}
      />
      <EntityFormDialog
        open={Boolean(formMode)}
        title={formMode === 'edit' ? 'Edit Setting' : 'Create Setting'}
        fields={settingFields}
        schema={settingSchema}
        defaultValues={defaultSettingValues}
        submitLabel={formMode === 'edit' ? 'Update' : 'Create'}
        onClose={() => setFormMode(null)}
        onSubmit={() => {
          handleUnavailableAction(formMode === 'edit' ? 'Update setting' : 'Create setting')
          setFormMode(null)
        }}
      />
      <ConfirmDialog
        open={isDeleteOpen}
        title="Delete Setting"
        description="Delete this setting?"
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          setIsDeleteOpen(false)
          handleUnavailableAction('Delete setting')
        }}
      />
    </>
  )
}
