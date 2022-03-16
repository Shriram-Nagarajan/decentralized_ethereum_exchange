const Token = artifacts.require('./Token')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Token', (accounts) => {

    // Expected values
    const name = 'Alpha Coin'
    const symbol = 'ALPHA'
    const decimals = '18'
    const totalSupply = '1000000000000000000000000'

    describe('deployment', async() => {
        

        it('contract has the name', async() => {
            // Deploy a new version of Token contract
            // to the network, getting an instance of Token
            // that represents the newly deployed instance.
            const token = await Token.new()
            const actualName = await token.name()
            actualName.should.equal(name)

        })

        it('contract has the symbol', async() => {
            // Deploy a new version of Token contract
            // to the network, getting an instance of Token
            // that represents the newly deployed instance.
            const token = await Token.new()
            const actualSymbol = await token.symbol()
            actualSymbol.should.equal(symbol)

        })

        it('contract has the decimals', async() => {
            // Deploy a new version of Token contract
            // to the network, getting an instance of Token
            // that represents the newly deployed instance.
            const token = await Token.new()
            const actualDecimals = await token.decimals()
            actualDecimals.toString().should.equal(decimals)

        })

        it('contract has the total supply', async() => {
            // Deploy a new version of Token contract
            // to the network, getting an instance of Token
            // that represents the newly deployed instance.
            const token = await Token.new()
            const actualTotalSupply = await token.totalSupply()
            actualTotalSupply.toString().should.equal(totalSupply)

        })
    })
})