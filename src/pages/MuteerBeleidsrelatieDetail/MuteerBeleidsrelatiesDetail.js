import React from "react"
import { Link } from "react-router-dom"
import { withRouter, useParams } from "react-router-dom"
import { toast } from "react-toastify"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft, faPlus } from "@fortawesome/pro-solid-svg-icons"

import axios from "../../API/axios"

import LoaderMainTitle from "../../components/LoaderMainTitle"
import LoaderSaving from "../../components/LoaderSaving"

import TabRelations from "./TabRelations"
import TabRequests from "./TabRequests"
import TabRejected from "./TabRejected"
import TabDisconnected from "./TabDisconnected"
import SwitchToTabbladButton from "./SwitchToTabbladButton"

/**
 *
 * @param {function} updateBeleidsrelaties - Updates the beleidsrelaties in the parentstate
 * @param {function} backToOverzicht - Sets the page type to 'overzicht'
 * @returns The detail page for the relations of beleidskeuzes.
 * Here the user can accept, reject, delete existing, and create new relations between beleidskeuzes.
 */
const MuteerBeleidsrelatiesDetail = ({
    updateBeleidsrelaties,
    backToOverzicht,
}) => {
    const [activeTab, setActiveTab] = React.useState("relaties")
    const [isLoading, setIsLoading] = React.useState(true)
    const [savingInProgress, setSavingInProgress] = React.useState(false)
    const [incoming_Beleidskeuzes, setIncoming_Beleidskeuzes] = React.useState(
        []
    )
    const [outgoing_Beleidskeuzes, setOutgoing_Beleidskeuzes] = React.useState(
        []
    )
    const [motivationPopUp, setMotivationPopUp] = React.useState(null)
    const [disconnectPopup, setDisconnectPopup] = React.useState(null)
    const [beleidsObject, setBeleidsObject] = React.useState({})

    // Arrays containing the relations
    const [relations, setRelations] = React.useState([])
    const [rejected, setRejected] = React.useState([])
    const [disconnected, setDisconnected] = React.useState([])
    const [requests, setRequests] = React.useState([])

    const { UUID } = useParams()

    const getAndSetBeleidskeuze = (UUID) =>
        axios.get(`version/beleidskeuzes/${UUID}`).then((res) => {
            setBeleidsObject(res.data)
        })

    // Get alle beleidsrelaties die een Van_Beleidskeuze relatie hebben met de beleidskeuze die bekeken wordt
    const getBeleidsrelatiesVanBeleidskeuze = (UUID) =>
        axios
            .get(`/beleidsrelaties?all_filters=Van_Beleidskeuze:${UUID}`)
            .then((res) => {
                const outgoing = res.data
                if (outgoing.length === 0) return
                setOutgoing_Beleidskeuzes(outgoing)
            })

    // Get alle beleidsrelaties die een Naar_Beleidskeuze relatie hebben met de beleidskeuze die bekeken wordt
    const getBeleidsrelatiesNaarBeleidskeuze = (UUID) =>
        axios
            .get(`/beleidsrelaties?all_filters=Naar_Beleidskeuze:${UUID}`)
            .then((res) => {
                const incoming = res.data
                if (incoming.length === 0) return
                setIncoming_Beleidskeuzes(incoming)
            })

    const relationshipAccept = (beleidsrelatieObject) => {
        const patchedBeleidsrelatieObject = {
            Status: "Akkoord",
            Begin_Geldigheid: beleidsrelatieObject.Begin_Geldigheid,
            Eind_Geldigheid: beleidsrelatieObject.Eind_Geldigheid,
            Datum_Akkoord: new Date(),
        }

        setSavingInProgress(true)

        axios
            .patch(
                `/beleidsrelaties/${beleidsrelatieObject.ID}`,
                patchedBeleidsrelatieObject
            )
            .then(() => {
                toast("Beleidsrelatie geaccepteerd")
                if (
                    outgoing_Beleidskeuzes.find(
                        (x) => x.UUID === beleidsrelatieObject.UUID
                    )
                ) {
                    const itemIndex = outgoing_Beleidskeuzes.findIndex(
                        (x) => x.UUID === beleidsrelatieObject.UUID
                    )
                    let newStateObject = outgoing_Beleidskeuzes
                    newStateObject[itemIndex].Status = "Akkoord"
                    newStateObject[itemIndex].Datum_Akkoord = new Date()
                    setOutgoing_Beleidskeuzes([...newStateObject])
                    setSavingInProgress(false)
                } else if (
                    incoming_Beleidskeuzes.find(
                        (x) => x.UUID === beleidsrelatieObject.UUID
                    )
                ) {
                    const itemIndex = incoming_Beleidskeuzes.findIndex(
                        (x) => x.UUID === beleidsrelatieObject.UUID
                    )
                    let newStateObject = incoming_Beleidskeuzes
                    newStateObject[itemIndex].Status = "Akkoord"
                    newStateObject[itemIndex].Datum_Akkoord = new Date()
                    setIncoming_Beleidskeuzes([...newStateObject])
                    setSavingInProgress(false)
                }
            })
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
                setSavingInProgress(false)
            })
    }

    const relationshipReject = (beleidsrelatieObject) => {
        const patchedBeleidsrelatieObject = {
            Begin_Geldigheid: beleidsrelatieObject.Begin_Geldigheid,
            Eind_Geldigheid: beleidsrelatieObject.Eind_Geldigheid,
            Datum_Akkoord: new Date(),
            Status: "NietAkkoord",
        }

        setSavingInProgress(true)

        axios
            .patch(
                `/beleidsrelaties/${beleidsrelatieObject.ID}`,
                patchedBeleidsrelatieObject
            )
            .then((res) => {
                toast("Beleidsrelatie afgewezen")
                setSavingInProgress(false)
                updateBeleidsrelaties(beleidsrelatieObject.UUID, "NietAkkoord")
                updateStatus(beleidsrelatieObject.UUID, "NietAkkoord")
            })
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
                setSavingInProgress(false)
            })
    }

    const relationshipDisconnect = (beleidsrelatieObject) => {
        const patchedBeleidsrelatieObject = {
            Begin_Geldigheid: beleidsrelatieObject.Begin_Geldigheid,
            Eind_Geldigheid: beleidsrelatieObject.Eind_Geldigheid,
            Datum_Akkoord: new Date(),
            Status: "Verbroken",
        }

        setSavingInProgress(true)

        axios
            .patch(
                `/beleidsrelaties/${beleidsrelatieObject.ID}`,
                patchedBeleidsrelatieObject
            )
            .then((res) => {
                toast("Beleidsrelatie verbroken")
                setSavingInProgress(false)
                updateBeleidsrelaties(beleidsrelatieObject.UUID, "Verbroken")
            })
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
                setSavingInProgress(false)
            })
    }

    // Wordt gebruikt om de lokale state te updaten bij bijvoorbeeld het intrekken van een relatie verzoek
    const updateStatus = (uuid, nieuweStatus, updateDatumAkkoord) => {
        const vanIndex = outgoing_Beleidskeuzes.findIndex(
            (x) => x.UUID === uuid
        )

        if (vanIndex !== -1) {
            outgoing_Beleidskeuzes[vanIndex].Status = nieuweStatus
            if (updateDatumAkkoord)
                outgoing_Beleidskeuzes[vanIndex].Datum_Akkoord = new Date()
        }

        const naarIndex = incoming_Beleidskeuzes.findIndex(
            (x) => x.UUID === uuid
        )
        if (naarIndex !== -1) {
            incoming_Beleidskeuzes[naarIndex].Status = nieuweStatus
            if (updateDatumAkkoord)
                incoming_Beleidskeuzes[naarIndex].Datum_Akkoord = new Date()
        }

        setIncoming_Beleidskeuzes([...incoming_Beleidskeuzes])
        setOutgoing_Beleidskeuzes([...outgoing_Beleidskeuzes])
    }

    /** Initialize detail page */
    React.useEffect(() => {
        if (!UUID) return () => null

        Promise.all([
            getAndSetBeleidskeuze(UUID),
            getBeleidsrelatiesVanBeleidskeuze(UUID),
            getBeleidsrelatiesNaarBeleidskeuze(UUID),
        ]).then(() => {
            setIsLoading(false)
        })
    }, [UUID])

    /** Generate all necessary data for the different tabs */
    React.useEffect(() => {
        const alleBeleidsrelaties = outgoing_Beleidskeuzes.concat(
            incoming_Beleidskeuzes
        )

        const newRelatieArray = alleBeleidsrelaties.filter(
            (beleidsrelatie) =>
                ((beleidsrelatie.Van_Beleidskeuze.UUID === UUID ||
                    beleidsrelatie.Naar_Beleidskeuze.UUID === UUID) &&
                    beleidsrelatie.Status === "Akkoord") ||
                (beleidsrelatie.Van_Beleidskeuze.UUID === UUID &&
                    beleidsrelatie.Status === "Open")
        )

        const newAfgewezenArray = alleBeleidsrelaties.filter(
            (beleidsrelatie) =>
                (beleidsrelatie.Van_Beleidskeuze.UUID === UUID &&
                    beleidsrelatie.Status === "NietAkkoord") ||
                (beleidsrelatie.Naar_Beleidskeuze.UUID === UUID &&
                    beleidsrelatie.Status === "NietAkkoord")
        )

        const newVerbrokenArray = alleBeleidsrelaties.filter(
            (beleidsrelatie) =>
                (beleidsrelatie.Van_Beleidskeuze.UUID === UUID &&
                    beleidsrelatie.Status === "Verbroken") ||
                (beleidsrelatie.Naar_Beleidskeuze.UUID === UUID &&
                    beleidsrelatie.Status === "Verbroken")
        )

        const newVerzoekArray = alleBeleidsrelaties.filter(
            (beleidsrelatie) =>
                beleidsrelatie.Naar_Beleidskeuze.UUID === UUID &&
                beleidsrelatie.Status === "Open"
        )

        setRelations(newRelatieArray)
        setRejected(newAfgewezenArray)
        setDisconnected(newVerbrokenArray)
        setRequests(newVerzoekArray)
    }, [incoming_Beleidskeuzes, outgoing_Beleidskeuzes, UUID])

    return (
        <div className="flex-grow inline-block w-3/4 rounded">
            <div className="container w-full mx-auto text-sm text-gray-600">
                <Link
                    onClick={backToOverzicht}
                    className="inline-block mb-2 text-gray-600 cursor-pointer text-l"
                    id="button-back-to-previous-page"
                    to={`/muteer/beleidsrelaties`}
                >
                    <FontAwesomeIcon className="mr-2" icon={faAngleLeft} />
                    <span>Terug naar overzicht</span>
                </Link>
            </div>

            <div className="p-5 bg-white rounded shadow">
                <div className="flex justify-between">
                    <div>
                        <span className="block mb-1 text-sm text-gray-500">
                            Beleidskeuze
                        </span>
                        <h1 className="inline-block mb-8 text-xl font-bold text-gray-800">
                            {isLoading ? (
                                <LoaderMainTitle />
                            ) : (
                                beleidsObject.Titel
                            )}

                            {!isLoading ? (
                                <span
                                    className={`absolute inline-block px-1 ml-4 pt-1 text-xs font-bold border rounded  ${
                                        beleidsObject.Status === "Vigerend"
                                            ? "text-pzh-blue border-pzh-blue"
                                            : "text-pzh-yellow-dark border-pzh-yellow-dark"
                                    } 
                                                                    `}
                                >
                                    {beleidsObject.Status}
                                </span>
                            ) : null}
                        </h1>
                    </div>
                    <div className="flex-shrink-0">
                        <Link
                            to={`/muteer/beleidsrelaties/${UUID}/nieuwe-relatie`}
                            className="px-2 pt-2 pb-1 text-sm font-bold text-white transition-colors duration-100 ease-in rounded cursor-pointer bg-pzh-green hover:bg-pzh-green-dark"
                        >
                            <FontAwesomeIcon
                                className="mr-2 text-white"
                                icon={faPlus}
                            />
                            Nieuwe relatie
                        </Link>
                    </div>
                </div>

                <div className="w-full mb-5 border-b border-gray-200">
                    <ul>
                        <SwitchToTabbladButton
                            setActiveTab={setActiveTab}
                            activeTab={activeTab}
                            tabName="relaties"
                        />
                        <SwitchToTabbladButton
                            setActiveTab={setActiveTab}
                            activeTab={activeTab}
                            tabName="verzoeken"
                            showLength={true}
                            arrayLength={requests.length}
                        />
                        <SwitchToTabbladButton
                            setActiveTab={setActiveTab}
                            activeTab={activeTab}
                            tabName="afgewezen"
                        />
                        <SwitchToTabbladButton
                            setActiveTab={setActiveTab}
                            activeTab={activeTab}
                            tabName="verbroken"
                        />
                    </ul>
                </div>

                {activeTab === "relaties" ? (
                    <TabRelations
                        updateStatus={updateStatus}
                        relationshipDisconnect={relationshipDisconnect}
                        relations={relations}
                        relationshipReject={relationshipReject}
                        loaded={!isLoading}
                        setMotivationPopUp={setMotivationPopUp}
                        motivationPopUp={motivationPopUp}
                        setDisconnectPopup={setDisconnectPopup}
                        disconnectPopUp={disconnectPopup}
                        beleidskeuzeTitle={beleidsObject.Titel}
                    />
                ) : null}

                {activeTab === "verzoeken" ? (
                    <TabRequests
                        updateStatus={updateStatus}
                        relationshipReject={relationshipReject}
                        relationshipAccept={relationshipAccept}
                        loaded={!isLoading}
                        setMotivationPopUp={setMotivationPopUp}
                        motivationPopUp={motivationPopUp}
                        requests={requests}
                    />
                ) : null}

                {activeTab === "afgewezen" ? (
                    <TabRejected
                        updateStatus={updateStatus}
                        relationshipReject={relationshipReject}
                        relationshipAccept={relationshipAccept}
                        loaded={!isLoading}
                        setMotivationPopUp={setMotivationPopUp}
                        motivationPopUp={motivationPopUp}
                        rejected={rejected}
                    />
                ) : null}

                {activeTab === "verbroken" ? (
                    <TabDisconnected
                        updateStatus={updateStatus}
                        relationshipReject={relationshipReject}
                        relationshipAccept={relationshipAccept}
                        loaded={!isLoading}
                        setMotivationPopUp={setMotivationPopUp}
                        motivationPopUp={motivationPopUp}
                        disconnected={disconnected}
                    />
                ) : null}

                {savingInProgress ? <LoaderSaving /> : null}
            </div>
        </div>
    )
}

export default withRouter(MuteerBeleidsrelatiesDetail)