pragma solidity ^0.8.20;

contract ProductRegistry {
    struct Product {
        string name;
        string batch;
        string manufacturer;
        string status;
        uint256 timestamp;
        string turmericOrigin;
        uint256 harvestDate;
        bool exists;
    }

    struct TraceRecord {
        string stage;
        string company;
        string location;
        uint256 timestamp;
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
        products[productId] = Product({
            name: name,
            batch: batch,
            manufacturer: manufacturer,
            status: "Farm",
            timestamp: block.timestamp,
            turmericOrigin: turmericOrigin,
            harvestDate: harvestDate,
            exists: true
        });
        productIds.push(productId);
        productCount++;
        emit ProductRegistered(productId, name, manufacturer);
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
            timestamp: block.timestamp
        }));
        traceCount[productId]++;
        emit TraceRecordAdded(productId, stage, company, location);
    }

    function getProduct(string memory productId) public view productExists(productId) returns (
        string memory name,
        string memory batch,
        string memory manufacturer,
        string memory status,
        uint256 timestamp,
        string memory turmericOrigin,
        uint256 harvestDate
    ) {
        Product memory p = products[productId];
        return (p.name, p.batch, p.manufacturer, p.status, p.timestamp, p.turmericOrigin, p.harvestDate);
    }

    function getTraceRecord(string memory productId, uint256 index) public view productExists(productId) returns (
        string memory stage,
        string memory company,
        string memory location,
        uint256 timestamp
    ) {
        TraceRecord memory trace = productTraces[productId][index];
        return (trace.stage, trace.company, trace.location, trace.timestamp);
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