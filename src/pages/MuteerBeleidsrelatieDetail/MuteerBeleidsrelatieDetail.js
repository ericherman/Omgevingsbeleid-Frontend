import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { withRouter } from 'react-router-dom'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons'

import axios from './../../API/axios'

import PopUpAnimatedContainer from '../../components/PopUpAnimatedContainer'
import LoaderMainTitle from '../../components/LoaderMainTitle'
import LoaderSaving from '../../components/LoaderSaving'

import TabRelaties from './TabRelaties'
import TabVerzoeken from './TabVerzoeken'
import TabAfgewezen from './TabAfgewezen'
import TabVerbroken from './TabVerbroken'

function SwitchToTabbladButton({ currentTabblad, tabbladName, changeTabblad }) {
    const tabbladTitle =
        tabbladName.charAt(0).toUpperCase() + tabbladName.slice(1)
    return (
        <li
            className={`py-2 px-5 text-lg m-color inline-block font-bold m-base-border-color ${
                currentTabblad === tabbladName
                    ? 'border-b-2'
                    : 'cursor-pointer hover:border-b-2'
            }`}
            onClick={() => {
                if (currentTabblad !== tabbladName) {
                    changeTabblad(tabbladName)
                }
            }}
        >
            {tabbladTitle}
        </li>
    )
}

class MuteerBeleidsrelatieDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentTabblad: 'relaties',
            vanLoaded: false,
            naarLoaded: false,
            titelLoaded: false,
            savingInProgress: false,
            Naar_Beleidsbeslissingen: [],
            Van_Beleidsbeslissingen: [],
            motiveringPopUp: null,
            verbreekPopUp: null,
        }
        this.relatieAccepteren = this.relatieAccepteren.bind(this)
        this.relatieAfwijzen = this.relatieAfwijzen.bind(this)
        this.relatieVerbreken = this.relatieVerbreken.bind(this)
        this.toggleMotiveringPopup = this.toggleMotiveringPopup.bind(this)
        this.toggleVerbreekPopup = this.toggleVerbreekPopup.bind(this)
        this.changeTabblad = this.changeTabblad.bind(this)
    }

    getBeleidsbeslissingTitel(UUID) {
        axios.get(`/beleidsbeslissingen/version/${UUID}`).then(res => {
            this.setState({
                beleidsbeslissingTitel: res.data.Titel,
                titelLoaded: true,
            })
        })
    }

    getBeleidsrelatiesVanBeleidsbeslissing(UUID) {
        // Get alle beleidsrelaties die een Van_Beleidsbeslissing relatie hebben met de beleidsbeslissing die bekeken wordt
        axios
            .get(`/beleidsrelaties?Van_Beleidsbeslissing=${UUID}`)
            .then(res => {
                let beleidsrelaties = res.data

                // Als er geen beleidsrelaties zijn => return
                if (beleidsrelaties.length === 0) {
                    this.setState(
                        {
                            vanLoaded: true,
                        },
                        () => {
                            return
                        }
                    )
                }

                // Als er beleidsrelaties zijn mappen we over de array. De return waarde van de map is een array met axios promises. Voor elke relatie binnen de map functie halen we de gekoppelde beleidsrelatie op. Als de data hiervan binnen is is koppelen we deze aan het relatie object.
                const relatieGETRequests = beleidsrelaties.map(relatie => {
                    return axios
                        .get(
                            `/beleidsbeslissingen/version/${relatie.Naar_Beleidsbeslissing}`
                        )
                        .then(res => (relatie.beleidsbeslissing = res.data))
                })

                // Zodra alle promises zijn voldaan kunnen we de van_beleidsbeslissingen opslaan in de state
                const that = this
                Promise.all(relatieGETRequests).then(function(values) {
                    that.setState({
                        Van_Beleidsbeslissingen: beleidsrelaties,
                        vanLoaded: true,
                    })
                })
            })
    }

    getBeleidsrelatiesNaarBeleidsbeslissing(UUID) {
        // Get alle beleidsrelaties die een Naar_Beleidsbeslissing relatie hebben met de beleidsbeslissing die bekeken wordt
        axios
            .get(`/beleidsrelaties?Naar_Beleidsbeslissing=${UUID}`)
            .then(res => {
                let beleidsrelaties = res.data

                // Als er geen beleidsrelaties zijn => return
                if (beleidsrelaties.length === 0) {
                    this.setState(
                        {
                            naarLoaded: true,
                        },
                        () => {
                            return
                        }
                    )
                }

                // Als er beleidsrelaties zijn mappen we over de array. De return waarde van de map is een array met axios promises. Voor elke relatie binnen de map functie halen we de gekoppelde beleidsrelatie op. Als de data hiervan binnen is is koppelen we deze aan het relatie object.
                const relatieGETRequests = beleidsrelaties.map(relatie => {
                    return axios
                        .get(
                            `/beleidsbeslissingen/version/${relatie.Van_Beleidsbeslissing}`
                        )
                        .then(res => (relatie.beleidsbeslissing = res.data))
                })

                // Zodra alle promises zijn voldaan kunnen we de van_beleidsbeslissingen opslaan in de state
                const that = this
                Promise.all(relatieGETRequests).then(function(values) {
                    that.setState({
                        Naar_Beleidsbeslissingen: beleidsrelaties,
                        naarLoaded: true,
                    })
                })
            })
    }

    componentDidMount() {
        const beleidsbeslissingUUID = this.props.match.params.UUID

        // Van de beleidsbeslissing hebben we enkel de titel nodig.
        this.getBeleidsbeslissingTitel(beleidsbeslissingUUID)

        // Beleidsrelaties bestaan met twee relaties, naar en van een beleidsbeslissing.
        // Beidde worden opgehaald met de onderstaande functies.
        this.getBeleidsrelatiesVanBeleidsbeslissing(beleidsbeslissingUUID)
        this.getBeleidsrelatiesNaarBeleidsbeslissing(beleidsbeslissingUUID)
    }

    relatieAccepteren(beleidsrelatieObject) {
        const patchedBeleidsrelatieObject = {
            Status: 'Akkoord',
            Begin_Geldigheid: beleidsrelatieObject.Begin_Geldigheid,
            Eind_Geldigheid: beleidsrelatieObject.Eind_Geldigheid,
            Datum_Akkoord: new Date(),
        }
        this.setState({
            savingInProgress: true,
        })
        axios
            .patch(
                `/beleidsrelaties/${beleidsrelatieObject.ID}`,
                patchedBeleidsrelatieObject
            )
            .then(res => {
                toast('Beleidsrelatie geaccepteerd')
                this.props.updateBeleidsrelaties(
                    beleidsrelatieObject.UUID,
                    'Akkoord'
                )

                // Wijzigen in lokale state
                if (
                    this.state.Van_Beleidsbeslissingen.find(
                        x => x.UUID === beleidsrelatieObject.UUID
                    )
                ) {
                    const itemIndex = this.state.Van_Beleidsbeslissingen.findIndex(
                        x => x.UUID === beleidsrelatieObject.UUID
                    )
                    let newStateObject = this.state.Van_Beleidsbeslissingen
                    newStateObject[itemIndex].Status = 'Akkoord'
                    newStateObject[itemIndex].Datum_Akkoord = new Date()
                    this.setState({
                        Van_Beleidsbeslissingen: newStateObject,
                        savingInProgress: false,
                    })
                } else if (
                    this.state.Naar_Beleidsbeslissingen.find(
                        x => x.UUID === beleidsrelatieObject.UUID
                    )
                ) {
                    const itemIndex = this.state.Naar_Beleidsbeslissingen.findIndex(
                        x => x.UUID === beleidsrelatieObject.UUID
                    )
                    let newStateObject = this.state.Naar_Beleidsbeslissingen
                    newStateObject[itemIndex].Status = 'Akkoord'
                    newStateObject[itemIndex].Datum_Akkoord = new Date()
                    this.setState({
                        Naar_Beleidsbeslissingen: newStateObject,
                        savingInProgress: false,
                    })
                }
            })
            .catch(err => console.log(err))
    }

    relatieAfwijzen(beleidsrelatieObject) {
        const patchedBeleidsrelatieObject = {
            Begin_Geldigheid: beleidsrelatieObject.Begin_Geldigheid,
            Eind_Geldigheid: beleidsrelatieObject.Eind_Geldigheid,
            Datum_Akkoord: new Date(),
            Status: 'NietAkkoord',
        }
        axios
            .patch(
                `/beleidsrelaties/${beleidsrelatieObject.ID}`,
                patchedBeleidsrelatieObject
            )
            .then(res => {
                toast('Beleidsrelatie afgewezen')
                this.props.updateBeleidsrelaties(
                    beleidsrelatieObject.UUID,
                    'NietAkkoord'
                )
            })
            .catch(err => console.log(err))
    }

    relatieVerbreken(beleidsrelatieObject) {
        const patchedBeleidsrelatieObject = {
            Begin_Geldigheid: beleidsrelatieObject.Begin_Geldigheid,
            Eind_Geldigheid: beleidsrelatieObject.Eind_Geldigheid,
            Datum_Akkoord: new Date(),
            Status: 'Verbroken',
        }
        axios
            .patch(
                `/beleidsrelaties/${beleidsrelatieObject.ID}`,
                patchedBeleidsrelatieObject
            )
            .then(res => {
                toast('Beleidsrelatie verbroken')
                this.props.updateBeleidsrelaties(
                    beleidsrelatieObject.UUID,
                    'Verbroken'
                )
            })
            .catch(err => console.log(err))
    }

    patchRelatieStatus(beleidsrelatieObject, nieuweStatus, toastNotificatie) {
        const patchedBeleidsrelatieObject = {
            Begin_Geldigheid: beleidsrelatieObject.Begin_Geldigheid,
            Eind_Geldigheid: beleidsrelatieObject.Eind_Geldigheid,
            Datum_Akkoord: new Date(),
            Status: nieuweStatus,
        }
        axios
            .patch(
                `/beleidsrelaties/${beleidsrelatieObject.ID}`,
                patchedBeleidsrelatieObject
            )
            .then(res => {
                toast(toastNotificatie)
                this.props.updateBeleidsrelaties(
                    beleidsrelatieObject.UUID,
                    nieuweStatus
                )
            })
            .catch(err => console.log(err))
    }

    toggleMotiveringPopup(UUID) {
        this.setState({
            motiveringPopUp: UUID,
        })
    }

    toggleVerbreekPopup(UUID) {
        this.setState({
            verbreekPopUp: UUID,
        })
    }

    changeTabblad(tabbladName) {
        this.setState({
            currentTabblad: tabbladName,
        })
    }

    render() {
        const ParamUUID = this.props.match.params.UUID
        // const beleidsbeslissing = this.props.beleidsbeslissing
        const alleBeleidsrelaties = this.state.Van_Beleidsbeslissingen.concat(
            this.state.Naar_Beleidsbeslissingen
        )
        const relatieArray = alleBeleidsrelaties.filter(
            beleidsrelatie =>
                ((beleidsrelatie.Van_Beleidsbeslissing === ParamUUID ||
                    beleidsrelatie.Naar_Beleidsbeslissing === ParamUUID) &&
                    beleidsrelatie.Status === 'Akkoord') ||
                (beleidsrelatie.Van_Beleidsbeslissing === ParamUUID &&
                    beleidsrelatie.Status === 'Open')
        )

        const afgewezenArray = alleBeleidsrelaties.filter(
            beleidsrelatie =>
                (beleidsrelatie.Van_Beleidsbeslissing === ParamUUID &&
                    beleidsrelatie.Status === 'NietAkkoord') ||
                (beleidsrelatie.Naar_Beleidsbeslissing === ParamUUID &&
                    beleidsrelatie.Status === 'NietAkkoord')
        )

        const verbrokenArray = alleBeleidsrelaties.filter(
            beleidsrelatie =>
                (beleidsrelatie.Van_Beleidsbeslissing === ParamUUID &&
                    beleidsrelatie.Status === 'Verbroken') ||
                (beleidsrelatie.Naar_Beleidsbeslissing === ParamUUID &&
                    beleidsrelatie.Status === 'Verbroken')
        )

        const verzoekArray = alleBeleidsrelaties.filter(
            beleidsrelatie =>
                beleidsrelatie.Naar_Beleidsbeslissing === ParamUUID &&
                beleidsrelatie.Status === 'Open'
        )

        return (
            <div className="w-3/4 rounded inline-block flex-grow">
                <div className="text-gray-600 text-sm w-full container mx-auto">
                    <Link
                        onClick={this.props.backToOverzicht}
                        className="text-gray-600 text-l mb-2 inline-block cursor-pointer"
                        id="button-back-to-previous-page"
                        to={`/muteer/beleidsrelaties`}
                    >
                        <FontAwesomeIcon className="mr-2" icon={faAngleLeft} />
                        <span>Terug naar overzicht</span>
                    </Link>
                </div>

                <div className="bg-white shadow rounded p-5">
                    <div className="flex justify-between">
                        <div>
                            <span className="text-gray-500 text-sm mb-1 block">
                                Beleidsbeslissing
                            </span>
                            <h1 className="text-xl font-bold text-gray-800 inline-block mb-8">
                                {this.state.titelLoaded ? (
                                    this.state.beleidsbeslissingTitel
                                ) : (
                                    <LoaderMainTitle />
                                )}
                                <span className="border font-semibold m-color m-base-border-color px-1 py-1 text-xs rounded -mt-1 inline-block absolute ml-4">
                                    Vigerend
                                </span>
                            </h1>
                        </div>
                        <div>
                            <Link
                                to={`/muteer/beleidsrelaties/${this.props.match.params.UUID}/nieuwe-relatie`}
                                className="bg-green-600 hover:bg-green-700 px-2 py-2 text-white rounded text-sm font-semibold cursor-pointer"
                            >
                                <FontAwesomeIcon
                                    className="mr-2 text-white"
                                    icon={faPlus}
                                />
                                Nieuwe relatie
                            </Link>
                        </div>
                    </div>

                    <div className="border-b border-gray-200 w-full mb-5">
                        <ul>
                            <SwitchToTabbladButton
                                changeTabblad={this.changeTabblad}
                                currentTabblad={this.state.currentTabblad}
                                tabbladName="relaties"
                            />
                            <SwitchToTabbladButton
                                changeTabblad={this.changeTabblad}
                                currentTabblad={this.state.currentTabblad}
                                tabbladName="verzoeken"
                            />
                            <SwitchToTabbladButton
                                changeTabblad={this.changeTabblad}
                                currentTabblad={this.state.currentTabblad}
                                tabbladName="afgewezen"
                            />
                            <SwitchToTabbladButton
                                changeTabblad={this.changeTabblad}
                                currentTabblad={this.state.currentTabblad}
                                tabbladName="verbroken"
                            />
                        </ul>
                    </div>

                    {this.state.currentTabblad === 'relaties' ? (
                        <TabRelaties
                            relatieVerbreken={this.relatieVerbreken}
                            relatieArray={relatieArray}
                            relatieAfwijzen={this.relatieAfwijzen}
                            naarLoaded={this.state.naarLoaded}
                            vanLoaded={this.state.vanLoaded}
                            toggleMotiveringPopup={this.toggleMotiveringPopup}
                            motiveringPopUp={this.state.motiveringPopUp}
                            toggleVerbreekPopup={this.toggleVerbreekPopup}
                            verbreekPopUp={this.state.verbreekPopUp}
                            beleidsbeslissingTitel={
                                this.state.beleidsbeslissingTitel
                            }
                        />
                    ) : null}

                    {this.state.currentTabblad === 'verzoeken' ? (
                        <TabVerzoeken
                            relatieAfwijzen={this.relatieAfwijzen}
                            relatieAccepteren={this.relatieAccepteren}
                            naarLoaded={this.state.naarLoaded}
                            vanLoaded={this.state.vanLoaded}
                            toggleMotiveringPopup={this.toggleMotiveringPopup}
                            motiveringPopUp={this.state.motiveringPopUp}
                            verzoekArray={verzoekArray}
                        />
                    ) : null}

                    {this.state.currentTabblad === 'afgewezen' ? (
                        <TabAfgewezen
                            relatieAfwijzen={this.relatieAfwijzen}
                            relatieAccepteren={this.relatieAccepteren}
                            naarLoaded={this.state.naarLoaded}
                            vanLoaded={this.state.vanLoaded}
                            toggleMotiveringPopup={this.toggleMotiveringPopup}
                            motiveringPopUp={this.state.motiveringPopUp}
                            afgewezenArray={afgewezenArray}
                        />
                    ) : null}

                    {this.state.currentTabblad === 'verbroken' ? (
                        <TabVerbroken
                            relatieAfwijzen={this.relatieAfwijzen}
                            relatieAccepteren={this.relatieAccepteren}
                            naarLoaded={this.state.naarLoaded}
                            vanLoaded={this.state.vanLoaded}
                            toggleMotiveringPopup={this.toggleMotiveringPopup}
                            motiveringPopUp={this.state.motiveringPopUp}
                            verbrokenArray={verbrokenArray}
                        />
                    ) : null}

                    {this.state.savingInProgress ? <LoaderSaving /> : null}
                </div>
            </div>
        )
    }
}

export default withRouter(MuteerBeleidsrelatieDetail)
