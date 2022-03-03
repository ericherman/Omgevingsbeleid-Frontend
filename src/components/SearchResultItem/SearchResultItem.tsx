import { FC } from 'react'
import { Link } from 'react-router-dom'

import {
    GetSearch200ResultsItem,
    GetSearchGeo200ResultsItem,
} from '@/api/fetchers.schemas'
import useSearchParam from '@/hooks/useSearchParam'
import { DimensionType } from '@/types/dimensions'
import getDimensionsConstants from '@/utils/getDimensionsConstants'

interface SearchResultItem {
    item: GetSearch200ResultsItem | GetSearchGeo200ResultsItem
    searchQuery: any
}

const SearchResultItem: FC<SearchResultItem> = ({ item, searchQuery }) => {
    const { get } = useSearchParam()
    const [paramTextQuery] = get('query')

    const highlightString = (
        text: string | undefined,
        query: string | null
    ) => {
        if (!text) {
            return null
        } else if (!query) {
            return {
                __html: text,
            }
        }

        const wordsInQuery = query.split(' ').filter(word => word.length >= 4)
        const markedText = wordsInQuery.reduce((acc, word) => {
            const regex = new RegExp(word, 'gi')
            return acc.replace(
                regex,
                `<mark class="marked-red" data-testid="marker">$&</mark>`
            )
        }, text)

        return {
            __html: markedText,
        }
    }

    const content = {
        Titel: paramTextQuery
            ? highlightString(item.Titel, paramTextQuery.toString())
            : { __html: item.Titel || '' },
        Omschrijving: paramTextQuery
            ? highlightString(item.Omschrijving, paramTextQuery.toString())
            : { __html: item.Omschrijving || '' },
    }

    const type = item.Type
    if (!type) return null

    const dimensieContants = getDimensionsConstants(type as DimensionType)
    const overzichtURL = dimensieContants.SLUG_OVERVIEW
    const titleSingular = dimensieContants.TITLE_SINGULAR

    return (
        <li
            className={`py-4 md:pr-8 transition-colors duration-100 ease-in bg-white border-gray-300 group`}
            key={item.UUID}>
            <Link
                className="group"
                to={`/detail/${overzichtURL}/${item.UUID}#${searchQuery}`}>
                <span
                    className="block text-sm opacity-75 text-pzh-blue"
                    data-test="search-result-type">
                    {titleSingular}
                </span>
                {content.Titel ? (
                    <h2
                        className="block mt-1 text-lg font-bold group-hover:text-pzh-green text-pzh-blue group-hover:underline"
                        dangerouslySetInnerHTML={content.Titel}
                    />
                ) : null}
                {content.Omschrijving ? (
                    <p
                        className="mt-2 line-clamp-4"
                        dangerouslySetInnerHTML={content.Omschrijving}
                        style={{ maxHeight: 120 }}
                    />
                ) : (
                    <p className="mt-2 italic">
                        Er is nog geen omschrijving voor deze
                        {' ' + titleSingular.toLowerCase()}
                    </p>
                )}
            </Link>
        </li>
    )
}

export default SearchResultItem
