import { Link } from 'react-router-dom'

/**
 * Displays a tooltip for the NetworkGraph items.
 *
 * @param {object} variables - Contains a collection of style items for the toolip in object form.
 * @param {string} href - Contains the target URL for the Link component.
 */

interface Props {
    variables: { left?: string | number; top?: string | number }
    href: string
}

const NetworkGraphTooltip = ({ variables, href }: Props) => (
    <div
        id="d3-tooltip-network-graph"
        style={{
            left: variables.left,
            top: variables.top,
        }}
        className="absolute z-50 hidden px-4 py-2 bg-white rounded shadow-md hover:block">
        <Link to={href} className="select-none group" role="tooltip">
            <div
                id="d3-tooltip-network-graph-type"
                className={`text-gray-600 text-sm`}
            />
            <div
                id="d3-tooltip-network-graph-title"
                className={`text-pzh-blue-dark group-hover:underline truncate text-base`}
                style={{ maxWidth: '400px' }}
            />
        </Link>
    </div>
)

export default NetworkGraphTooltip
