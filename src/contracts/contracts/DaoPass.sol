// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "./ERC3525.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DaoPass is ERC3525, Ownable {
    address private _signer;
    mapping(address => bool) public isMinted;
    mapping(address => mapping(uint256 => bool)) public voteProposal;
    string private _baseTokenURI;
    struct Voucher {
        uint256 id;
        /* The tokenId  */
        uint256 tokenId;
        /* The amount  */
        uint256 amount;
        /*owner*/
        address owner;
    }

    constructor() ERC3525("DaoPass Token", "HKHN", 2) {
        _signer = msg.sender;
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function queryId() public view returns (bool) {
        return isMinted[msg.sender];
    }

    function blockId() public {
        isMinted[msg.sender] = true;
    }

    function mintToken() public payable {
        require(isMinted[msg.sender] == false, "Duplicate id");
        isMinted[msg.sender] = true;
        _mint(msg.sender, 1, 1);
    }

    function vote(uint256 proposalId, uint256 tokenId) public payable {
        require(voteProposal[msg.sender][proposalId] == false, "Already vote");
        voteProposal[msg.sender][proposalId] = true;
        _mintValue(tokenId, 1);
    }

    function setSigner(address addr) public onlyOwner {
        _signer = addr;
    }

    function getSigner() public view returns (address) {
        return _signer;
    }

    bytes32 private constant salt = 0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558;
    //string private constant EIP712_DOMAIN ="EIP712Domain(string name,string version,uint256 chainId,address verifyingContract,bytes32 salt)";
    bytes32 private constant EIP712_DOMAIN_TYPEHASH =
        0xd87cd6ef79d4e2b95e15ce8abf732db51ec771f1ca2edccf22a46c729ac56472; //keccak256(bytes(EIP712_DOMAIN));

    //string private constant VOUCHER_TYPE =
    //"Voucher(uint256 id,uint256 tokenId,uint256 amount,uint256 expirationTime,address owner)";
    bytes32 private constant VOUCHER_TYPEHASH = 0x4bd317336ea30fdfa31168cda381dacdf9ed1dd92eda94108d28629b6cf9b8c7; //keccak256(bytes(VOUCHER_TYPEHASH));

    function _verifySign(
        Voucher memory voucher,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal view {
        address signer = ecrecover(_hashVoucher(voucher), v, r, s);
        require(_signer == signer, "Invalid signer");
    }

    /// @notice Returns a hash of the given NFTVoucher, prepared using EIP712 typed data hashing rules.
    /// @param voucher An NFTVoucher describing an unminted NFT.
    function _hashVoucher(Voucher memory voucher) internal view returns (bytes32) {
        return keccak256(abi.encodePacked("\x19\x01", _hashDomainSeparator(), _encodeVoucher(voucher)));
    }

    function _encodeVoucher(Voucher memory voucher) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    VOUCHER_TYPEHASH,
                    voucher.id,
                    voucher.tokenId,
                    voucher.amount,
                    voucher.owner
                )
            );
    }

    function _hashDomainSeparator() internal view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    EIP712_DOMAIN_TYPEHASH,
                    keccak256(bytes("DaoPass Token")),
                    keccak256(bytes("1")),
                    _getChainID(),
                    address(this),
                    salt
                )
            );
    }

    /*Since v0.5.12, Solidity provides a CHAINID OPCODE in assembly */
    function _getChainID() internal view returns (uint256) {
        return block.chainid;
    }
}
