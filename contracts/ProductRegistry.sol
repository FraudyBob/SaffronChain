// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProductRegistry {
    struct Product {
        string name;
        string batch;
        string manufacturer;
        string status;
        uint256 timestamp;
    }

    mapping(string => Product) public products;

    event ProductRegistered(string productId, string name, string manufacturer);
    event ProductStatusUpdated(string productId, string newStatus);

    function registerProduct(
        string memory productId,
        string memory name,
        string memory batch,
        string memory manufacturer
    ) public {
        require(bytes(products[productId].name).length == 0, "Product already exists");

        products[productId] = Product(name, batch, manufacturer, "Created", block.timestamp);
        emit ProductRegistered(productId, name, manufacturer);
    }

    function updateProductStatus(string memory productId, string memory newStatus) public {
        require(bytes(products[productId].name).length > 0, "Product does not exist");

        products[productId].status = newStatus;
        emit ProductStatusUpdated(productId, newStatus);
    }

    function getProduct(string memory productId)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            uint256
        )
    {
        Product memory p = products[productId];
        require(bytes(p.name).length > 0, "Product not found");
        return (p.name, p.batch, p.manufacturer, p.status, p.timestamp);
    }
}
