import { FormEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'

import illustrationImage from '../../assets/images/illustration.svg'
import logoImage from '../../assets/images/logo.svg'
import googleIconImage from '../../assets/images/google-icon.svg'

import styles from './styles.module.scss'
import { Button } from '../../components/Button'
import { useAuth } from '../../hooks/useAuth'
import { database } from '../../services/firebase'
import { useEffect } from 'react'

import { AiOutlineInfo } from 'react-icons/ai'

type FirebaseQuestions = Record<string, {
  id: string
  authorId: string
  title: string
  endedAt: string
}>

export function Home() {
  const history = useHistory()
  const { user, signInWithGoogle } = useAuth()
  const [roomCode, setRoomCode] = useState('')
  const [authorRooms, setAuthorRooms] = useState<FirebaseQuestions[]>([])
  const [allRooms, setAllRooms] = useState([])

  let array = [] as []

  useEffect(() => {
    const roomRef = database.ref(`rooms`)

    roomRef.on('value', room => {
      const databaseRoom = room.val()
      const firebaseQuestion = databaseRoom as FirebaseQuestions

      const data = Object.entries(firebaseQuestion).map(([key, value]) => {

        return {
          id: key,
          authorId: value.authorId,
          title: value.title,
          endedAt: value.endedAt
        }
      })
      // @ts-ignore
      setAllRooms([...data])


      if (allRooms.length > 0) {
        allRooms.forEach(room => {
          // @ts-ignore
          if (room.authorId === user?.id && !room.endedAt) {
            array.push(room)

            setAuthorRooms(array)
          }
        })
      }

    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allRooms.length])

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle()
    }

    history.push('/rooms/new')
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault()

    if (roomCode === '') {
      return
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get()

    if (!roomRef.exists()) {
      alert('Room does not exists.')
      return
    }

    if (roomRef.val().endedAt) {
      alert('Room already closed.')
      return
    }

    history.push(`/rooms/${roomCode}`)
  }

  return (
    <div className={styles.page__container}>
      <aside>
        <img src={illustrationImage} alt="Ilustra????o simbolizando perguntas e respostas" />
        <strong>Crie salas para perguntas ao-vivo</strong>
        <p>Tire as d??vidas da sua audi??ncia em tempo real</p>
      </aside>
      <main>
        <div className={styles.main__content}>
          <img src={logoImage} alt="Logo da aplica????o" />
          <button className={styles.create__rom} onClick={handleCreateRoom}>
            <img src={googleIconImage} alt="Logo do google" />
            Crie sua sala com o google
          </button>

          {authorRooms.length > 0 && (
            <p className={styles.have__room}>
              Voc?? j?? tem sala criada!
              <div className={styles.userRomms__container}>
                <h2>Suas salas abertas</h2>
                <span className={styles.rooms__info}>
                  <AiOutlineInfo size={25} color={'#FFFFFF'} />
                </span>
                {authorRooms.map(room => {
                  if (!room.endedAt) {
                    return (
                      //@ts-ignore
                      <span key={room.id}>
                        {room.title}
                        <br />
                        <button onClick={() => history.push(`/admin/rooms/${room.id}`)}>Entrar</button>
                      </span>
                    )
                  }
                  return null
                })}
              </div>
            </p>
          )
          }

          <div className={styles.main__separator}>Ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text "
              placeholder="Digite o c??digo da sala"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}