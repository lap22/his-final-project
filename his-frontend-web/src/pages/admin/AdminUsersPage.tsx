import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { registerUserApi } from '@/api/auth.api'
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog'
import {
  EntityFormDialog,
  type EntityFormField,
  type EntityFormValues,
} from '@/components/dialogs/EntityFormDialog'
import { ResourceTablePage, type ResourceColumn } from '@/components/tables/ResourceTablePage'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { ROLE_IDS } from '@/constants/roles'
import { getStringValue, type UnknownRecord } from '@/utils/record'

const columns: readonly ResourceColumn[] = [
  {
    key: 'name',
    label: 'Name',
    render: () => '-',
  },
  {
    key: 'email',
    label: 'Email',
    render: () => '-',
  },
  {
    key: 'role',
    label: 'Role',
    render: () => '-',
  },
  {
    key: 'status',
    label: 'Status',
    render: () => '-',
  },
]

const userFields: readonly EntityFormField[] = [
  { name: 'name', label: 'Name' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Phone' },
  { name: 'password', label: 'Password', type: 'password' },
  {
    name: 'roleId',
    label: 'Role',
    options: [
      { label: 'Admin', value: String(ROLE_IDS.ADMIN) },
      { label: 'Doctor', value: String(ROLE_IDS.DOCTOR) },
      { label: 'Patient', value: String(ROLE_IDS.PATIENT) },
    ],
  },
]

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Email is invalid'),
  phone: z.string().min(9, 'Phone is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  roleId: z.string().min(1, 'Role is required'),
})

const defaultUserValues: EntityFormValues = {
  name: '',
  email: '',
  phone: '',
  password: '',
  roleId: String(ROLE_IDS.PATIENT),
}

export function AdminUsersPage() {
  const queryClient = useQueryClient()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<UnknownRecord | null>(null)
  const createUserMutation = useMutation({
    mutationFn: registerUserApi,
    onSuccess() {
      toast.success('User created successfully')
      setIsCreateOpen(false)
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_USERS })
    },
    onError() {
      toast.error('Cannot create user')
    },
  })

  function handleUnavailableAction(action: string) {
    toast.info(`${action} API is not available yet`)
  }

  return (
    <>
      <ResourceTablePage
        title="Users"
        description="Quản lý người dùng hệ thống."
        columns={columns}
        rows={[]}
        emptyTitle="Chưa có API danh sách users cho Admin"
        filterLabel="Role"
        filterOptions={[
          { label: 'Admin', value: 'ADMIN' },
          { label: 'Doctor', value: 'DOCTOR' },
          { label: 'Patient', value: 'PATIENT' },
        ]}
        onCreate={() => setIsCreateOpen(true)}
        onEdit={() => handleUnavailableAction('Update user')}
        onDelete={(row) => setDeleteTarget(row)}
      />
      <EntityFormDialog
        open={isCreateOpen}
        title="Create User"
        fields={userFields}
        schema={userSchema}
        defaultValues={defaultUserValues}
        isLoading={createUserMutation.isPending}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={(values) =>
          createUserMutation.mutate({
            name: values.name,
            email: values.email,
            phone: values.phone,
            password: values.password,
            roleId: Number(values.roleId),
          })
        }
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete User"
        description={`Delete ${getStringValue(deleteTarget ?? {}, ['name', 'email'], 'this user')}?`}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          setDeleteTarget(null)
          handleUnavailableAction('Delete user')
        }}
      />
    </>
  )
}
