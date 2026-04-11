import { AlertCircle, CheckCircle, Info } from 'lucide-react'

export default function Alert({ type = 'info', message, title }) {
  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: CheckCircle,
      text: 'text-green-800',
      title: 'text-green-900',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: AlertCircle,
      text: 'text-red-800',
      title: 'text-red-900',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: Info,
      text: 'text-blue-800',
      title: 'text-blue-900',
    },
  }

  const style = styles[type]
  const Icon = style.icon

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4 flex gap-3`}>
      <Icon size={20} className={style.text} />
      <div>
        {title && <p className={`font-semibold ${style.title}`}>{title}</p>}
        <p className={style.text}>{message}</p>
      </div>
    </div>
  )
}
