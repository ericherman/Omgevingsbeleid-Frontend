import { faChevronUp, faChevronDown } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, useState } from 'react'

/**
 * Component that renders the ToggleableSection component which displays a button which either contains the options of the legenda or Achtergrondlaag of the map when clicked on.
 *
 * @param {object} children - Parameter containing the collection within the component.
 * @param {string} title - Parameter containing the title of the component.
 * @param {number} positionTop - Parameter containing the top position of the component.
 */

interface ToggleableSectionProps {
    title: string
    positionTop?: boolean
}

const ToggleableSection: FC<ToggleableSectionProps> = ({
    children,
    title,
    positionTop,
}) => {
    const [open, setOpen] = useState(true)

    return (
        <div>
            <button
                onClick={() => setOpen(!open)}
                className={`flex items-center justify-between w-full p-5 text-left bg-gray-100 border-b border-gray-300 ${
                    positionTop ? '' : 'border-t'
                }`}>
                <span className="font-semibold">{title}</span>
                <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
            </button>
            {open ? <div className="pb-10">{children}</div> : null}
        </div>
    )
}

export default ToggleableSection
