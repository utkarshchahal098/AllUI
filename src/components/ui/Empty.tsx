import type { ReactNode } from 'react'
import Icon, { type IconName } from './Icon'

interface Props {
  icon?: IconName
  title: string
  body?: string
  action?: ReactNode
}

export default function Empty({ icon = 'search', title, body, action }: Props) {
  return (
    <div className="empty panel cut">
      <span className="empty-icon">
        <Icon name={icon} size={26} />
      </span>
      <h3 className="display d-md">{title}</h3>
      {body && <p className="lede empty-body">{body}</p>}
      {action}
    </div>
  )
}
