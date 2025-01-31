import { Button, FormikInput, Heading, Modal } from '@pzh-ui/components'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import useAuth from '@/hooks/useAuth'

interface FormProps {
    email: string
    password: string
}

const schema = Yup.object().shape({
    email: Yup.string()
        .email('Onjuist e-mailadres')
        .required('Dit veld is verplicht'),
    password: Yup.string().required('Dit veld is verplicht'),
})

/**
 * Displays a login form in which the user can log into the application.
 */

const LoginForm = () => {
    const navigate = useNavigate()
    const { signin } = useAuth()

    const [wachtwoordResetPopup, setWachtwoordResetPopup] = useState(false)
    const [error, setError] = useState(null)

    const handleFormSubmit = ({ email, password }: FormProps) => {
        signin(email, password)
            .then(() => {
                navigate('/muteer/dashboard', { replace: true })
            })
            .catch(err => {
                setError(err?.data?.message || 'Er is iets mis gegaan.')
            })
    }

    return (
        <>
            <PopupPasswordForgot
                show={wachtwoordResetPopup}
                togglePopup={() =>
                    setWachtwoordResetPopup(!wachtwoordResetPopup)
                }
            />
            <Formik
                initialValues={{ email: '', password: '' }}
                onSubmit={handleFormSubmit}
                validationSchema={schema}>
                {({ values, handleSubmit, isValid, dirty }) => (
                    <Form onSubmit={handleSubmit}>
                        <FormikInput
                            label="E-mailadres"
                            name="email"
                            type="email"
                            placeholder="medewerker@pzh.nl"
                            value={values.email}
                        />
                        <div className="mt-6">
                            <FormikInput
                                label="Wachtwoord"
                                name="password"
                                type="password"
                                placeholder="Vul hier je wachtwoord in"
                                value={values.password}
                            />
                        </div>
                        <div className="mt-7 flex justify-between items-center">
                            <Button
                                label="Inloggen"
                                type="submit"
                                disabled={!isValid || !dirty}
                            />
                            <button
                                className="mt-4 text-sm underline cursor-pointer sm:mt-0 sm:ml-4 text-pzh-green hover:text-pzh-green-dark"
                                onClick={e => {
                                    e.preventDefault()
                                    setWachtwoordResetPopup(
                                        !wachtwoordResetPopup
                                    )
                                }}
                                tabIndex={0}>
                                Wachtwoord vergeten?
                            </button>
                        </div>
                        {error && (
                            <div className="mt-4">
                                <span className=" text-pzh-red">{error}</span>
                            </div>
                        )}
                    </Form>
                )}
            </Formik>
        </>
    )
}

/**
 * Displays a popup in which the user can reset their password.
 */

interface PopupPasswordForgotProps {
    show: boolean
    togglePopup: () => void
}

const PopupPasswordForgot = ({
    show,
    togglePopup,
}: PopupPasswordForgotProps) => (
    <Modal
        maxWidth="max-w-sm"
        open={show}
        onClose={togglePopup}
        closeButton
        ariaLabel="Wachtwoord vergeten">
        <Heading level="3">Wachtwoord vergeten</Heading>

        <div className="relative p-4 mb-4 mt-2 border-l-4 bg-pzh-blue-super-light border-pzh-blue">
            <p className="mt-1 text-sm text-pzh-blue-dark">
                Binnenkort willen wij het mogelijk maken dat medewerkers van
                provincie Zuid-Holland automatisch kunnen inloggen. Tot die tijd
                moet het nog met een e-mailadres en een wachtwoord.
            </p>
        </div>

        <p className="py-1 text-pzh-blue-dark">
            Wachtwoord vergeten? Stuur dan een e-mail naar het team
            Omgevingsbeleid door op de link te klikken. Je ontvangt dan binnen
            één werkdag een nieuw wachtwoord.
        </p>
        <div className="flex items-center justify-between mt-5">
            <button
                className="text-sm underline transition-colors cursor-pointer text-pzh-blue hover:text-pzh-blue-dark"
                onClick={togglePopup}
                id="close-password-forget-popup"
                data-testid="close-password-forget-popup">
                Annuleren
            </button>
            <Button
                label="Mail versturen"
                variant="cta"
                id="wachtwoord-reset-button-mailto"
                data-testid="wachtwoord-reset-button-mailto"
                onClick={() => {
                    window.location.href =
                        'mailto:omgevingsbeleid@pzh.nl?subject=Wachtwoord vergeten'
                    togglePopup()
                }}
            />
        </div>
    </Modal>
)

export default LoginForm
