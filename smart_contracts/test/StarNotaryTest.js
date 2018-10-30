const StarNotary = artifacts.require('StarNotary')

contract('StarNotary', accounts => {

    beforeEach(async function () {
        this.contract = await StarNotary.new({
            from: accounts[0]
        })
    })

    let name1 = "Star power 103!"
    let name2 = "Star power 104!"
    let cent1 = "ra_032.155"
    let cent2 = "ra_32.155"
    let dec1 = "dec_121.874"
    let dec2 = "dec_21.874"
    let mag1 = "mag_245.978"
    let mag2 = "mag_45.978"
    let story1 = "I love my star"
    let story2 = "I hate my star"

    describe('can create a star', () => {

        beforeEach(async function () {
            try{
                await this.contract.createStar(name1, story1, dec1, mag1, cent1, {
                    from: accounts[0]
                })
            }catch(err){
                console.log("createStar",err);
            }
        })

        it('can create a star and get correct response from tokenIdToStarInfo', async function () {
            let result = await this.contract.tokenIdToStarInfo(1);
            
            let expected = ["Star power 103!", "I love my star", "dec_121.874", "mag_245.978","ra_032.155"]
            assert.deepEqual(result, expected)
        })

        it('can\'t create star with same coordinates', async function () {
            let err = null;
            try {
                await this.contract.createStar(name2, story2, dec1, mag1, cent1, {
                    from: accounts[0]
                })
            } catch (error) {
                err = error
            }
            assert.ok(err instanceof Error)
        })

        it('can create a star and get its status, also return false for nonexits coordinates', async function () {
            assert.isTrue(await this.contract.checkIfStarExist(dec1, mag1, cent1, {
                from: accounts[0]
            }))
            assert.isFalse(await this.contract.checkIfStarExist(dec1, mag2, cent1, {
                from: accounts[0]
            }))
        })

        it('can create anther star and got correct createdStarsId length',async function(){
            await this.contract.createStar(name2, story2, dec2, mag2, cent2, {
                from: accounts[0]
            })
            assert.equal(await this.contract.getCreatedStarsCount(), 2);
        })
    })


    describe('buying and selling stars', () => {

        let user1 = accounts[1]
        let user2 = accounts[2]

        let starPrice = web3.toWei(.01, "ether")
        const starId = 1

        beforeEach(async function () {
            await this.contract.createStar(name1, story1, dec1, mag1, cent1,{
                from: user1
            })
        })

        describe('user1 can sell a star', () => {
            it('user1 can put up their star for sale', async function () {
                await this.contract.putStarUpForSale(starId, starPrice, {
                    from: user1
                })

                assert.equal(await this.contract.starsForSale(starId), starPrice)
            })

            it('user1 gets the funds after selling a star', async function () {
                let starPrice = web3.toWei(.05, 'ether')

                await this.contract.putStarUpForSale(starId, starPrice, {
                    from: user1
                })

                let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user1)
                await this.contract.buyStar(starId, {
                    from: user2,
                    value: starPrice
                })
                let balanceOfUser1AfterTransaction = web3.eth.getBalance(user1)

                assert.equal(balanceOfUser1BeforeTransaction.add(starPrice).toNumber(),
                    balanceOfUser1AfterTransaction.toNumber())
            })
        })

        describe('user2 can buy a star that was put up for sale', () => {
            beforeEach(async function () {
                await this.contract.putStarUpForSale(starId, starPrice, {
                    from: user1
                })
            })

            it('user2 is the owner of the star after they buy it', async function () {
                await this.contract.buyStar(starId, {
                    from: user2,
                    value: starPrice
                })

                assert.equal(await this.contract.ownerOf(starId), user2)
            })

            it('user2 correctly has their balance changed', async function () {
                let overpaidAmount = web3.toWei(.05, 'ether')

                const balanceOfUser2BeforeTransaction = web3.eth.getBalance(user2)
                await this.contract.buyStar(starId, {
                    from: user2,
                    value: overpaidAmount,
                    gasPrice: 0
                })
                const balanceAfterUser2BuysStar = web3.eth.getBalance(user2)

                assert.equal(balanceOfUser2BeforeTransaction.sub(balanceAfterUser2BuysStar), starPrice)
            })
        })
    })
})