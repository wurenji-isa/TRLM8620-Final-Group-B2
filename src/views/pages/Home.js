import {featuredProducts} from "../../app.js";
import i18n from "../../services/i18n.js";
let Home = {
    render: async () => {

        //localized UI strings
        let homeTitle = i18n.getString("Home", "homeTitle");
        let welcomeSubtitle = i18n.getString("Home", "welcomeSubtitle");

        //view has no static text
        let view = `
            <section class="welcome">
                <h1 class="center">${homeTitle}</h1>
                <h3 class="center white">${welcomeSubtitle}</h3>
            </section>

            <div class="browseGrid homeGrid">`;

        //loop through featured products
        featuredProducts.forEach((product) => {

            //localized alt text + product title
            let imageAltSuffix = i18n.getString("Home", "imageSuffix");
            let imageAlt = product.title + imageAltSuffix;

            view += `
                    <article id="${product.productID}" class="${product.type}">
                        <img src="${product.imageURL}" class="gridImage" alt="${imageAlt}">
                        <div class="gridDes">
                            <h3>${product.title}</h3>
                            <div class="gridPrice">
                                ${i18n.formatCurrency(product.price, "b")}
                            </div>
                        </div>
                    </article>`;
        });
            
        view += "</div>";

        //return generated markup
        return view
    }
    , after_render: async () => {
        let articles = document.querySelectorAll("article");

        //click listener to redirect on product click
        for(let curProduct of articles) {
            curProduct.addEventListener("click", function() {
                location.href=`./#/${curProduct.classList[0]}s/` + curProduct.id;
            }, false);
            curProduct.classList.add("zoom");
        }

    }

}

export default Home;