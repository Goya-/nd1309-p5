pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 { 

    struct Star {
        string name;
        string story;
        string dec;
        string mag;
        string cent;
    }
    
    mapping(uint => Star) public tokenIdToStarInfo;
    mapping(uint => uint) public starsForSale;

    uint[] public createdStarsId;

    function createStar(string _name, string _story, string _dec, string _mag, string _cent) public payable { 
        require(!checkIfStarExist(_dec,_mag,_cent),"star exits, please check star coordinators");
        Star memory newStar = Star(_name,_story,_dec,_mag,_cent);
        
        uint tokenId = createdStarsId.length + 1;
        createdStarsId.push(tokenId);
        tokenIdToStarInfo[tokenId] = newStar;

        _mint(msg.sender, tokenId);
    }

    function putStarUpForSale(uint _tokenId, uint _price) public { 
        require(this.ownerOf(_tokenId) == msg.sender);

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint _tokenId) public payable { 
        require(starsForSale[_tokenId] > 0);

        uint starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);

        starOwner.transfer(starCost);

        if(msg.value > starCost) { 
            msg.sender.transfer(msg.value - starCost);
        }
    }

    function checkIfStarExist(string _dec,string _mag,string _cent) public view returns(bool){
        for(uint i = 0; i < createdStarsId.length; i++){
            Star memory tempStar = tokenIdToStarInfo[createdStarsId[i]];
            if(compareStirngs(tempStar.dec,_dec) && compareStirngs(tempStar.mag,_mag) && compareStirngs(tempStar.cent,_cent)){
                return true;
            } 
        }
        return false;
    }

    function compareStirngs(string a,string b) internal pure returns(bool){
        return keccak256(abi.encodePacked(a))==keccak256(abi.encodePacked(b));
    }

    function getCreatedStarsCount() public view  returns(uint){
        return createdStarsId.length;
    }
}