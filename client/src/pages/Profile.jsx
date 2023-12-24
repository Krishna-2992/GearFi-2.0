import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import userProfile from "../assets/profile.jpeg";
import { useParams } from "react-router";
import { AiOutlineArrowRight } from "react-icons/ai";

const Profile = () => {
  const REACT_APP_SERVER_URL = import.meta.env.VITE_SERVER_URL
  const { userAddress } = useParams();
  const [listings, setListings] = React.useState(false);
  const [nftData, setNftData] = useState(null);
  let numOfListed = 0;
  let numOfNFTs = 0;

  useEffect(() => {
    console.log("working");
    console.log(
      `${
        REACT_APP_SERVER_URL
      }/assets?owner=${userAddress.toLowerCase()}`
    );
    axios(
      `${
        REACT_APP_SERVER_URL
      }/assets?owner=${userAddress.toLowerCase()}`
    ).then(({ data }) => {
      setNftData(data);
    });
  }, [userAddress]);

  console.log("datacollection ", nftData);
  return (
    <div className="text-white mt-20 h-full" id="main">
      <div className="flex flex-col items-center">
        <img src={userProfile} alt="" className="w-24 mt-8 rounded-full" />
        <div className=" text-4xl font-bold mb-2">
          {userAddress.slice(0, 4)}...{userAddress.slice(-4)}
        </div>
      </div>
      <div className="flex justify-start">
        <div
          className={`cursor-pointer m-4 mr-8 text-3xl font-semibold ${
            !listings ? "text-red-300" : ""
          }`}
          onClick={() => setListings(false)}
        >
          My NFTs
        </div>
        <div
          className={`cursor-pointer m-4 mr-8 text-3xl font-semibold ${
            listings ? "text-red-300" : ""
          }`}
          onClick={() => setListings(true)}
        >
          Listings
        </div>
      </div>
      {!listings && (
        <div className="grid grid-cols-5 m-2">
          {nftData?.map((nft) => {
            if (!(nft.state === "LISTED" || nft.state === "MARGIN_LISTED"))
            numOfNFTs ++
            if (!(nft.state === "LISTED" || nft.state === "MARGIN_LISTED"))
            return (
              <Link
                to={`/account/${nft.contractAddress}/${nft.tokenId}`}
                state={{ data: nft }}
              >
                
                <div className="flex flex-col m-2 mt-8 w-56 h-84 border-2 border-red-200 relative rounded-xl">
                  <div className="card--badge text-black">{nft.state}</div>
                  <img
                    src={`https://ipfs.io/ipfs/${
                      nft.metadata?.imageURI.split("//")[1]
                    }`}
                    alt=""
                    className="w-64 h-48 rounded-xl"
                  />
                  <div className="flex flex-col mt-0 p-4">
                    <div className="font-bold mb-2 flex items-center justify-between">
                      <div>
                        {nft.metadata?.name} #{nft.tokenId}
                      </div>
                      <div>
                        <AiOutlineArrowRight className="mr-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {listings && (
        <div className="grid grid-cols-5 m-2">
          {nftData?.map((nft) => {
            if (nft.state === "LISTED" || nft.state === "MARGIN_LISTED")
            numOfListed ++
            if (nft.state === "LISTED" || nft.state === "MARGIN_LISTED")
              return (
                
                <Link
                  to={`/account/${nft.contractAddress}/${nft.tokenId}`}
                  state={{ data: nft }}
                >
                   
                  <div className="flex flex-col m-2 mt-8 w-56 h-84 border-2 border-red-200 relative rounded-xl">
                    <div className="card--badge text-black">{nft.state}</div>
                  
                    <img
                      src={`https://ipfs.io/ipfs/${
                        nft.metadata?.imageURI.split("//")[1]
                      }`}
                      alt=""
                      className="w-64 h-48 rounded-xl"
                    />
                    <div className="flex flex-col mt-0 p-4">
                      <div className="font-bold mb-2 flex items-center justify-between">
                        <div>
                          {nft.metadata?.name} #{nft.tokenId}
                        </div>
                        <div>
                          <AiOutlineArrowRight className="mr-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );

           
          })}
        </div>
      )}

      {!nftData && (
        <div className="flex flex-col items-center h-screen">
          <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-red-700 py-3"></div>
          <div className="text-center text-xl">Loading....</div>
          <div className="text-center text-lg">
            Server is overloaded. It may take a while to fetch NFTs, please
            wait.
          </div>
        </div>
      )}

      {listings && numOfListed === 0 && (
        <div className="h-screen text-xl flex justify-center text-center">
          No NFTs found. <br />
          List your NFT for sale to show them here.
        </div>
      )}

      {!listings && numOfNFTs === 0 && (
        <div className="h-screen text-xl flex justify-center text-center">
          No NFTs found. <br /> Purchase NFT to show them here.
        </div>
      )}
    </div>
  );
};

export default Profile;

//http://localhost:8000/assets?owner=0x0b9Ba03e0D78A473aac15E2B392E0248077bED70
//http://localhost:8000/assets?owner=0x0b9ba03e0d78a473aac15e2b392e0248077bed70
