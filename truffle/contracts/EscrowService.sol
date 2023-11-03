//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract EscrowFactory {
    mapping(address => address[]) public userToEscrow;
    event CreateLog(address addr, uint256 timestamp);
    event AddLog(address childAddr);

    function createEscrow(
        address toAddr,
        uint256 withdrawalDuration
    ) public
    {
        Escrow escrow = new Escrow(
            msg.sender,
            toAddr,
            withdrawalDuration,
            false
        );
        userToEscrow[msg.sender].push(address(escrow));
        userToEscrow[toAddr].push(address(escrow));
        emit CreateLog(address(escrow), block.timestamp);
    }

    function getUserToEscrow() public view returns (address[] memory) {
        return userToEscrow[msg.sender];
    }
}

contract Escrow {
    address private fromAddr;
    address private toAddr;
    address private withdrawalAddr;
    uint256 private withdrawalDuration;
    bool private withdrawn;
    address private owner;
    uint256 private revertTimestamp;
    bool private reverted;

    event checkint(uint256 amt);
    event checkaddr(address amt);
    event Deposit(address sender, uint256 amount);

    constructor(
        address _fromAddr,
        address _toAddr,
        uint256 _withdrawalDuration,
        bool _withdrawn
    ) {
        fromAddr = _fromAddr;
        toAddr = _toAddr;
        withdrawalAddr = _toAddr;
        withdrawalDuration = _withdrawalDuration;
        withdrawn = _withdrawn;
        owner = _fromAddr;
        revertTimestamp = block.timestamp + withdrawalDuration;
    }

    function deposit() public payable {
        require(owner == msg.sender && owner == fromAddr, "Not owner.");
        require(msg.value > 0, "Deposit must be more than 0.");
        emit Deposit(msg.sender, msg.value);

        transferOwner();
    }

    function withdraw() public {
        if (block.timestamp >= revertTimestamp) {
            withdrawalAddr = fromAddr;
        }
        require(
            msg.sender == withdrawalAddr,
            "This address is not permitted to withdraw."
        );
        require(!withdrawn, "Balance has already been withdrawn");
        require(address(this).balance > 0, "No balance in this contract.");

        payable(withdrawalAddr).transfer(address(this).balance);
        withdrawn = true;
    }

    function transferOwner() private {
        require(owner == fromAddr, "Owner already changed.");
        owner = address(this);
    }

    function getBalance() public view returns (uint256 balance) {
        return address(this).balance;
    }

    function getWithdrawalPermission()
        public
        view
        returns (bool withdrawalPermission)
    {
        if (block.timestamp >= revertTimestamp) {
            return (msg.sender == fromAddr);
        } else {
            return (msg.sender == toAddr);
        }
    }
}
