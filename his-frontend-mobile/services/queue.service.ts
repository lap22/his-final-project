export interface QueueItem {
  id: number;
  queueNumber?: string;
  status?: string;
  estimatedTime?: string;
}

export async function getQueueByProfile(_profileId: number): Promise<QueueItem[]> {
  // TODO: Backend chua co endpoint queue theo patient profile.
  // Giu UI khong crash va tra ve empty state cho den khi API duoc bo sung.
  return [];
}
