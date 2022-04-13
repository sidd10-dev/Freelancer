import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import WalletConnectProvider from "@walletconnect/web3-provider";
import freelancerMarketPlaceAddress from '../../config'
const freelancerMarketPlace = require('../../artifacts/contracts/freelancerMarketPlace.sol/freelancerMarketplace.json')

const form = document.querySelector(".new-project-form")

form.addEventListener('submit', async () => {
    e.preventdefault()
    const Web3Modal = window.Web3Modal.default;
    console.log("ADD")

    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider, // required
            options: {
                infuraId: "6a06b007102c4a509882140d76bf254f" // required
            }
        }
    }

    const web3Modal = new Web3Modal({
        providerOptions
    });

    const provider = await web3Modal.connect()
    const signer = provider.getSigner()
    let contract = new ethers.Contract(freelancerMarketPlaceAddress, freelancerMarketPlace.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()
    let transaction = await contract.listPayment({ value: listingPrice })
    await transaction.wait();

    form.submit()
})

