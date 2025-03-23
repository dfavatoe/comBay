import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { GetShopInfo, ProductT, User } from "../types/customTypes";
import { Col, Container, Image, Row } from "react-bootstrap";
import ProductCardStore from "../components/ProductCardStore";
import { TileLayer, MapContainer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function Seller() {
  const [seller, setSeller] = useState<User | null>(null);
  const [products, setProducts] = useState<ProductT[] | null>(null);

  const { sellerId } = useParams();
  console.log("sellerId :>> ", sellerId);

  const sellerAddress = seller?.address
    ? `${seller.address.streetName} ${seller.address.streetNumber}, ${seller.address.postalcode} ${seller.address.city}`
    : "";

  const handleGetSellerShopInfo = async () => {
    // console.log("shop working");

    if (sellerId) {
      try {
        const response = await fetch(
          `http://localhost:5100/api/products/seller/${sellerId}`
        );
        console.log("response :>> ", response);
        if (!response.ok) {
          console.log("Something went wrong");
        }
        const result = (await response.json()) as GetShopInfo;
        console.log("result Shop :>> ", result);
        setSeller(result.sellerInfo);
        setProducts(result.productsBySeller);
      } catch (error) {
        console.log("error :>> ", error);
      }
    } else {
      console.log("A seller's ID is necessary in the URL");
    }
  };

  useEffect(() => {
    handleGetSellerShopInfo();
  }, []);

  return (
    <>
      {console.log("seller>>>>>", seller)}
      {seller && (
        <>
          <Container>
            <Row
              className="align-content-center mb-4"
              style={{ height: "auto" }}
            >
              <Image
                className="mb-4"
                src={seller.image}
                style={{ height: "300px", objectFit: "cover" }}
              />
              <div className="second-header" style={{ textAlign: "center" }}>
                {seller.userName}
              </div>
              <div className="third-header" style={{ textAlign: "center" }}>
                Store
              </div>
            </Row>
            <hr />
            <Row>
              <Col
                sm={6}
                className="d-block mb-2"
                style={{ textAlign: "left" }}
              >
                <h4>Contacts</h4>
                <h5>{seller.email}</h5>
                {sellerAddress && (
                  <Link
                    className="mb-2"
                    to={`https://maps.google.com/?q=${sellerAddress}`}
                    target="_blank"
                  >
                    {sellerAddress}
                  </Link>
                )}
              </Col>
              <Col>
                {seller.address ? (
                  <MapContainer
                    center={[seller.address.latitude, seller.address.longitude]}
                    zoom={15}
                    scrollWheelZoom={false}
                    style={{ height: "200px" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Marker
                      position={[
                        seller.address.latitude,
                        seller.address.longitude,
                      ]}
                    >
                      <Popup>{seller.userName}</Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <MapContainer
                    center={[52.5200066, 13.404954]}
                    zoom={15}
                    scrollWheelZoom={false}
                    style={{ height: "200px" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Marker position={[52.5200066, 13.404954]}>
                      <Popup>
                        No location shared <br />
                        by seller
                      </Popup>
                    </Marker>
                  </MapContainer>
                )}
              </Col>
            </Row>
            <hr />
            <div className="second-header mb-4" style={{ textAlign: "center" }}>
              Products
            </div>
            {products ? (
              products.map((product) => {
                return (
                  <Row
                    className="d-flex justify-content-center"
                    key={product._id}
                  >
                    <ProductCardStore key={product._id} product={product} />
                  </Row>
                );
              })
            ) : (
              <h2>Seller still didn't share the products</h2>
            )}
          </Container>
        </>
      )}
    </>
  );
}

export default Seller;
