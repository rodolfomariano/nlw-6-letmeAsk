import { ReactNode } from 'react'
import styles from './styles.module.scss'

type QuestionProps = {
  content: string
  author: {
    name: string
    avatar: string
  }
  children?: ReactNode
}

export function Question({ content, author, children }: QuestionProps) {
  const { name, avatar } = author

  return (
    <div className={styles.question__container}>
      <p>
        {content}
      </p>
      <footer>
        <div className={styles.user__info}>
          <img src={avatar} alt={`Foto do ${name}`} />
          <span>{name}</span>
        </div>
        <div>
          {children}
        </div>
      </footer>
    </div>
  )
}