import { createSelector } from 'reselect'
import {get} from 'lodash'

const account = state => get(state, 'web3.account') // lodash performs safety checks. if web3 or web3.account is null, it returns a default value

const tokenLoaded = state => get(state, 
    'token.loaded',
    false
)
// export const tokenLoadedSelector = createSelector(tokenLoaded, tl => tl)

const exchangeLoaded = state => get(state,
    'exchange.loaded',
    false
)
// export const exchageLoadedSelector = createSelector(exchangeLoaded, el => el)

export const contractsLoadedSelector = createSelector(
    tokenLoaded,
    exchangeLoaded,
    (tl, el) => (tl && el)
)

export const accountSelector = createSelector(account, acc => acc)
