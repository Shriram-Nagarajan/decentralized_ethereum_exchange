const Token = artifacts.require('./Token')
import {tokens} from './helper'

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Token', ([deployer, receiver, exchange]) => {

    // Expected values
    const name = 'Alpha Coin'
    const symbol = 'ALPHA'
    const decimals = '18'
    const totalSupply = tokens(1000000).toString()

    let token

    beforeEach(async() => {
        token = await Token.new()
    })

    describe('deployment', async() => {
        

        it('contract has the name', async() => {
            // Deploy a new version of Token contract
            // to the network, getting an instance of Token
            // that represents the newly deployed instance.
            const actualName = await token.name()
            actualName.should.equal(name)

        })

        it('contract has the symbol', async() => {
            // Deploy a new version of Token contract
            // to the network, getting an instance of Token
            // that represents the newly deployed instance.
            const actualSymbol = await token.symbol()
            actualSymbol.should.equal(symbol)

        })

        it('contract has the decimals', async() => {
            // Deploy a new version of Token contract
            // to the network, getting an instance of Token
            // that represents the newly deployed instance.
            const actualDecimals = await token.decimals()
            actualDecimals.toString().should.equal(decimals)

        })

        it('contract has the total supply', async() => {
            // Deploy a new version of Token contract
            // to the network, getting an instance of Token
            // that represents the newly deployed instance.
            const actualTotalSupply = await token.totalSupply()
            actualTotalSupply.toString().should.equal(totalSupply.toString())

        })

        it('assigns the total supply to the deployer', async() => {
            const balance = await token.balanceOf(deployer);
            balance.toString().should.equal(totalSupply.toString());
        })

    })

    describe('sending tokens', async() => {

        let result, amount

        beforeEach(async() => {
            amount = tokens(3)
        })
        
        describe('success', async() => {
            


            // beforeEach(async() => {
            //     amount = tokens(3)
            // })
        
            it('verify tokens transferred', async() => {
                result = await token.transfer(receiver, amount, {from: deployer}) // Send 3 tokens or 3 ^ 18 wei
                const updatedBalanceSender = await token.balanceOf(deployer)
                const updatedBalanceReceiver = await token.balanceOf(receiver)
                updatedBalanceSender.toString().should.equal(tokens(999997).toString()) // verify balance increased by 3 tokens
                updatedBalanceReceiver.toString().should.equal(amount.toString()) // verify balance decreased by 3 tokens
            })
        
            it('emits a transfer event', async() => {
                const log = result.logs[0]
                log.event.should.equal('Transfer', 'event name is correct')
                const event = log.args
                event.from.toString().should.eq(deployer, 'from is correct')
                event.to.toString().should.eq(receiver, 'to is correct')
                event.value.toString().should.eq(amount.toString(), 'value is correct')
            })
    
        })
        
        describe('failure', async() => {
    
            it('rejects insufficient balances', async() => {
                let invalidAmount
                invalidAmount = tokens(100000000)
                await token.transfer(receiver, invalidAmount).should.be.rejectedWith('VM Exception while processing transaction: revert')
            })

            it('rejects invalid recipients', async() => {
                await token.transfer(0x0, tokens(100)).should.be.rejected
            })
        })

    })
    
    describe('approving tokens', async() => {

        let result, amount

        beforeEach(async() => {
            amount = tokens(100)
            result = await token.approve(exchange, amount)
        })

        describe('success', async() => {

            it('allocates an allowance for delegated token spending on an exchange', async() => {
                const allowance = await token.allowance(deployer, exchange)
                allowance.toString().should.eq(amount.toString())
            })

            it('emits an approval event', async() => {
                const log = result.logs[0]
                log.event.should.equal('Approval', 'event name is correct')
                const event = log.args
                event.owner.toString().should.eq(deployer, 'owner is correct')
                event.spender.toString().should.eq(exchange, 'spender is correct')
                event.value.toString().should.eq(amount.toString(), 'value is correct')
            })

        })

        describe('failure', async() => {

            it('rejects invalid spenders', async() => {
                await token.approve(0x0, tokens(100)).should.be.rejected
            })
        })
    })

    describe('delegated token transfer', async() => {

        let result, amount
        beforeEach(async() => {
            amount = tokens(3)
            await token.approve(deployer, 100)
        })
        
        describe('success', async() => {
            
            // FIXME: beforeEach hook fails
            beforeEach(async() => {
                result = await token.transferFrom(deployer, receiver, amount, {from: exchange}) // Send 3 tokens or 3 ^ 18 wei
            })
        
            // it('verify tokens transferred', async() => {
            //     const updatedBalanceSender = await token.balanceOf(deployer)
            //     const updatedBalanceReceiver = await token.balanceOf(receiver)
            //     updatedBalanceSender.toString().should.equal(tokens(999997).toString()) // verify balance increased by 3 tokens
            //     updatedBalanceReceiver.toString().should.equal(amount.toString()) // verify balance decreased by 3 tokens
            // })
        
            // it('emits a transfer event', async() => {
            //     const log = result.logs[0]
            //     log.event.should.equal('Transfer', 'event name is correct')
            //     const event = log.args
            //     event.from.toString().should.eq(deployer, 'from is correct')
            //     event.to.toString().should.eq(receiver, 'to is correct')
            //     event.value.toString().should.eq(amount.toString(), 'value is correct')
            // })
    
        })
        
        describe('failure', async() => {
    
            it('rejects insufficient balances', async() => {
                let invalidAmount
                invalidAmount = tokens(100000000)
                await token.transferFrom(deployer, receiver, invalidAmount, {from: exchange}).should.be.rejectedWith('VM Exception while processing transaction: revert')
            })

            it('rejects invalid recipients', async() => {
                await token.transferFrom(deployer, 0x0, amount).should.be.rejected
            })
        })

    })
    


})