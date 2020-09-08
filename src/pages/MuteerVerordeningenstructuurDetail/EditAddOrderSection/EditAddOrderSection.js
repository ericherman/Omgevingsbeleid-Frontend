import React from 'react'

import { faPlus, faArrowsAltV } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// This component displays the UI to, edit, add and change the order of the regulation objects
function EditAddOrderSection({
    UUIDBeingEdited,
    lineage,
    toggleAdd,
    toggleOrder,
    isActiveChapter,
    activeChapter,
    editOrderMode,
    addSectionMode,
}) {
    // If offset of the top is scrolled by by the user set the component as fixed
    // const navigation = document.getElementById('navigation-main')

    const [fixedStyle, setFixedStyle] = React.useState({})
    const [regularStyle, setRegularStyle] = React.useState({})
    const [heightAddOrderBar, setHeightAddOrderBar] = React.useState({})
    const [fixedActive, setFixedActive] = React.useState(false)

    React.useEffect(() => {
        const addOrderBar = document.getElementById('verordening-order-add')
        const offsetTopAddOrderBar = addOrderBar.offsetTop
        const offsetLeftAddOrderBar = addOrderBar.offsetLeft
        const widthAddOrderBar = addOrderBar.offsetWidth
        const heightAddOrderBar = addOrderBar.offsetHeight

        const navigationMain = document.getElementById('navigation-main')
        const heightNavigation = 0
        // navigationMain.offsetTop + navigationMain.offsetHeight

        setHeightAddOrderBar({
            height: heightAddOrderBar,
            width: '100%',
            display: 'block',
        })

        setFixedStyle({
            left: offsetLeftAddOrderBar,
            top: heightNavigation,
            width: widthAddOrderBar,
            position: 'fixed',
            display: 'flex',
            alignItems: 'center',
            borderBottomWidth: '1px',
            borderColor: '#cbd5e0',
            backgroundColor: '#FFF',
            zIndex: 10,
        })

        setRegularStyle({
            display: 'flex',
            alignItems: 'center',
            borderBottomWidth: '1px',
            borderColor: '#cbd5e0',
        })

        let last_known_scroll_position = 0
        let ticking = false

        const doSomething = (scroll_pos) => {
            // Do something with the scroll position
            if (!addOrderBar) return

            if (offsetTopAddOrderBar - heightNavigation < scroll_pos) {
                setFixedActive(true)
            } else {
                setFixedActive(false)
            }
        }

        const throttleScroll = (e) => {
            last_known_scroll_position = window.scrollY

            if (!ticking) {
                window.requestAnimationFrame(function () {
                    doSomething(last_known_scroll_position)
                    ticking = false
                })

                ticking = true
            }
        }

        window.addEventListener('scroll', throttleScroll)

        return () => window.removeEventListener('scroll', throttleScroll)
    }, [activeChapter])

    return (
        <React.Fragment>
            {fixedActive ? <div style={heightAddOrderBar} /> : null}
            <div
                style={fixedActive ? fixedStyle : regularStyle}
                id="verordening-order-add"
            >
                <Heading
                    show={!editOrderMode && !addSectionMode}
                    isActiveChapter={isActiveChapter}
                    activeChapter={activeChapter}
                    lineage={lineage}
                />
                <React.Fragment>
                    {!editOrderMode && !addSectionMode ? (
                        <EditAddOrderInactive
                            UUIDBeingEdited={UUIDBeingEdited}
                            toggleAdd={toggleAdd}
                            toggleOrder={toggleOrder}
                        />
                    ) : null}

                    {editOrderMode || addSectionMode ? (
                        <EditAddOrderActive
                            fixedActive={fixedActive}
                            editOrderMode={editOrderMode}
                            addSectionMode={addSectionMode}
                        />
                    ) : null}
                </React.Fragment>
            </div>
        </React.Fragment>
    )
}

const EditAddOrderInactive = ({ toggleAdd, toggleOrder, UUIDBeingEdited }) => {
    return (
        <div className={`flex self-stretch justify-end flex-grow`}>
            <div className="flex items-center h-full">
                {/* Add button */}
                <button
                    className={`flex items-center justify-center inline-block w-12 h-12 h-full font-semibold text-gray-700 transition duration-100 ease-in border-l border-gray-400 hover:bg-gray-50 hover:text-gray-900 ${
                        UUIDBeingEdited
                            ? 'cursor-not-allowed'
                            : 'cursor-pointer'
                    }`}
                    onClick={() => {
                        if (!UUIDBeingEdited) {
                            toggleAdd()
                        }
                    }}
                >
                    <span className="flex items-center justify-center inline-block px-2">
                        <FontAwesomeIcon
                            className="absolute text-sm"
                            icon={faPlus}
                        />
                    </span>
                </button>
                {/* Order button */}
                <button
                    onClick={() => {
                        if (!UUIDBeingEdited) {
                            toggleOrder()
                        }
                    }}
                    className={`flex items-center justify-center inline-block w-12 h-12 h-full font-semibold text-gray-700 transition duration-100 ease-in border-l border-gray-400 hover:bg-gray-50 hover:text-gray-900 ${
                        UUIDBeingEdited
                            ? 'cursor-not-allowed'
                            : 'cursor-pointer'
                    }`}
                >
                    <span className="flex items-center justify-center inline-block px-2">
                        <FontAwesomeIcon
                            className="absolute text-sm"
                            icon={faArrowsAltV}
                        />
                    </span>
                </button>
            </div>
        </div>
    )
}

const EditAddOrderActive = ({ fixedActive, editOrderMode, addSectionMode }) => {
    return (
        <div className="flex items-center w-full h-12 pl-10 text-white bg-primary">
            <span
                className={`absolute font-bold transition-all ease-in duration-100 ${
                    fixedActive ? 'pl-16' : 'pl-0'
                }`}
            >
                Actie -{' '}
                {editOrderMode
                    ? 'Volgorde wijzigen'
                    : addSectionMode
                    ? 'Nieuwe onderdelen toevoegen'
                    : ''}
            </span>
        </div>
    )
}

function Heading({ activeHoofdstuk, lineage, isActiveChapter, show }) {
    const text = activeHoofdstuk
        ? 'Hoofdstuk ' +
          lineage.Structuur.Children[activeHoofdstuk].Volgnummer +
          ' - ' +
          lineage.Structuur.Children[activeHoofdstuk].Titel
        : lineage.Titel

    if (!show) return null
    if (isActiveChapter) {
        return <div className="p-6" />
    } else {
        return <h2 className="p-4 text-lg font-bold text-gray-800">{text}</h2>
    }
}

export default EditAddOrderSection
