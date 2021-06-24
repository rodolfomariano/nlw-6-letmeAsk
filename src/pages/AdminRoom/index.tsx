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
import { Modal } from '../../components/Modal'
import { useState } from 'react'

import { BiTrashAlt } from 'react-icons/bi'
import { IoIosCloseCircleOutline } from "react-icons/io"

type RoomParams = {
  id: string
}

export function AdminRoom() {
  // const { user } = useAuth()
  const history = useHistory()
  const params = useParams<RoomParams>()
  const roomId = params.id
  const { questions, title } = useRoom(roomId)

  const [openModal, setOpenModal] = useState(false)
  const [removeQuestionId, setRemoveQuestionId] = useState('')

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/')

  }

  function handleOpenModal(questionId: string) {
    setOpenModal(!openModal)
    setRemoveQuestionId(questionId)
  }

  async function handleDeleteQuestion() {
    setOpenModal(!openModal)
    await database.ref(`rooms/${roomId}/questions/${removeQuestionId}`).remove()
    setRemoveQuestionId('')
  }

  return (
    <div className={styles.page__container}>
      <header className={styles.page__header}>
        <div className={styles.room__header__content}>
          <img src={logoImage} alt="Logo letMeAsk" />
          <div className={styles.room__header__action}>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={() => setOpenModal(!openModal)}>Encerrar sala</Button>
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
                  onClick={() => handleOpenModal(question.id)}
                >
                  <img src={deleteImg} alt="Icone de deletar" />
                </button>
              </Question>
            )
          })}
        </div>

      </main>

      {openModal === true ? (
        <Modal
          isOpen={openModal}
          onClose={() => {
            setOpenModal(!openModal)
            setRemoveQuestionId('')
          }}
        >
          <div className={styles.modal__container}>
            <header className={styles.modal__header}>
              {removeQuestionId === ''
                ? <IoIosCloseCircleOutline size={40} color={'#F29F05'} />
                : <BiTrashAlt size={40} color={'#F29F05'} />}

              <h1 className={styles.modal__title}>
                {removeQuestionId === '' ? 'Encerrar sala' : 'Excluir pergunta'}
              </h1>
            </header>
            <main className={styles.modal__content}>
              <p className={styles.modal__detail}>
                {removeQuestionId === '' ? 'Tem certeza que deseja encerrar essa sala?' : 'Tem certeza que deseja escluir essa pergunta?'}
              </p>
            </main>
            <footer className={styles.modal__footer}>
              <button
                className={styles.confirm}
                type="button"
                onClick={removeQuestionId === '' ? handleEndRoom : handleDeleteQuestion}
              >
                Confirmar
              </button>

              <button
                className={styles.cancel}
                type="button"
                onClick={() => {
                  setOpenModal(!openModal)
                  setRemoveQuestionId('')
                }}
              >
                Cancelar
              </button>
            </footer>
          </div>
        </Modal>
      ) : null}

    </div>
  )
}