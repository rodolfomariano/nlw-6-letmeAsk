import { useEffect, useState } from "react"
import { database } from "../services/firebase"
import { useAuth } from "./useAuth"

type QuestionType = {
  id: string
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: boolean
  isHighlighted: boolean
  likeCount: number
  likeId: string | undefined
}

type FirebaseQuestions = Record<string, {
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: boolean
  isHighlighted: boolean
  likes: Record<string, {
    authorId: string
  }>
}>

export function useRoom(roomId: string) {
  const { user } = useAuth()
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [title, setTitle] = useState('')
  const [authorId, setAuthorId] = useState('')

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`)

    roomRef.on('value', room => {
      const databaseRoom = room.val()
      const firebaseQuestion = databaseRoom.questions as FirebaseQuestions ?? {}

      setAuthorId(databaseRoom.authorId)

      const parsedQuestions = Object.entries(firebaseQuestion).map(([key, value]) => {
        const { author, content, isHighlighted, isAnswered, likes } = value

        return {
          id: key,
          content,
          author,
          isAnswered,
          isHighlighted,
          likeCount: Object.values(likes ?? {}).length,
          likeId: Object.entries(likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
        }
      })

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)

    })

    return () => {
      roomRef.off('value')
    }

  }, [roomId, user?.id])

  return { questions, title, authorId }
}