import './App.css';
import Section from './section'
import SearchBar from './selectableSearch'
import { useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import GeolocationAsk from './popups/geo';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import ProductPage from './components/productCard/home';


function App() {
  let [ geolocation, setGeolocation ] = useState("none");
  let [ showGeolocationAsk, setShowGeolocationAsk ] = useState(false);

  if (geolocation === "none" && !showGeolocationAsk) {
      let geo = navigator.geolocation;
      geo.getCurrentPosition((position) => {
          setShowGeolocationAsk(true);
          let token = "&key=AIzaSyA9VAKbpKaK0ThXtmd9LKRuq1hNPXiBP2I";
          let latlng="latlng=" + position.coords.latitude + "," + position.coords.longitude;
          let url = "https://maps.googleapis.com/maps/api/geocode/json?" + latlng + token;

          let promise = new Promise((resolve, reject) => {
              fetch(url)
                .then(response =>response.json())
                .then((data) => {
                    try {
                        let city = data.results[0].address_components[2].long_name;
                        resolve(setGeolocation(city));
                    }
                    catch {
                        resolve(setGeolocation("none"));
                    }
                })
                .catch(reject)
          })
      });
  }

  return (
      <Router>
        <Switch>
            <Route exact path="/">
                <div className="App">
                    
                    <h1>{(geolocation !== "none") ? geolocation: "No geolocation"}</h1>
                <header className="section-header">
                <section className="header-main border-bottom">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-xl-2 col-lg-3 col-md-12">
                                <a href="/#" className="brand-wrap">
                                Novel
                                </a> 
                            </div>
                            <div className="col-xl-6 col-lg-5 col-md-6">
                                <SearchBar/>
                            </div> 
                            <div className="col-xl-4 col-lg-4 col-md-6">
                                <div className="widgets-wrap float-md-right">
                                    <div className="widget-header mr-3">
                                        <a href="/#" className="widget-view">
                                            <div className="icon-area">
                                                <i className="fa fa-store"></i>
                                            </div>
                                            <small className="text"> Торги </small>
                                        </a>
                                    </div>
                                    <div className="widget-header">
                                        <a href="/#" className="widget-view">
                                            <div className="icon-area">
                                                <i className="fa fa-shopping-cart"></i>
                                                <span className="notify">3</span>
                                            </div>
                                            <small className="text"> Корзина </small>
                                        </a>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    </div> 
                </section> 
                
                </header> 
                
                
                <div className="container">
                
                <Section
                    sectionName="Часто просматриваемые"
                    geolocation={geolocation}
                    endpointUrl="http://localhost:8000/top_views/"
                />
                
                <Section
                    sectionName="Часто заказываемые"
                    geolocation={geolocation}
                    endpointUrl="http://localhost:8000/top_orders/"
                />
            
                </div>
                </div>
            </Route>
            <Route path="/product/:productId/:geolocation">
                <ProductPage/>
            </Route>
    </Switch>
    </Router>
  );
}
export default App;