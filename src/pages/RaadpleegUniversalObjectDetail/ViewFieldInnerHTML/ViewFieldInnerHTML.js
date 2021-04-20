import React from 'react'
import DOMPurify from 'dompurify'

function ViewFieldInnerHTML({ html, fieldTitel }) {
    const cleanHtml = DOMPurify.sanitize(html)
    return (
        <div className="mb-8">
            {fieldTitel ? (
                <h2 className="block mb-1 text-lg font-bold tracking-wide text-pzh-blue">
                    {fieldTitel}
                </h2>
            ) : null}
            <div
                className="raadpleeg-innerhtml"
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
            ></div>
        </div>
    )
}

export default ViewFieldInnerHTML
