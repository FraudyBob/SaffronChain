// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProductRegistry {
    struct Product {
        string name;
        string batch;
        string manufacturer;
        string status;
        uint256 timestamp;
        string turmericOrigin; // Twist: Indian spice focus
        uint256 harvestDate; // Unix timestamp
        bool exists;
    }

    struct TraceRecord {
        string stage;
        string company;
        string location;
        uint256 timestamp;
        bool exists;
    }

    mapping(string => Product) public products;
    mapping(string => TraceRecord[]) public productTraces;
    mapping(string => uint256) public traceCount;

    event ProductRegistered(string productId, string name, string manufacturer);
    event ProductStatusUpdated(string productId, string newStatus);
    event TraceRecordAdded(string productId, string stage, string company, string location);

    modifier productExists(string memory productId) {
        require(products[productId].exists, "Product does not exist");
        _;
    }

    function registerProduct(
        string memory productId,
        string memory name,
        string memory batch,
        string memory manufacturer,
        string memory turmericOrigin,
        uint256 harvestDate
    ) public {
        require(!products[productId].exists, "Product already exists");
        require(bytes(productId).length > 0, "Product ID cannot be empty");
        require(bytes(name).length > 0, "Product name cannot be empty");
        require(bytes(manufacturer).length > 0, "Manufacturer cannot be empty");
        require(bytes(turmericOrigin).length > 0, "Turmeric origin cannot be empty");
        require(harvestDate > 0, "Harvest date must be set");

        products[productId] = Product({
            name: name,
            batch: batch,
            manufacturer: manufacturer,
            status: "Created",
            timestamp: block.timestamp,
            turmericOrigin: turmericOrigin,
            harvestDate: harvestDate,
            exists: true
        });

        emit ProductRegistered(productId, name, manufacturer);
    }

    // Rest unchanged, but recompile/redeploy after this.
}