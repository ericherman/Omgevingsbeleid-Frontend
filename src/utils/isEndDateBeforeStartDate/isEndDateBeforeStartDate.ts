import { isBefore } from 'date-fns'

/**
 * Function to check wether the end validity date is before the start validity date
 * @param {object} crudObject - Contains the object with the validity date properties
 * @returns {boolean} indicating if the end date is before the start date
 */
const isEndDateBeforeStartDate = (crudObject: any) => {
    const startDate = new Date(crudObject.Begin_Geldigheid)
    const endDate = new Date(crudObject.Eind_Geldigheid)

    if (
        crudObject.Eind_Geldigheid === null ||
        crudObject.Eind_Geldigheid === undefined
    ) {
        return false
    } else if (isBefore(endDate, startDate)) {
        return true
    } else {
        return false
    }
}

export default isEndDateBeforeStartDate
