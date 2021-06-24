import { useHistory, useParams } from 'react-router-dom'
import logoImage from '../../assets/images/logo.svg'
import { Button } from '../../components/Button'
import { Question } from '../../components/Question'
import { RoomCode } from '../../components/RoomCode'
// import { useAuth } from '../../hooks/useAuth'
import { useRoom } from '../../hooks/useRoom'
import { database } from '../../services/firebase'

import styles from './styles.module.scss'
import deleteImg from '../../assets/images/delete.svg'

type RoomParams = {
  id: string
}

export function AdminRoom() {
  // const { user } = useAuth()
  const history = useHistory()
  const params = useParams<RoomParams>()
  const roomId = params.id
  const { questions, title } = useRoom(roomId)

  async function handleEndRoom() {
    if (window.confirm('Tem certeza que deseja encerrar essa sala?')) {
      await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date(),
      })

      history.push('/')
    }

  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  return (
    <div className={styles.page__container}>
      <header>
        <div className={styles.room__header__content}>
          <img src={logoImage} alt="Logo letMeAsk" />
          <div className={styles.room__header__action}>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main className={styles.main__content}>
        <div className={styles.room__title}>
          <h1>Sala - {title}</h1>
          {questions.length > 0 && <span>{questions.length} {questions.length === 1 ? 'pergunta' : 'perguntas'}</span>}
        </div>

        <div className={styles.question__list}>
          {questions.map(question => {
            const { name, avatar } = question.author

            return (
              <Question key={question.id} content={question.content} author={{ name, avatar }} >
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Icone de deletar" />
                </button>
              </Question>
            )
          })}
        </div>

      </main>
    </div>
  )
}