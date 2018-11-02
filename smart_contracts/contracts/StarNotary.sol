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
    mapping (bytes32 => bool) starHashToExist;

    uint[] public createdStarsId;

    function createStar(string _name, string _story, string _dec, string _mag, string _cent) public payable { 
        require(!checkIfStarExist(_dec,_mag,_cent),"star exits, please check star coordinators");
        Star memory newStar = Star(_name,_story,_dec,_mag,_cent);
        
        uint tokenId = createdStarsId.length + 1;
        createdStarsId.push(tokenId);
        tokenIdToStarInfo[tokenId] = newStar;

        starHashToExist[calStringHash(_dec,_mag,_cent)] = true;
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
        bytes32 _newStarHash = calStringHash(_dec,_mag,_cent);
        return starHashToExist[_newStarHash]; 
    }

    function calStringHash(string a,string b,string c) internal pure returns(bytes32){
        return keccak256(abi.encodePacked(a,b,c));
    }

    function getCreatedStarsCount() public view  returns(uint){
        return createdStarsId.length;
    }
}