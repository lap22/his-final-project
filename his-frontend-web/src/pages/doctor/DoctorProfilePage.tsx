import { Box } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { getDoctorProfile } from '@/api/doctor.api'
import { getCurrentUserProfile } from '@/api/user.api'
import { DetailsCard } from '@/components/cards/DetailsCard'
import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/empty/EmptyState'
import { LoadingState } from '@/components/loading/LoadingState'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { getStringValue } from '@/utils/record'

export function DoctorProfilePage() {
  const doctorProfileQuery = useQuery({
    queryKey: QUERY_KEYS.DOCTOR_PROFILE,
    queryFn: getDoctorProfile,
  })
  const userProfileQuery = useQuery({
    queryKey: QUERY_KEYS.DOCTOR_USER_PROFILE,
    queryFn: getCurrentUserProfile,
  })

  const isLoading = doctorProfileQuery.isLoading || userProfileQuery.isLoading
  const isError = doctorProfileQuery.isError || userProfileQuery.isError

  if (isLoading) {
    return <LoadingState />
  }

  if (isError) {
    return (
      <ErrorState
        onRetry={() => {
          void doctorProfileQuery.refetch()
          void userProfileQuery.refetch()
        }}
      />
    )
  }

  if (!doctorProfileQuery.data && !userProfileQuery.data) {
    return <EmptyState title="Chưa có hồ sơ" />
  }

  return (
    <>
      <PageHeader title="Profile" description="Thông tin tài khoản và hồ sơ bác sĩ." />
      <Box
        sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}
      >
        {userProfileQuery.data && (
          <DetailsCard
            title="Tài khoản"
            items={[
              { label: 'Email', value: getStringValue(userProfileQuery.data, ['email']) },
              { label: 'Tên', value: getStringValue(userProfileQuery.data, ['name', 'fullName']) },
              { label: 'Số điện thoại', value: getStringValue(userProfileQuery.data, ['phone']) },
              {
                label: 'Vai trò',
                value: getStringValue(userProfileQuery.data, ['role', 'roleId']),
              },
            ]}
          />
        )}
        {doctorProfileQuery.data && (
          <DetailsCard
            title="Hồ sơ bác sĩ"
            items={[
              {
                label: 'Chuyên khoa',
                value: getStringValue(doctorProfileQuery.data, ['specialty', 'specialization']),
              },
              {
                label: 'Kinh nghiệm',
                value: getStringValue(doctorProfileQuery.data, ['experience', 'yearsOfExperience']),
              },
              { label: 'Trạng thái', value: getStringValue(doctorProfileQuery.data, ['status']) },
              {
                label: 'Mô tả',
                value: getStringValue(doctorProfileQuery.data, ['bio', 'description']),
              },
            ]}
          />
        )}
      </Box>
    </>
  )
}
