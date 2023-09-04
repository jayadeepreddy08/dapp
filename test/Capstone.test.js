const Capstone = artifacts.require('Capstone.sol')

contract('Capstone', (accounts) => {
  before(async () => {
    this.capstone = await Capstone.deployed()
  })

  it('deploys successfully', async () => {
    const address = await this.capstone.address
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
  })

  it('lists users', async () => {
    const userCount = await this.capstone.userCount()
    const user = await this.capstone.user(userCount)
    assert.equal(user.id.toNumber(), userCount.toNumber())
    assert.equal(user.content, 'Checking the project')
    assert.equal(user.joined, false)
    assert.equal(userCount.toNumber(), 1)
  })

  it('creates users', async () => {
    const result = await this.capstone.createUser('jd', 'A new user')
    const userCount = await this.capstone.userCount()
    assert.equal(userCount, 2)
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), 2)
    assert.equal(event.name, 'jd')
    assert.equal(event.content, 'A new user')
    assert.equal(event.joined, false)
  })

  

})