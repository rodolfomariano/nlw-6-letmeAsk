import { ReactNode } from 'react'
import styles from './styles.module.scss'

type QuestionProps = {
  content: string
  author: {
    name: string
    avatar: string
  }
  children?: ReactNode
  isAnswered?: boolean
  isHighlighted?: boolean
}

export function Question({
  content,
  author,
  children,
  isAnswered = false,
  isHighlighted = false
}: QuestionProps) {
  const { name, avatar } = author

  return (
    <div className={`
      ${styles.question__container} 
      ${isAnswered === true ? styles.answered : ''}
      ${isHighlighted === true && !isAnswered ? styles.highlighted : ''}
    `}>
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