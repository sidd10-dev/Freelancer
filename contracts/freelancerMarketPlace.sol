// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Counters.sol";

contract freelancerMarketplace {
    using Counters for Counters.Counter;
    Counters.Counter private _projectIds;
    Counters.Counter private _bidIds;
    address payable owner = payable(0x0FB0Cb28E3cddeB1e8A1714Dd7eb986dC7483675);

    struct project {
        uint256 projectid;
        string title;
        string desc;
        uint256 maxPrice;
        uint256 minBid;
        address payable customer;
        address payable freelancer;
        bool bidComplete;
    }

    struct bid {
        uint256 bidId;
        address payable customer;
        address payable freelancer;
        uint256 bidPrice;
        uint256 projectid;
    }

    mapping(uint256 => bid[]) internal projectToBidsArray;
    uint256 listingPrice = 0.025 ether;
    project[] internal projects;
    project[] internal completedProjects;

    function getListingPrice() public view returns(uint256) {
        return listingPrice;
    }

    function createProject(string memory title, string memory desc, uint256 maxPrice) public{
        _projectIds.increment();
        projects.push(project(
            _projectIds.current(),
            title,
            desc,
            maxPrice,
            0,
            payable(msg.sender),
            payable(address(0)),
            false
        ));
    }

    function retrieveIncompleteProjects() public view returns(project[] memory) {
        uint256 n = _projectIds.current();
        uint256 c = 0;
        for(uint256 i=0;i<n;i++) {
            if(!projects[i].bidComplete) {
                c++;
            }    
        } 
        project[] memory p = new project[](c);
        c=0;
        for(uint256 i=0;i<n;i++) {
            if(!projects[i].bidComplete) {
                project storage temp = projects[i];
                p[c] = temp;
                c++;
            }
        }
        return p;
    }

    function retrieveMyIncompleteProjects() public view returns(project[] memory) {
        uint256 n = _projectIds.current();
        uint256 c = 0;
        for(uint256 i=0;i<n;i++) {
            if(projects[i].customer == msg.sender) {
                c++;
            }
        }
        project[] memory p = new project[](c);
        c=0;
        for(uint256 i=0;i<n;i++) {
            if(projects[i].customer == msg.sender) {
                p[c++] = projects[i];
            }
        }
        return p;
    }

    // function closeProject(uint256 pid) public {
    //     uint256 n = _projectIds.current();
    //     for(uint256 i=0;i<n;i++) {
    //         if(projects[i].projectid == pid && projects[i].bidComplete) {
    //             projects[i].complete = true;
    //             break;
    //         }
    //     }
    // }

    function createBid(uint256 pid, uint256 bidp) public {
        _bidIds.increment();
        project memory p;
        uint256 n = _projectIds.current();
        for(uint256 i=0;i<n;i++) {
            if(projects[i].projectid == pid && !(projects[i].bidComplete)) {
                p = projects[i];
                break;
            }
        }
        address payable cust = payable(p.customer); 
        projectToBidsArray[pid].push(bid(
            _bidIds.current(),
            cust,
            payable(msg.sender),
            bidp,
            pid
        ));
    }

    function retrieveBids(uint256 pid) public view returns(bid[] memory) {
        return projectToBidsArray[pid];    
    }

    function selectBid(uint256 bidId,uint256 pid) payable public {
        bid[] memory projectBids = projectToBidsArray[pid];
        uint256 n = _projectIds.current();
        for(uint256 i=0;i<projectBids.length;i++) {
            if(projectBids[i].bidId == bidId) {
                project memory p;
                for(uint256 j=0;j<n;j++) {
                    if(projectBids[i].projectid == projects[j].projectid) {
                        projects[j].bidComplete = true;
                        p = projects[j];
                    }
                }
                uint256 price = projectBids[i].bidPrice;
                require(msg.value == price,"Amount bid not equal to amount sent");
                projectBids[i].freelancer.transfer(msg.value);
                completedProjects.push(p);
            }
        }
    }

    function listPayment() payable public {
        require(msg.value == listingPrice, "Price must be equal to listing price");
        payable(owner).transfer(listingPrice);
    }
}
