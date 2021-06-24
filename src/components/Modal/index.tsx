// import { AllHTMLAttributes } from 'react'
// HTMLDivElement
import { MouseEvent, ReactNode } from 'react'
import styles from './styles.module.scss'

interface ModalProps {
  children: ReactNode
  isOpen?: true | false
  onClose: () => void
}

export function Modal({ children, isOpen = false, onClose = () => { } }: ModalProps) {

  function handleOutsideClick(e: MouseEvent) {
    // @ts-ignore
    if (e.target.id === 'modal') {
      onClose()
    }
  }

  return (
    <div
      id="modal"
      className={`${styles.modal__container} ${isOpen === false ? styles.modalHidden : styles.modalVisible}`}
      onClick={handleOutsideClick}
    >
      {children}
    </div>
  )
}