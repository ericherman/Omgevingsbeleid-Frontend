import React from "react"

/**
 * Displays a Formfield input container.
 *
 * @param {object} children - Parameter that is used to show content within the component.
 */
function FormFieldInputContainer({ children }) {
    return (
        <div className="flex flex-wrap mb-6 -mx-3">
            <div className="w-full px-3">{children}</div>
        </div>
    )
}

export default FormFieldInputContainer
