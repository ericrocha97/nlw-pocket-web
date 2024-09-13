import { Plus } from 'lucide-react'
import { OutlineButton } from './ui/outline-button'
import { getPendingGoals } from '../http/get-pending-goals'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createGoalCompletion } from '../http/create-goal-completion'
import * as Toast from '@radix-ui/react-toast'
import { useState } from 'react'
import { errorMessagesMap } from '../utils/translate'

export function PendingGoals() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const { data } = useQuery({
    queryKey: ['pending-goals'],
    queryFn: getPendingGoals,
    staleTime: 1000 * 60, // 60 seconds
  })

  if (!data) {
    return null
  }

  async function handleCompleteGoal(goalId: string) {
    try {
      await createGoalCompletion(goalId)
      queryClient.invalidateQueries({ queryKey: ['summary'] })
      queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
    } catch (error) {
      if (error instanceof Response && error.status === 500) {
        const errorResponse = await error.json()
        const errorMessage = errorResponse.message
        const translatedMessage =
          errorMessagesMap[errorMessage] ||
          'Erro ao completar a meta. Tente novamente mais tarde.'
        setErrorMessage(translatedMessage)
        setOpen(true)
      } else {
        setErrorMessage('Erro inesperado. Tente novamente.')
        setOpen(true)
      }
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {data.map(goal => {
          return (
            <OutlineButton
              key={goal.id}
              disabled={goal.completionCount >= goal.desiredWeeklyFrequency}
              onClick={() => handleCompleteGoal(goal.id)}
            >
              <Plus className="size-4 text-zinc-600" />
              {goal.title}
            </OutlineButton>
          )
        })}
      </div>

      <Toast.Provider>
        <Toast.Root
          className="bg-red-500 text-white p-3 rounded shadow-lg flex flex-col items-start"
          open={open}
          onOpenChange={setOpen}
        >
          <Toast.Title className="font-bold">Erro</Toast.Title>
          <Toast.Description className="mb-2">{errorMessage}</Toast.Description>
          <div className="self-end mt-2">
            <Toast.Action asChild altText="Fechar">
              <button
                type="button"
                className="px-2 py-1 text-red-200 hover:text-white border border-red-300 rounded hover:bg-red-600 transition"
              >
                Fechar
              </button>
            </Toast.Action>
          </div>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 p-6" />
      </Toast.Provider>
    </>
  )
}
