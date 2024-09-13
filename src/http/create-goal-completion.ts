import { env } from '../env'

export async function createGoalCompletion(goalId: string) {
  const response = await fetch(`${env.VITE_SERVER_API_URL}/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      goalId,
    }),
  })

  if (!response.ok) {
    throw response // Lança o erro para ser capturado no handleCompleteGoal
  }
}
