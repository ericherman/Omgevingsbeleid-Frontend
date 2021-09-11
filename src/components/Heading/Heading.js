import React from "react"
import { useWindowSize } from "../../utils/useWindowSize"

/**
 *
 * @param {string} level - Heading level
 * @param {object} windowSize - Contains the width and height of the screen
 * @returns {object} - Returns the styles for the appropriate screen
 */
const getHeadingStyles = (level, windowSize) => {
    if (!windowSize) {
        console.error("No windowSize supplied!")
        return {}
    }

    const smallScreen = 640
    const currentScreenIsMobile = windowSize.width <= smallScreen

    if (level === "1") {
        if (currentScreenIsMobile) {
            return {
                fontSize: "1.6rem",
                lineHeight: "1.75rem",
            }
        } else {
            return {
                fontSize: "2.4rem",
                lineHeight: "2.8rem",
            }
        }
    } else if (level === "2") {
        if (currentScreenIsMobile) {
            return {
                fontSize: "1.2rem",
                lineHeight: "1.6rem",
            }
        } else {
            return {
                fontSize: "1.8rem",
                lineHeight: "2.2rem",
            }
        }
    } else if (level === "3") {
        if (currentScreenIsMobile) {
            return {
                fontSize: "1.1rem",
                lineHeight: "1.5rem",
            }
        } else {
            return {
                fontSize: "1.2rem",
                lineHeight: "1.6rem",
            }
        }
    } else {
        // No custom styles yet for heading 4, 5 and 6
        return {}
    }
}

/**
 *
 * @param {object} props
 * @param {string} props.className - Contains the classes
 * @param {string} props.color - Contains the color
 * @param {string} props.id - Contains an optional id
 * @param {string} props.level - Contains the number indicating the header level
 * @param {object} props.children - Contains the children
 * @returns A heading element
 */
function Heading({
    className = "",
    id,
    color = "text-pzh-blue-dark",
    level,
    children,
}) {
    const windowSize = useWindowSize()
    const styles = getHeadingStyles(level, windowSize)

    if (level === "1") {
        return (
            <h1 style={styles} id={id} className={`${color} ${className}`}>
                {children}
            </h1>
        )
    } else if (level === "2") {
        return (
            <h2 style={styles} id={id} className={`${color} ${className}`}>
                {children}
            </h2>
        )
    } else if (level === "3") {
        return (
            <h3 style={styles} id={id} className={`${color} ${className}`}>
                {children}
            </h3>
        )
    } else if (level === "4") {
        return (
            <h4 style={styles} id={id} className={`${color} ${className}`}>
                {children}
            </h4>
        )
    } else if (level === "5") {
        return (
            <h5 style={styles} id={id} className={`${color} ${className}`}>
                {children}
            </h5>
        )
    } else if (level === "6") {
        return (
            <h6 style={styles} id={id} className={`${color} ${className}`}>
                {children}
            </h6>
        )
    } else {
        throw new Error(`${level} is not a valid heading level`)
    }
}

export default Heading
