import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function SmallProductCard({ title, price, product_id, geolocation}) {
    return (
        <li className="col-6 col-lg-2 col-md-4">
                <Link to={"/product/" + String(product_id) + "/" + geolocation}>
                <div className="card-body item">
                    <h6 className="title"> { title } </h6>
                    <img className="img-sm float-right" src="assets/images/placeholder.webp" /> 
                    <p className="text-muted"><i className="fa"></i> { price } руб.</p>
                </div>
                </Link>
        </li>
    );
}

function FetchCardsData(url) {
    const [data, setData] = useState([]);
    
    React.useEffect(() => {
        const fetchData = async () => {

        const res = await fetch(url);
        const json = await res.json();
            if (Array.isArray(json)) {
                setData(json);
            }
        };
        fetchData();
      }, []);

      return data;
}

function Section({ sectionName, geolocation, endpointUrl, productId }) {
    if (productId)
        endpointUrl = endpointUrl + geolocation + "/" + String(productId);
    else
        endpointUrl = endpointUrl + geolocation + "/6";

    let response = FetchCardsData(endpointUrl);
    console.log("Response:", response)

    return (
        <section className="padding-bottom">
            <header className="section-heading heading-line">
                <h4 className="title-section text-uppercase">{ sectionName }</h4>
            </header>
            
            <div className="card card-home-category">
            <div className="row no-gutters">
                
                <div className="col-md-12">
            <ul className="row no-gutters bordered-cols">
                { response && response.map(item => {
                    return (
                        <SmallProductCard
                            title={item.name}
                            price={item.cost}
                            product_id={item.id}
                            geolocation={geolocation}
                        />
                    );
                }) }
            </ul>
                </div>
            </div> 
            </div>
            </section>
    )
}

export default Section;