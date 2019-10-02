import React, { Component } from 'react'
import axios from './../../../API/axios'
import {
    faCaretDown,
    faAngleDown,
    faTimes,
    faSearch,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import PopUpAnimatedContainer from './../../PopUpAnimatedContainer'
import objecten from './../ObjectenInformatie'

class PopupBewerkKoppeling extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: this.props.type,
            objecten: [],
            selected: null,
            omschrijving: this.props.bewerkItem.item.Omschrijving || '',
        }
        this.handleChange = this.handleChange.bind(this)
        console.log(this.props)
    }

    handleChange(e) {
        const name = e.target.name
        const value = e.target.value

        this.setState({
            [name]: value,
        })
    }

    render() {
        // const propertyName = objecten[this.state.type].propertyName
        // const crudObject = JSON.parse(JSON.stringify(this.props.crudObject))
        // let actieveKoppelingen = []
        // crudObject[propertyName].forEach(item => {
        //     actieveKoppelingen.push(item.UUID)
        // })

        // const filteredObjecten = this.state.objecten
        //     .filter(item => item.Titel.includes(this.state.zoekFilter))
        //     .filter(item => !actieveKoppelingen.includes(item.UUID))

        return (
            <PopUpAnimatedContainer>
                <div
                    onClick={this.props.togglePopup}
                    className="cursor-pointer absolute right-0 top-0 text-gray-600 px-3 py-2"
                >
                    <FontAwesomeIcon icon={faTimes} />
                </div>
                <h3 className="form-field-label">
                    {/* {
                        objecten[this.props.bewerkItem.propertyName]
                            .volledigeTitel
                    }{' '} */}
                    koppelen
                </h3>

                <p className="form-field-description">
                    Beschrijf de koppeling tussen het nationaal belang '
                    {this.props.bewerkItem.item.data.Titel}' en de
                    beleidsbeslissing '{this.props.titelMainObject}'
                </p>
                <p className="form-field-description mt-4">
                    Beschrijf zo concreet mogelijk de relatie
                </p>
                <textarea
                    value={this.state.omschrijving}
                    required
                    onChange={this.handleChange}
                    name="omschrijving"
                    className="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white hover:border-gray-500 focus:border-gray-500 h-24"
                    type="text"
                />
                <div className="flex justify-between items-center mt-6">
                    <div>
                        <span
                            tabIndex="0"
                            className="text-gray-600 cursor-pointer text-sm underline"
                            onClick={this.props.togglePopup}
                        >
                            Annuleren
                        </span>
                        <span
                            tabIndex="0"
                            className="text-red-600 cursor-pointer text-sm underline ml-4"
                            onClick={() => {
                                this.props.verwijderKoppelingRelatieToe(
                                    this.props.bewerkItem
                                )
                                this.props.verwijderKoppelingFromLocalState(
                                    this.props.bewerkItem
                                )
                                this.props.togglePopup()
                            }}
                        >
                            Verwijderen
                        </span>
                    </div>

                    <div
                        className={`font-bold py-2 px-4 cursor-pointer leading-tight text-sm rounded bg-green-600 text-white ${
                            this.state.omschrijving.length === 0
                                ? `cursor-not-allowed opacity-50`
                                : `hover:underline`
                        }`}
                        tabIndex="0"
                        onClick={e => {
                            if (this.state.omschrijving.length > 0) {
                                this.props.wijzigKoppelingRelatie(
                                    this.props.bewerkItem,
                                    this.state.omschrijving
                                )
                                this.props.wijzigKoppelingRelatieFromLocalState(
                                    this.props.bewerkItem,
                                    this.state.omschrijving
                                )
                                this.props.togglePopup()
                            } else {
                                return
                            }
                        }}
                        onKeyPress={e => {
                            if (
                                e.key === 'Enter' &&
                                this.state.omschrijving.length > 0
                            ) {
                                this.props.wijzigKoppelingRelatie(
                                    this.props.bewerkItem,
                                    this.state.omschrijving
                                )
                                this.props.wijzigKoppelingRelatieFromLocalState(
                                    this.props.bewerkItem,
                                    this.state.omschrijving
                                )
                                this.props.togglePopup()
                            }
                        }}
                    >
                        Wijzigen
                    </div>
                </div>
            </PopUpAnimatedContainer>
        )
    }
}

export default PopupBewerkKoppeling
