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

  // const position = [seller?.latitude, seller?.longitude];
  // console.log("geo :>> ", seller!.latitude, seller!.latitude);

  // const position: [number | undefined, number | undefined] = [
  //   seller?.latitude,
  //   seller?.longitude,
  // ];

  // const position = {seller!.latitude, seller!.longitude}
  // console.log("geo :>> ", seller!.latitude, seller!.latitude);

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

  // const position: [number, number] | undefined =
  //   seller?.latitude && seller?.longitude
  //     ? [seller.latitude, seller.longitude]
  //     : undefined;
  // console.log("geolocalion :>> ", seller!.latitude, seller!.longitude);

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
              <h2>{seller.userName}</h2>
              <h3>Store</h3>
            </Row>
            <hr />
            <Row>
              <Col className="d-block" style={{ textAlign: "left" }}>
                <h4>Contacts</h4>
                <h5>{seller.email}</h5>
                <Link
                  className="mb-2"
                  to={`https://maps.google.com/?q=${seller.address}`}
                  target="_blank"
                >
                  {seller.address}
                </Link>
              </Col>
              <Col>
                <MapContainer
                  center={[seller.latitude, seller.longitude]}
                  zoom={15}
                  scrollWheelZoom={false}
                  style={{ height: "200px" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <Marker position={[seller.latitude, seller.longitude]}>
                    <Popup>{seller.userName}</Popup>
                  </Marker>
                </MapContainer>
              </Col>
            </Row>
            <hr />
            <h2>Products</h2>
            {products &&
              products.map((product) => {
                return (
                  <Row
                    className="d-flex justify-content-center"
                    key={product._id}
                  >
                    <ProductCardStore key={product._id} product={product} />
                  </Row>
                );
              })}
          </Container>
        </>
      )}
    </>
  );
}

export default Seller;
