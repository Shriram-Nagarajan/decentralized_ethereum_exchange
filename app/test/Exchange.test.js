import {tokens, EVM_REVERT, ETHER_ADDRESS, ether} from './helper'

const Exchange = artifacts.require("./Exchange")
const Token = artifacts.require('./Token')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Exchange', ([deployer, feeAccount, user1]) => {

    let token, exchange
    const feePercent = 10

    beforeEach(async() => {
        // Deploy token
        token = await Token.new()
        // Transfer some tokens to user1
        await token.transfer(user1, tokens(100), {from: deployer})
        // Deploy exchange
        exchange = await Exchange.new(feeAccount, feePercent)
    })

    describe('deployment', () => {
        
        it('tracks the fee account', async() => {
            const result = await exchange.feeAccount()
            result.should.eq(feeAccount)
        })

        it('tracks the fee percent', async() => {
            const result = await exchange.feePercent()
            result.toString().should.eq(feePercent.toString())
        })

    })

    describe('withdrawing ether', () => {

        let result, amount

        beforeEach(async() => {
            amount = ether(1)
            result = await exchange.depositEther({from: user1, value: amount})
        })

        describe('success', () => {

            beforeEach(async() => {
                amount = ether(1)
                result = await exchange.withdrawEther(amount, {from: user1})
            })
    
            it('tracks the ether withdraw', async() => {
                const balance = await exchange.tokens(ETHER_ADDRESS, user1)
                balance.toString().should.eq('0')
            })

            it('emits a withdraw event', async() => {
                const log = result.logs[0]
                log.event.should.equal('Withdraw', 'event name is correct')
                const event = log.args
                event.token.toString().should.eq(ETHER_ADDRESS, 'from is correct')
                event.user.toString().should.eq(user1, 'to is correct')
                event.amount.toString().should.eq(amount.toString(), 'value is correct')
                event.balance.toString().should.eq('0', 'value is correct')
            })

        })
        

        describe('failure', () => {
            it('rejects insufficient balances', async() => {
                // Deposit tokens without approval
                await exchange.withdrawEther(ether(1000), {from: user1}).should.be.rejectedWith(EVM_REVERT)
            })
        })

    })

    describe('depositing ether', () => {
        let result, amount
        beforeEach(async() => {
            amount = ether(1)
            result = await exchange.depositEther({from: user1, value: amount})
        })

        it('tracks the ether deposit', async() => {
            const balance = await exchange.tokens(ETHER_ADDRESS, user1)
            balance.toString().should.eq(amount.toString())
        })

        it('emits a deposit event', async() => {
            const log = result.logs[0]
            log.event.should.equal('Deposit', 'event name is correct')
            const event = log.args
            event.token.toString().should.eq(ETHER_ADDRESS, 'from is correct')
            event.user.toString().should.eq(user1, 'to is correct')
            event.amount.toString().should.eq(amount.toString(), 'value is correct')
            event.balance.toString().should.eq(amount.toString(), 'value is correct')
        })

    })

    describe('withdrawing token', () => {

        let result, amount

        beforeEach(async() => {
            amount = tokens(10)
            await token.approve(exchange.address, amount, {from: user1})
            result = await exchange.depositToken(token.address, amount, {from: user1})
        })

        describe('success', () => {

            beforeEach(async() => {
                result = await exchange.withdrawToken(token.address, amount, {from: user1})
            })

            it('tracks the token withdraw', async() => {
                const balance = await exchange.tokens(token.address, user1)
                balance.toString().should.eq('0')
            })

            it('emits a withdraw event', async() => {
                const log = result.logs[0]
                log.event.should.equal('Withdraw', 'event name is correct')
                const event = log.args
                event.token.toString().should.eq(token.address, 'from is correct')
                event.user.toString().should.eq(user1, 'to is correct')
                event.amount.toString().should.eq(amount.toString(), 'value is correct')
                event.balance.toString().should.eq('0', 'value is correct')
            })

        })
        

        describe('failure', () => {
            it('rejects insufficient balances', async() => {
                // Deposit tokens without approval
                await exchange.withdrawToken(token.address, ether(1000), {from: user1}).should.be.rejectedWith(EVM_REVERT)
            })

            it('rejects ether withdraw', async() => {
                // Deposit tokens without approval
                await exchange.withdrawToken(ETHER_ADDRESS, tokens(10), {from: user1}).should.be.rejectedWith(EVM_REVERT)
            })
        })

    })

    describe('depositing tokens', () => {

        let amount, result

        
        describe('success', () => {
            
            beforeEach(async() => {
                amount = tokens(10)
                await token.approve(exchange.address, amount, {from: user1})
                result = await exchange.depositToken(token.address, tokens(10), {from: user1})
            })

            it('tracks the token deposit', async() => {
                // Check exchange token balance
                let balance
                balance = await token.balanceOf(exchange.address)
                balance.toString().should.eq(amount.toString())
                // FIXME: verify token balance updated in exchange contract
                balance = await exchange.tokens(token.address, user1)
                balance.toString().should.eq(amount.toString())
            })

            it('emits a deposit event', async() => {
                const log = result.logs[0]
                log.event.should.equal('Deposit', 'event name is correct')
                const event = log.args
                event.token.toString().should.eq(token.address, 'from is correct')
                event.user.toString().should.eq(user1, 'to is correct')
                event.amount.toString().should.eq(amount.toString(), 'value is correct')
                event.balance.toString().should.eq(amount.toString(), 'value is correct')
            })

        })

        describe('fallback', () => {

            it('reverts when ether is sent to the the exchange', async() => {
                // Deposit tokens without approval
                await exchange.sendTransaction({from: user1, value: ether(10)}).should.be.rejectedWith(EVM_REVERT);
            })

        })

        describe('failure', () => {

            it('rejects insufficient balances', async() => {
                // Deposit tokens without approval
                await exchange.depositToken(token.address, tokens(10), {from: user1}).should.be.rejectedWith(EVM_REVERT)
            })

            it('rejects ether deposit', async() => {
                // Deposit tokens without approval
                await exchange.depositToken(ETHER_ADDRESS, tokens(10), {from: user1}).should.be.rejectedWith(EVM_REVERT)
            })

        })

    })

    describe('checking balances', () => {
        
        beforeEach(async() => {
            await exchange.depositEther({from:user1, value: ether(1)})
        })

        it('returns user balance', async() => {
            const result = await exchange.balanceOf(ETHER_ADDRESS, user1)
            result.toString().should.eq(ether(1).toString())
        })

    })

    describe('making orders', () => {
        
        beforeEach(async() => {
            await exchange.makeOrder(token.address, tokens(1), ETHER_ADDRESS, ether(1), {from:user1})
        })

        it('tracks the newly created order', async() => {
            const result = await exchange.orderCount()
            result.toString().should.eq('1')
        })

    })

})