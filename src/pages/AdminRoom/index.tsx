import { useHistory, useParams } from 'react-router-dom'
import { Question } from '../../components/Question'
import { useAuth } from '../../hooks/useAuth'
import { useRoom } from '../../hooks/useRoom'
import { database } from '../../services/firebase'

import styles from './styles.module.scss'
import deleteImg from '../../assets/images/delete.svg'
import checkImg from '../../assets/images/check.svg'
import answerImg from '../../assets/images/answer.svg'
import answerImg2 from '../../assets/images/answer-2.svg'
import questionImage from '../../assets/images/question.svg'

import { Modal } from '../../components/Modal'
import { useState } from 'react'

import { BiTrashAlt } from 'react-icons/bi'
import { IoIosCloseCircleOutline } from "react-icons/io"
import { VscDebugStepBack } from "react-icons/vsc"
import { TopBar } from '../../components/TopBar'
import { useEffect } from 'react'

type RoomParams = {
  id: string
}


export function AdminRoom() {
  const { user } = useAuth()
  const history = useHistory()
  const params = useParams<RoomParams>()
  const roomId = params.id
  const { questions, title, authorId } = useRoom(roomId)

  const [openModal, setOpenModal] = useState(false)
  const [removeQuestionId, setRemoveQuestionId] = useState('')


  useEffect(() => {
    if (authorId) {
      if (user?.id !== authorId) {
        history.push(`/rooms/${roomId}`)
      }
    }
  }, [authorId, user?.id, roomId, history])


  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/')
  }

  function removeBlur() {
    // const topBArToBlur = document.getElementById('topBar')
    // const blurPage = document.getElementById('page')
    // // @ts-ignore
    // topBArToBlur.style.filter = 'blur(0)'
    // // @ts-ignore
    // blurPage.style.filter = 'blur(0)'
  }

  function handleOpenModal(questionId: string) {
    setOpenModal(!openModal)
    setRemoveQuestionId(questionId)

    // const topBArToBlur = document.getElementById('topBar')
    // const blurPage = document.getElementById('page')
    // // @ts-ignore
    // topBArToBlur.style.filter = 'blur(2px)'
    // // @ts-ignore
    // blurPage.style.filter = 'blur(2px)'
  }

  async function handleDeleteQuestion() {
    setOpenModal(!openModal)
    await database.ref(`rooms/${roomId}/questions/${removeQuestionId}`).remove()
    setRemoveQuestionId('')
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    })

  }

  async function handleRemoveCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: false,
    })
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    })
  }

  async function handleRemoveHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: false,
    })
  }

  return (
    <div className={styles.page__container}>

      <TopBar />

      <main className={styles.main__content} id='page'>
        <div className={styles.room__title}>
          <h1>Sala - {title}</h1>
          {questions.length > 0 && <span>{questions.length} {questions.length === 1 ? 'pergunta' : 'perguntas'}</span>}
        </div>

        {questions.length === 0 && (
          <div className={styles.notHaveQuestions}>
            <p>Não há perguntas</p>
            <img src={questionImage} alt="" />
          </div>
        )}

        <div className={styles.question__list}>
          {questions.map(question => {
            const { name, avatar } = question.author

            return (
              <Question
                key={question.id}
                content={question.content}
                author={{ name, avatar }}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                <div className={styles.action__container}>
                  {!question.isAnswered ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleCheckQuestionAsAnswered(question.id)}
                      >
                        <img src={checkImg} alt="MNarcar como respondido" />
                      </button>
                      {question.isHighlighted === false ? (
                        <button
                          type="button"
                          onClick={() => handleHighlightQuestion(question.id)}
                        >
                          <img src={answerImg} alt="Marcar como responddendo" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlightQuestion(question.id)}
                        >
                          <img src={answerImg2} alt="respondendo a pergunta" />
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRemoveCheckQuestionAsAnswered(question.id)}
                    >
                      <VscDebugStepBack size={20} color={'#835AFD'} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleOpenModal(question.id)}
                  >
                    <img src={deleteImg} alt="Icone de deletar" />
                  </button>
                </div>
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
            removeBlur()
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
                  removeBlur()
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