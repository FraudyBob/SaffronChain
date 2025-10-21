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
    string[] public productIds;
    uint256 public productCount;

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

        productIds.push(productId);
        productCount++;

        emit ProductRegistered(productId, name, manufacturer);
    }

    function getProduct(string memory productId) public view returns (
        string memory name,
        string memory batch,
        string memory manufacturer,
        string memory status,
        uint256 timestamp,
        string memory turmericOrigin,
        uint256 harvestDate
    ) {
        require(products[productId].exists, "Product does not exist");
        Product memory product = products[productId];
        return (
            product.name,
            product.batch,
            product.manufacturer,
            product.status,
            product.timestamp,
            product.turmericOrigin,
            product.harvestDate
        );
    }

    function updateProductStatus(string memory productId, string memory newStatus) public productExists(productId) {
        products[productId].status = newStatus;
        emit ProductStatusUpdated(productId, newStatus);
    }

    function addTraceRecord(
        string memory productId,
        string memory stage,
        string memory company,
        string memory location
    ) public productExists(productId) {
        productTraces[productId].push(TraceRecord({
            stage: stage,
            company: company,
            location: location,
            timestamp: block.timestamp,
            exists: true
        }));
        traceCount[productId]++;
        emit TraceRecordAdded(productId, stage, company, location);
    }

    function getTraceRecords(string memory productId) public view productExists(productId) returns (TraceRecord[] memory) {
        return productTraces[productId];
    }

    function getAllProductIds() public view returns (string[] memory) {
        return productIds;
    }

    function getProductCount() public view returns (uint256) {
        return productCount;
    }
}