import { env } from "../env"

type SummaryResponse = {
  completed: number
  total: number
  goalsPerDay: Record<
    string,
    {
      id: string
      title: string
      completedAt: string
    }[]
  >
}

export async function getSummary(): Promise<SummaryResponse> {
  const response = await fetch(`${env.VITE_SERVER_API_URL}/summary`)
  const data = await response.json()

  return data.summary
}