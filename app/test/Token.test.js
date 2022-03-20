const Token = artifacts.require('./Token')
import {tokens} from './helper'

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Token', ([deployer, receiver]) => {

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

        it('transfer test', async() => {
            await token.transfer(receiver, tokens(3)); // Send 3 tokens or 3 ^ 18 wei
            const updatedBalanceSender = await token.balanceOf(deployer)
            const updatedBalanceReceiver = await token.balanceOf(receiver)
            updatedBalanceSender.toString().should.equal(tokens(999997).toString()) // verify balance increased by 3 tokens
            updatedBalanceReceiver.toString().should.equal(tokens(3).toString()) // verify balance decreased by 3 tokens
        })
    })
})