import { useHistory, useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { database } from '../../services/firebase'

import { RoomCode } from '../RoomCode'
import { Button } from '../Button'
import { Modal } from '../Modal'

import styles from './styles.module.scss'

import logoImage from '../../assets/images/logo.svg'
import { IoIosCloseCircleOutline } from "react-icons/io"
import { useAuth } from '../../hooks/useAuth'
import { useRoom } from '../../hooks/useRoom'

type RoomParams = {
  id: string
}

export function TopBar() {
  const { user } = useAuth()
  const [openModal, setOpenModal] = useState(false)
  const history = useHistory()

  const params = useParams<RoomParams>()
  const roomId = params.id
  const { authorId } = useRoom(roomId)

  const [isAuthor, setIsAuthor] = useState(false)
  const [menuIsVisible, setMenuIsVisible] = useState(false)

  useEffect(() => {
    if (user?.id === authorId) {
      setIsAuthor(true)
    }

  }, [user?.id, authorId, roomId, history])

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

  function handleOpenModal() {
    setOpenModal(!openModal)
    // const topBArToBlur = document.getElementById('topBar')
    // const blurPage = document.getElementById('page')
    // // @ts-ignore
    // topBArToBlur.style.filter = 'blur(2px)'
    // // @ts-ignore
    // blurPage.style.filter = 'blur(2px)'
  }

  function handleGoToHome() {
    history.push('/')
  }

  function handleOpenMenu() {
    const el = document.querySelector('#menu')
    if (el) {
      if (menuIsVisible === false) {
        // @ts-ignore
        el.style.display = 'flex'

      } else {
        // @ts-ignore
        el.style.display = 'none'
      }

      setMenuIsVisible(!menuIsVisible)
    }
  }

  return (
    <>
      <header className={styles.page__header} id="topBar">
        <div className={styles.room__header__content}>
          <img src={logoImage} alt="Logo letMeAsk" onClick={handleGoToHome} />
          <div className={styles.room__header__action}>
            <ul className={styles.room__header__menu}>
              <li>
                <img src={user?.avatar} alt="Foto do usurio" onClick={handleOpenMenu} />
                <div id='menu' className={styles.room__header__menu__control}>
                  <div className={styles.menu__content}>
                    <header>
                      <h3>{user?.name}</h3>
                      <span>{user?.email}</span>
                    </header>
                    <RoomCode code={roomId} />

                    {isAuthor === true ? (
                      <>
                        <div className={styles.adminNav}>
                          <p>Navegar como:</p>
                          <div>
                            <Link
                              to={`/admin/rooms/${roomId}`}
                              className={styles.adminNav__link}
                            >
                              Administrador
                            </Link>
                            <Link
                              to={`/rooms/${roomId}`}
                              className={styles.adminNav__link}
                            >
                              Participante
                            </Link>
                          </div>
                        </div>
                        <Button isOutlined onClick={handleOpenModal} className={styles.closeRoom}>Encerrar sala</Button>
                      </>
                    ) : (null)}
                  </div>

                </div>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {openModal === true ? (
        <Modal
          isOpen={openModal}
          onClose={() => {
            setOpenModal(!openModal)
          }}
        >
          <div className={styles.modal__container}>
            <header className={styles.modal__header}>
              <IoIosCloseCircleOutline size={40} color={'#F29F05'} />

              <h1 className={styles.modal__title}>Encerrar sala</h1>
            </header>
            <main className={styles.modal__content}>
              <p className={styles.modal__detail}>
                Tem certeza que deseja encerrar essa sala?
              </p>
            </main>
            <footer className={styles.modal__footer}>
              <button
                className={styles.confirm}
                type="button"
                onClick={handleEndRoom}
              >
                Confirmar
              </button>

              <button
                className={styles.cancel}
                type="button"
                onClick={() => {
                  setOpenModal(!openModal)
                  removeBlur()
                }}
              >
                Cancelar
              </button>
            </footer>
          </div>
        </Modal>
      ) : null
      }
    </>
  )
}