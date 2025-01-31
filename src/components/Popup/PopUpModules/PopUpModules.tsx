import { useEffect, useState } from 'react'
import ContentLoader from 'react-content-loader'
import { toast } from 'react-toastify'

import { getBeleidsmodules, patchBeleidsmodulesLineageid } from '@/api/fetchers'
import {
    BeleidskeuzesRead,
    BeleidsmodulesRead,
    BeleidsmodulesReadBeleidskeuzesItem,
    BeleidsmodulesReadMaatregelenItem,
} from '@/api/fetchers.schemas'
import handleError from '@/utils/handleError'

import PopUpAnimatedContainer from '../PopUpAnimatedContainer'

/**
 * @param {object} dataObject - Contains the object that is being displayed
 * @param {string} status - Contains the current status of the dataObject
 * @param {string} titleSingular - Contains the title in a singular form of the dataObject
 * @param {function} toggleModulesPopup - Function to show or hide the modulesPopup.
 * @returns A component to change the status of an object
 */

interface PopUpModules {
    dataObject: BeleidskeuzesRead
    setDataObject?: (dataObject: BeleidsmodulesRead) => void
    toggleModulesPopup: () => void
    titleSingular: string
    setDimensionHistory: (dataObjects: BeleidsmodulesRead[]) => void
    dimensionHistory: BeleidsmodulesRead[]
}

function PopUpModules({
    dataObject,
    setDataObject,
    toggleModulesPopup,
    titleSingular,
    setDimensionHistory,
    dimensionHistory,
}: PopUpModules) {
    const [beleidsmodules, setBeleidsmodules] = useState<BeleidsmodulesRead[]>(
        []
    )
    const [dataLoaded, setDataLoaded] = useState(false)
    const [initialModule, setInitialModule] =
        useState<BeleidsmodulesRead | null>(null)
    const [selectValue, setSelectValue] = useState('')

    /**
     * Function to add to a module
     */
    const patchModule = () => {
        const type =
            titleSingular === 'Beleidskeuze' ? 'Beleidskeuzes' : 'Maatregelen'

        const beleidsmodule = beleidsmodules.find(e => e.UUID === selectValue)

        if (!beleidsmodule?.ID) return

        // We only need to add it to the new module
        const newConnection = {
            Koppeling_Omschrijving: '',
            UUID: dataObject.UUID,
        }

        const currentConnections = beleidsmodule[type]
            ?.map(
                (
                    connection: (
                        | BeleidsmodulesReadBeleidskeuzesItem
                        | BeleidsmodulesReadMaatregelenItem
                    ) & { UUID?: string }
                ) => {
                    if (connection.hasOwnProperty('Object')) {
                        connection.UUID = connection.Object?.UUID
                        delete connection.Object
                        return connection
                    } else {
                        return connection
                    }
                }
            )
            .filter(connection => connection.UUID !== dataObject.UUID) // Filter out existing connections

        patchBeleidsmodulesLineageid(beleidsmodule.ID, {
            [type]: [...(currentConnections || []), newConnection],
        })
            .then(data => {
                // On add, push to Ref_Beleidsmodules: [{ID: 1, UUID: "6B569424-254F-411B-A219-F2BFF19895A5", Titel: "Beleidsmodule van Aiden"}]
                dataObject.Ref_Beleidsmodules?.push({
                    ID: data.ID,
                    UUID: data.UUID,
                    Titel: data.Titel,
                })

                // We only set the dataObject if we add a module to objects that are vigerend
                setDataObject?.({ ...dataObject })

                const indexOfDataObject = dimensionHistory.findIndex(
                    e => e.UUID === dataObject.UUID
                )
                dimensionHistory[indexOfDataObject] = dataObject
                setDimensionHistory(dimensionHistory)

                toast(
                    `${titleSingular} toegevoegd aan module '${beleidsmodule.Titel}'`
                )
            })
            .catch(err => handleError(err))
    }

    /**
     * Function that gets and sets the beleidsmodulen
     */
    const getAndSetBeleidsmodules = () => {
        getBeleidsmodules().then(data => {
            setBeleidsmodules(data)
            setDataLoaded(true)
        })
    }

    useEffect(() => {
        const type =
            titleSingular === 'Beleidskeuze' ? 'Beleidskeuzes' : 'Maatregelen'

        // Check if the dataObject.UUID exists in one of the policies of the beleidsmodules
        const activeModule = beleidsmodules?.find(module =>
            (
                module[type] as (
                    | (
                          | BeleidsmodulesReadBeleidskeuzesItem
                          | BeleidsmodulesReadMaatregelenItem
                      ) & { UUID?: string }
                )[]
            )?.find(
                connection =>
                    connection?.Object?.UUID === dataObject.UUID ||
                    connection?.UUID === dataObject.UUID
            )
        )

        if (activeModule) {
            setInitialModule(activeModule)
            setSelectValue(activeModule.UUID || '')
        }
    }, [dataObject, beleidsmodules, titleSingular])

    useEffect(() => {
        getAndSetBeleidsmodules()
    }, [])

    return (
        <PopUpAnimatedContainer small>
            <div id="popup-edit-status" className="text-gray-800">
                <h2 className="mb-4 font-bold">Module aanpassen</h2>
                {dataLoaded ? (
                    <div className="relative inline-block w-64">
                        <select
                            required
                            onChange={event =>
                                setSelectValue(event.target.value)
                            }
                            value={selectValue}
                            name={'Status'}
                            className="block w-full px-4 py-3 leading-tight text-gray-700 bg-white border border-gray-400 rounded appearance-none focus:outline-none hover:border-gray-500 focus:border-gray-500">
                            <option disabled value="">
                                - selecteer een optie -
                            </option>
                            {beleidsmodules
                                ? beleidsmodules.map((arrayItem, index) => (
                                      <option
                                          key={index}
                                          value={arrayItem.UUID}>
                                          {arrayItem.Titel}
                                      </option>
                                  ))
                                : null}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                            <svg
                                className="w-4 h-4 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                ) : (
                    <ContentLoader
                        className="relative w-full h-12"
                        width={`300`}
                        height="60">
                        <rect
                            data-testid="select-loader"
                            x="0"
                            y="0"
                            rx="5"
                            ry="5"
                            width="90%"
                            height="60"
                        />
                    </ContentLoader>
                )}
                <div className="flex items-center justify-between mt-5 text-sm">
                    <div
                        className="text-gray-600 underline cursor-pointer hover:text-gray-800 pzh-transition-colors"
                        onClick={toggleModulesPopup}>
                        Annuleren
                    </div>
                    <div
                        className={`bg-pzh-green pzh-transition-colors px-8 py-2 text-white rounded font-bold ${
                            selectValue !== ''
                                ? 'cursor-pointer hover:bg-pzh-green-dark'
                                : 'cursor-not-allowed'
                        }`}
                        onClick={() => {
                            if (
                                selectValue !== '' &&
                                selectValue !== initialModule?.UUID
                            ) {
                                toggleModulesPopup()
                                patchModule()
                            } else if (selectValue !== initialModule?.UUID) {
                                toast('Selecteer eerst een nieuwe module')
                            } else {
                                toggleModulesPopup()
                            }
                        }}>
                        Aanpassen
                    </div>
                </div>
            </div>
        </PopUpAnimatedContainer>
    )
}

export default PopUpModules
