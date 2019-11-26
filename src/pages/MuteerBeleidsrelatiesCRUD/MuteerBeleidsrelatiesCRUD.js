import React, { Component } from 'react'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import nlLocale from 'date-fns/locale/nl'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import validator from 'validator'

// Import Components
import ContainerCrudFields from './ContainerCrudFields'
import LoaderContent from './../../components/LoaderContent'
import ButtonBackToPage from './../../components/ButtonBackToPage'

// Import Axios instance to connect with the API
import axios from './../../API/axios'

// Create Context
import APIcontext from './APIContext'

class MuteerBeleidsrelatiesCRUD extends Component {
    constructor(props) {
        super(props)
        // CrudObject contains the editable fields
        this.state = {
            crudObject: {
                Aanvraag_Datum: '',
                Begin_Geldigheid: '',
                Eind_Geldigheid: '',
                Naar_Beleidsbeslissing: '',
                Omschrijving: '',
                Status: '',
                Titel: '',
                Van_Beleidsbeslissing: this.props.match.params.UUID,
                Status: 'Open',
                Aanvraag_Datum: new Date(),
            },
            Van_Beleidsbeslissing_Titel: '...',
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.setEditorState = this.setEditorState.bind(this)
        this.voegKoppelingRelatieToe = this.voegKoppelingRelatieToe.bind(this)
        this.wijzigKoppelingRelatie = this.wijzigKoppelingRelatie.bind(this)
        this.verwijderKoppelingRelatieToe = this.verwijderKoppelingRelatieToe.bind(
            this
        )
        this.checkForEmptyFields = this.checkForEmptyFields.bind(this)
    }

    componentDidMount() {
        const UUID = this.props.match.params.UUID
        axios
            .get(`/beleidsbeslissingen/version/${UUID}`)
            .then(res =>
                this.setState({
                    Van_Beleidsbeslissing_Titel: res.data.Titel,
                })
            )
            .catch(error => console.log(error))
    }

    handleChange(event) {
        console.log('Called')

        const name = event.target.name
        const type = event.target.type

        let value = event.target.value
        if (type === 'date') {
            value = event.target.value
        }
        console.log(name)
        console.log(value)

        this.setState(
            prevState => ({
                crudObject: {
                    ...prevState.crudObject,
                    [name]: value,
                },
            }),
            () => console.log(this.state)
        )
    }

    // Algemene State Handler voor de Editor
    setEditorState(stateValue, fieldName) {
        this.setState(prevState => ({
            crudObject: {
                ...prevState.crudObject,
                [fieldName]: stateValue,
            },
        }))
    }

    checkForEmptyFields(crudObject) {
        const dataModel = this.props.dataModel
        let allFieldsComplete = true
        // let requiredProperties = []
        // let requiredPropertyTypes = {}
        // Ga voor elk veld van het crudObject na of het een required field is
        Object.keys(crudObject).forEach(function(key, index) {
            if (dataModel.required.includes(key)) {
                const dataModelFormat = dataModel.properties[key].format

                // Check if the dataModel Type is equal to the type in the crudObject
                if (
                    dataModelFormat === 'uuid' &&
                    allFieldsComplete &&
                    !crudObject[key]
                ) {
                    toast(`Vul alle 'Personen' velden in`)
                    allFieldsComplete = false
                } else if (
                    dataModelFormat === 'uuid' &&
                    allFieldsComplete &&
                    !validator.isUUID(crudObject[key])
                ) {
                    toast(`Vul alle 'Personen' velden in`)
                    allFieldsComplete = false
                }

                // // Push de key naar de requiredProperties array
                // requiredProperties.push(key)
                // // Push het type en het format naar het requiredPropertyTypes object
                // requiredPropertyTypes[key] = {
                //     type: dataModel.properties[key].type,
                //     format: dataModel.properties[key].format,
                // }
            }
        })
        return allFieldsComplete

        // Als het een required field is, kijk of het type overeen komt met die in het dataModel
    }

    validateDate(dateObject) {
        if (Object.prototype.toString.call(dateObject) === '[object Date]') {
            // it is a date
            if (isNaN(dateObject.getTime())) {
                // date is not valid
                return false
            } else {
                // date is valid
                return true
            }
        } else {
            // not a date
            return false
        }
    }

    handleSubmit(event) {
        event.preventDefault()

        // Remove Local Storage Item
        const objectName = this.props.dataModel.variables.Object_Name
        localStorage.removeItem(objectName)

        // Set variables to save to the DB
        const objectID = this.props.match.params.single
        const overzichtSlug = this.props.overzichtSlug
        const ApiEndpoint = this.props.ApiEndpoint

        let crudObject = this.state.crudObject

        // Zet de Date String om naar een Date Object en kijkt of deze geldig is
        crudObject.Begin_Geldigheid = new Date(crudObject.Begin_Geldigheid)
        if (this.validateDate(crudObject.Begin_Geldigheid)) {
            // Datum is geldig
        } else {
            toast('Vul een inwerkingtreding datum in')
            return
        }

        crudObject.Eind_Geldigheid = new Date(crudObject.Eind_Geldigheid)
        if (this.validateDate(crudObject.Eind_Geldigheid)) {
            // Datum is geldig
        } else {
            toast('Vul een uitwerkingtreding datum in')
            return
        }

        axios
            .post(`/beleidsrelaties`, JSON.stringify(crudObject))
            .then(res => {
                this.props.history.push(
                    `/muteer/beleidsrelaties/${this.props.match.params.UUID}`
                )
                toast('Opgeslagen')
            })
            .catch(error => {
                console.log(error)
            })
    }

    voegKoppelingRelatieToe(propertyName, object, omschrijving) {
        const nieuwObject = {
            UUID: object.UUID,
            Omschrijving: omschrijving,
        }

        // let nieuweArray = this.state.crudObject[propertyName]
        let nieuwCrudObject = this.state.crudObject
        // Als de relatie Array nog niet initialized is, maak deze aan
        if (typeof nieuwCrudObject[propertyName] === 'string') {
            nieuwCrudObject[propertyName] = []
        }
        nieuwCrudObject[propertyName].push(nieuwObject)

        this.setState(
            {
                crudObject: nieuwCrudObject,
            },
            () => toast('Koppeling toegevoegd')
        )
    }

    wijzigKoppelingRelatie(koppelingObject, nieuweOmschrijving) {
        let nieuwCrudObject = this.state.crudObject
        const index = nieuwCrudObject[koppelingObject.propertyName].findIndex(
            item => item.UUID === koppelingObject.item.UUID
        )
        nieuwCrudObject[koppelingObject.propertyName][
            index
        ].Omschrijving = nieuweOmschrijving

        this.setState(
            {
                crudObject: nieuwCrudObject,
            },
            () => toast('Koppeling gewijzigd')
        )
    }

    verwijderKoppelingRelatieToe(koppelingObject) {
        let nieuwCrudObject = this.state.crudObject
        const index = nieuwCrudObject[koppelingObject.propertyName].findIndex(
            item => item.UUID === koppelingObject.item.UUID
        )
        nieuwCrudObject[koppelingObject.propertyName].splice(index, 1)

        this.setState(
            {
                crudObject: nieuwCrudObject,
            },
            () => toast('Koppeling verwijderd')
        )
    }

    componentDidUpdate(prevProps, prevState) {
        // Save to LocalStorage
        // If page === edit set Key to Name_UUID
        // If page === new set Key to Name
        if (
            this.state.dataLoaded === false ||
            JSON.stringify(this.state.crudObject) ===
                JSON.stringify(prevProps.crudObject)
        ) {
            return
        }

        if (!this.state.edit) {
            const objectName = this.props.dataModel.variables.Object_Name
            const localStorageObject = {
                date: new Date(),
                savedState: this.state.crudObject,
            }
            localStorage.setItem(objectName, JSON.stringify(localStorageObject))
        } else {
            const objectName = this.props.dataModel.variables.Object_Name
            const objectID = this.props.match.params.single
            const localStorageKey = `${objectName}_${objectID}`
            const localStorageObject = {
                date: new Date(),
                savedState: this.state.crudObject,
            }
            localStorage.setItem(
                localStorageKey,
                JSON.stringify(localStorageObject)
            )
        }
    }

    render() {
        const contextObject = {
            objectUUID: this.state.UUID,
            titelEnkelvoud: this.props.dataModel.variables.Titel_Enkelvoud,
            titelMeervoud: this.props.dataModel.variables.Titel_Meervoud,
            overzichtSlug: this.props.overzichtSlug,
            objectID: this.props.match.params.single,
            editStatus: this.state.edit,
            handleSubmit: this.handleSubmit,
            voegKoppelingRelatieToe: this.voegKoppelingRelatieToe,
            wijzigKoppelingRelatie: this.wijzigKoppelingRelatie,
            verwijderKoppelingRelatieToe: this.verwijderKoppelingRelatieToe,
            handleChange: this.handleChange,
            crudObject: this.state.crudObject,
            setEditorState: this.setEditorState,
            Van_Beleidsbeslissing_Titel: this.state.Van_Beleidsbeslissing_Titel,
        }

        return (
            <div>
                <Helmet>
                    <title>
                        {contextObject.editStatus
                            ? `Omgevingsbeleid - Wijzig ${
                                  contextObject.titelEnkelvoud
                              }${' '}
                            ${contextObject.objectID}`
                            : `Omgevingsbeleid - Voeg een nieuwe${' '}
                            ${contextObject.titelEnkelvoud}${' '}
                              toe`}
                    </title>
                </Helmet>
                <div className="w-full py-32 px-6 mbg-color edit-header relative">
                    <div className="lg:px-10 container mx-auto flex justify-center items-center">
                        <div className="w-full pr-20">
                            <ButtonBackToPage
                                terugNaar={`beleidsrelatie`}
                                color="text-white"
                                url={`/muteer/beleidsrelaties/${this.props.match.params.UUID}`}
                            />
                            <h1 className="heading-serif-4xl text-white">
                                Voeg een nieuwe beleidsrelatie toe
                            </h1>
                        </div>
                    </div>
                </div>
                <APIcontext.Provider value={contextObject}>
                    <ContainerCrudFields />
                </APIcontext.Provider>
            </div>
        )
    }
}

export default withRouter(MuteerBeleidsrelatiesCRUD)
