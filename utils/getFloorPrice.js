// import rarible from '@api/rarible';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.RARIBLE_API_KEY;
const BASE_URL = "https://api.rarible.org/v0.1/data/collections/";

/*
 * カメラリストの取得
 */
async function getFloorPrice(collectionAddress, blockchain = "POLYGON") {
    console.log("getCollections");
    if (!API_KEY) {
        console.error("Error: API_KEY is missing. Set it in your .env file.");
        return;
    }

    if (!collectionAddress) {
        console.error("Error: Collection address is required.");
        return;
    }

    const url = `https://api.rarible.org/v0.1/items/search`;
    const header = {
        "Accept": "application/json",
        "X-API-KEY": API_KEY,
        "content-type" : "application/json"
    };

    const body = JSON.stringify({
        "size": 1000,
        "filter": {
          "deleted": false,
          "collections": [
            `${blockchain}:${collectionAddress}`
          ],
          "onSale": true
        },
        "traitSort": {
          "order": "ASC",
          "type": "TEXT",
          "key": "lastUpdatedAt"
        }
      });

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: header,
            body: body
        });

        if (!response.ok) {
            const errorText = await response.text();
            return {
                success: false,
                error: `HTTP error! Status: ${response.status}, Message: ${errorText}`
            };
        }

        const data = await response.json();

        const rarityPrices = {};
        data.items.forEach(item => {

            let rarity = "";
            let genesis = "";
            if (item.meta?.attributes) {
                item.meta.attributes.forEach(attr => {
                    if (attr.key === "Rarity") {
                        rarity = attr.value;
                    }
                    if (attr.key === "Genesis") {
                        genesis = attr.value;
                    }
                });
            }

            const rarityKey = `${rarity}${genesis}`;
            if (!rarityPrices[rarityKey]) {
                rarityPrices[rarityKey] = [];
            }

            if (item.bestSellOrder?.makePriceUsd) {
                rarityPrices[rarityKey].push(item.bestSellOrder.makePriceUsd);
            }
        });

        // 各レアリティごとの最安値を計算
        const floorPrices = {};
        for (const rarity in rarityPrices) {
            const floorPrice = Math.min(...rarityPrices[rarity]);
            floorPrices[rarity] = floorPrice;
            console.log(`Rarity: ${rarity}, Floor Price: ${floorPrice}`);
        }
        
        //console.log("Floor Price:", data);
        return {
            success: true,
            collection: collectionAddress,
            floorPrices: floorPrices
        };
    
    } catch (error) {
        console.error("Error fetching floor price:", error);
    }
}

export { getFloorPrice }; // 関数をexport
