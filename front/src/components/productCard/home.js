import React, { useEffect } from "react";
import Gradients from "../Gradients";
import ProductImages from "./productImage";
import Info from "./info/info";
import Section from '../../section'
import { useParams } from "react-router";

import './product.scss'


const ProductCard = () => {
  var sizes, colors, shoes, gradients, shoeBackground, shoeHeight;
  var prevColor = "blue";
  var animateOrNot = true;

  function changeColor() {
    if (!animateOrNot) {
      console.log("waittttt");
      return;
    }
    var primary = this.getAttribute("primary");
    var color = this.getAttribute("color");
    var shoe = document.querySelector(`.shoe[color="${color}"]`);
    var gradient = document.querySelector(`.gradient[color="${color}"]`);
    var prevGradient = document.querySelector(
      `.gradient[color="${prevColor}"]`
    );

    // showing correct color
    colors.forEach(color => color.classList.remove("active"));
    this.classList.add("active");

    // changing primary css variable
    document.documentElement.style.setProperty("--primary", primary);

    // showing correct img
    shoes.forEach(s => s.classList.remove("show"));
    shoe.classList.add("show");

    // dealing with gradient
    gradients.forEach(g => g.classList.remove("displayValue", "behindValue"));
    prevGradient.classList.add("behindValue");
    gradient.classList.add("displayValue");

    // logic
    prevColor = color;
    animateOrNot = false;

    // hack
    setTimeout(() => {
      animateOrNot = true;
    }, 800);
  }

  function changeSize() {
    sizes.forEach(size => size.classList.remove("active"));
    this.classList.add("active");
  }

  // for responsive behaviour
  const changeHeight = () => {
    var x = window.matchMedia("(max-width:1000px)");

    !shoes ? (shoeHeight = 0) : (shoeHeight = shoes[0].offsetHeight);

    if (x.matches) {
      if (shoeHeight === 0) {
        try {
          setTimeout(changeHeight, 50);
        } catch (error) {
          console.log("change height by timeout failed")
        }
      }
      shoeBackground.style.height = `${shoeHeight * 0.9}px`;
    } else if (!!shoeBackground) {
      // go back to default
      shoeBackground.style.height = "475px";
    }
  };

  useEffect(() => {
    sizes = document.querySelectorAll(".size");
    colors = document.querySelectorAll(".color");
    shoes = document.querySelectorAll(".shoe");
    gradients = document.querySelectorAll(".gradient");
    shoeBackground = document.querySelector(".shoeBackground");

    colors.forEach(color => color.addEventListener("click", changeColor));
    sizes.forEach(size => size.addEventListener("click", changeSize));
    changeHeight();
  }, []);
  window.addEventListener("resize", changeHeight);

  return (
    <div className="Home">
      <div className="productContainer">
        <div className="productCard">
          <div className="shoeBackground">
          <Gradients />
            <ProductImages />
          </div>
          <Info />
        </div>
      </div>
    </div>
  );
};

function ProductPage() {
    let { productId, geolocation } = useParams();

    return (
        <div>
            <ProductCard/>
            <div className="container">
                <Section
                    sectionName="Рекомендуемые"
                    geolocation={geolocation}
                    endpointUrl={"http://localhost:8000/recom/"}
                    productId={productId}
                />

                <Section
                    sectionName="Близкие по цене"
                    geolocation={geolocation}
                    endpointUrl={"http://localhost:8000/same_close/"}
                    productId={productId}
                />

                <Section
                    sectionName="Посмотрите в той же категории"
                    geolocation={geolocation}
                    endpointUrl={"http://localhost:8000/cheapest/"}
                    productId={productId}
                />

                <Section
                    sectionName="От того же поставщика"
                    geolocation={geolocation}
                    endpointUrl={"http://localhost:8000/same_supp/"}
                    productId={productId}
                />
            </div>
        </div>
    )
}

export default ProductPage;