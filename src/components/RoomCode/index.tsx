import styles from './styles.module.scss'

import copyImage from '../../assets/images/copy.svg'

type RoomCodeProps = {
  code: string
}

export function RoomCode(props: RoomCodeProps) {

  function copyRoomCodeClipboard() {
    navigator.clipboard.writeText(props.code)
  }

  return (
    <button className={styles.room__code} onClick={copyRoomCodeClipboard}>
      <div>
        <img src={copyImage} alt="Icone de copiar" />
      </div>
      <span>Sala #{props.code}</span>
    </button>
  )
}