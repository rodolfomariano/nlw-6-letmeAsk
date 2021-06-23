import { FormEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import logoImage from '../../assets/images/logo.svg'
import { Button } from '../../components/Button'
import { RoomCode } from '../../components/RoomCode'
import { useAuth } from '../../hooks/useAuth'
import { database } from '../../services/firebase'

import styles from './styles.module.scss'

type FirebaseQuestions = Record<string, {
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: boolean
  isHighlighted: boolean
}>

type Question = {
  id: string
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: boolean
  isHighlighted: boolean
}

type RoomParams = {
  id: string
}

export function Room() {
  const { user } = useAuth()
  const params = useParams<RoomParams>()
  const roomId = params.id
  const [newQuestion, setNewQuestion] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`)

    roomRef.on('value', room => {
      const databaseRoom = room.val()
      const firebaseQuestion = databaseRoom.questions as FirebaseQuestions ?? {}

      const parsedQuestions = Object.entries(firebaseQuestion).map(([key, value]) => {
        const { author, content, isHighlighted, isAnswered } = value

        return {
          id: key,
          content,
          author,
          isAnswered,
          isHighlighted
        }
      })

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)

    })
  }, [roomId])

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault()

    if (newQuestion.trim() === '') {
      return
    }

    if (!user) {
      throw new Error('You must be logged in')
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false
    }

    await database.ref(`rooms/${roomId}/questions`).push(question)
    setNewQuestion('')
  }

  return (
    <div className={styles.page__container}>
      <header>
        <div className={styles.room__header__content}>
          <img src={logoImage} alt="Logo letMeAsk" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main className={styles.main__content}>
        <div className={styles.room__title}>
          <h1>Sala - {title}</h1>
          {questions.length > 0 && <span>{questions.length} {questions.length === 1 ? 'pergunta' : 'perguntas'}</span>}
        </div>

        <form>
          <textarea
            placeholder="Qual a sua pergunta?"
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className={styles.form__footer}>
            {user ? (
              <div className={styles.user__info}>
                <img src={user.avatar} alt={`Foto do usuario ${user.name}`} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span className={styles.footer__span}>Para enviar uma pergunta, <button>Faça seu login</button>. </span>
            )}
            <Button type="submit" onClick={handleSendQuestion} disabled={!user} >Enviar Pergunta</Button>
          </div>
        </form>

        {JSON.stringify(questions)}
      </main>
    </div>
  )
}