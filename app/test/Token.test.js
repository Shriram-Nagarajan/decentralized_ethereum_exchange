const Token = artifacts.require('./Token')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Token', (accounts) => {
    describe('deployment', async() => {

        it('contract has a name', async() => {
            // Deploy a new version of Token contract
            // to the network, getting an instance of Token
            // that represents the newly deployed instance.
            const token = await Token.new()
            const actualName = await token.name()
            actualName.should.equal('My Name')

        })
    })
})