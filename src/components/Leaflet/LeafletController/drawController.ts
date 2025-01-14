import {
    useLeafletContext,
    createElementHook,
    createLeafComponent,
} from '@react-leaflet/core'
import leaflet, { Control } from 'leaflet'
import { useCallback, useEffect, useRef } from 'react'

export const createControlComponent = (createInstance: any) => {
    function createElement(
        props: Control.DrawConstructorOptions,
        context: any
    ) {
        const { layerContainer } = context
        const { position } = props
        const options = {
            position,
            edit: {
                featureGroup: layerContainer,
            },
        }

        return { instance: createInstance(options), context }
    }
    const useElement = createElementHook(createElement)
    const useControl = createControlHook(useElement)
    return createLeafComponent(useControl)
}

const createControlHook = (useElement: any) => {
    return function useLeafletControl(props: any) {
        const context = useLeafletContext()
        const elementRef = useElement(props, context)
        const { instance } = elementRef.current
        const positionRef = useRef(props.position)
        const { position, onCreated, onEdit } = props

        const onDrawCreate = useCallback(
            e => {
                instance._toolbars.edit._toolbarContainer.classList.remove(
                    'hidden'
                )

                /**
                 * Remove all markers and polygons from map
                 */
                context.map.eachLayer((layer: any) => {
                    if (!!layer._latlng || !!layer._svgSize) {
                        context.map.removeLayer(layer)
                    }
                })

                context.layerContainer?.addLayer(e.layer)
                onCreated(e)
            },
            [
                context.layerContainer,
                context.map,
                onCreated,
                instance._toolbars.edit,
            ]
        )

        const onDrawDelete = useCallback(() => {
            instance._toolbars.edit._toolbarContainer.classList.add('hidden')
        }, [instance._toolbars.edit])

        useEffect(
            function addControl() {
                instance.addTo(context.map)

                context.map.on(leaflet.Draw.Event.CREATED, onDrawCreate)
                context.map.on(leaflet.Draw.Event.DELETED, onDrawDelete)

                if (onEdit) {
                    context.map.on(leaflet.Draw.Event.EDITRESIZE, onEdit)
                    context.map.on(leaflet.Draw.Event.EDITMOVE, onEdit)
                }

                return function removeControl() {
                    context.map.off(leaflet.Draw.Event.CREATED, onDrawCreate)
                    context.map.off(leaflet.Draw.Event.DELETED, onDrawDelete)

                    if (onEdit) {
                        context.map.off(leaflet.Draw.Event.EDITRESIZE, onEdit)
                        context.map.off(leaflet.Draw.Event.EDITMOVE, onEdit)
                    }

                    instance.remove()
                }
            },
            [context.map, instance, onDrawCreate, onDrawDelete, onEdit]
        )

        useEffect(
            function updateControl() {
                if (position != null && position !== positionRef.current) {
                    instance.setPosition(position)
                    positionRef.current = position
                }
            },
            [instance, position]
        )

        return elementRef
    }
}
