import React, { useState, useEffect, useContext } from "react";
// import "./item.css";
import axios from "axios";
import { useParams } from "react-router";
import { BNPL_ABI } from "../assets/constants";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import UserContext from "../context/userContext";

const Item = () => {
  const REACT_APP_SERVER_URL = import.meta.env.VITE_SERVER_URL
  const [nftData, setNftData] = useState([]);
  const [currState, setCurrState] = useState("");
  const { tokenAddress, tokenId } = useParams();

  const {address, bnplInitialize} = useContext(UserContext)

  useEffect(() => {
    axios(
      `${REACT_APP_SERVER_URL}/assets/${tokenAddress}/${tokenId}`
    ).then(({ data }) => {
      console.log("datacollection", data[0]);
      setNftData(data[0]);
      setCurrState(data[0].state)
    });
  }, [tokenAddress, tokenId]);

  async function marginSale() {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    const chainId = await window.ethereum.request({ method: "eth_chainId" });

    if (accounts.length === 0) {
      alert("Please connect Wallet");
      return;
    }
    console.log("chainId: ", chainId);
    if (chainId !== "0x1f91") {
      alert("Please switch to Shardeum Testnet");

      return;
    }

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const owner = await signer.getAddress();
      const contract = new ethers.Contract(
        REACT_APP_BNPL_CONTRACT_ADDRESS,
        BNPL_ABI,
        signer
      );

      const price = (nftData.price * 30) / 100;

      const response = await contract
        .marginSale(tokenAddress, tokenId, {
          value: ethers.utils.parseEther(price.toString()),
        })
      
        const confirmedTransaction = await provider.waitForTransaction(
          response.hash,
          1
        ); 
  
        if (confirmedTransaction.status === 1) {
          axios.patch(`${REACT_APP_SERVER_URL}/state`, {
            state: "BNPL_LOAN_ACTIVE",
            owner: owner,
            tokenId: tokenId,
            contractAddress: tokenAddress,
          });
  
          setCurrState("BNPL_LOAN_ACTIVE");
        } else {
          console.log("Failed...");
        }

    } else alert("Sorry no wallet found");
  }

  return (
    <div className="item flex px-6 text-white min-h-screen h-full justify-center items-center">
      <div className="item-image flex flex-col mt-40 border-r border-gray-200">
        <img
          src={`https://ipfs.io/ipfs/${
            nftData.metadata?.imageURI.split("//")[1]
          }`}
          alt=""
          className="rounded-15 w-80 max-h-80"
        />
        <div className="mx-auto item-content-title">
          <h1 className="font-bold text-28 ">
            {nftData.metadata?.name} #{nftData?.tokenId}
          </h1>
        </div>
      </div>
      <div className="item-content flex justify-start items-center flex-col m-5 relative">
        <div className=" flex-col mt-4 w-full px-8">
          <div className="p-4 border border-white border-b-0 py-8">
            Description:{" "}
            <span className="font-semibold">
              {nftData.metadata?.description}
            </span>
          </div>
          <div className="p-4 border border-white border-b-0 py-8">
            Owner: <span className="font-semibold">{nftData.owner}</span>
          </div>
          <div className="p-4 border border-white text-white">
            <div className="flex justify-around my-4">
              <div className="flex flex-col items-center">
                <div>Price</div>
                <div className="text-5xl font-bold">{nftData.price} ETH</div>
              </div>
              <div className="flex flex-col items-center">
                <div>Downpayment</div>
                <div className="text-5xl font-bold">30%</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto my-8 item-content-buy mb-4">
          {(nftData?.state === "LISTED" ||
            nftData?.state === "MARGIN_LISTED") && (
            <div>
              <div className="relative inline-block">
                <button
                  className="primary-btn mb-0"
                  onClick={() => {
                    nftData?.state === "LISTED" && bnplInitialize(nftData);
                    nftData?.state === "MARGIN_LISTED" && marginSale();
                  }}
                >
                  {" "}
                  Buy Now Pay Later
                </button>
              </div>
              {/* <button className='primary-btn'>Make Offer</button> */}
            </div>
          )}

          {currState === "BNPL_LOAN_ACTIVE" && (
            <Link
              to={`/user/${address}`}
              state={{ data: address }}
            >
              <button className="primary-btn">Checkout Sale</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Item;
