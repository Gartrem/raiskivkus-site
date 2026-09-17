(() => {
  const originalFetch = window.fetch.bind(window);
  const productsFile = "data/products.json";

  const addedProducts = [
    {
      id: 130,
      slug: "pitstsa-sladkij-ostrov-40-sm",
      title: "Пицца Сладкий остров 40 см",
      price: 1100,
      category: "Пицца",
      description: "Состав: Белый фирменный соус, ананасы, ветчина, курица, сыр моцарелла, соус сладкий чили, кунжут.",
      images: ["/product-images/product-10.jpg"]
    },
    {
      id: 131,
      slug: "pitstsa-detskaya-40-sm",
      title: "Пицца Детская 40 см",
      price: 1050,
      category: "Пицца",
      description: "Состав: сливочный сырный соус, томаты, сосиски, сыр чизбургер, картофель фри, сыр моцарелла.",
      images: ["/product-images/product-13.jpg"]
    },
    {
      id: 132,
      slug: "pitstsa-alya-tsezar-40-sm",
      title: "Пицца Аля-Цезарь 40 см",
      price: 1100,
      category: "Пицца",
      description: "Состав: соус цезарь, сыр моцарелла, сыр пармезан, томаты, сухарики, пекинская капуста, курица.",
      images: ["/product-images/product-30.jpg"]
    },
    {
      id: 133,
      slug: "pitstsa-riv-era-40-sm",
      title: "Пицца Ривьера 40 см",
      price: 1100,
      category: "Пицца",
      description: "Состав: фирменный сливочный соус, ветчина, сервелат, томаты, маслины, орегано, сыр моцарелла.",
      images: ["/product-images/product-33.jpg"]
    },
    {
      id: 134,
      slug: "pitstsa-karbonara-40-sm",
      title: "Пицца Карбонара 40 см",
      price: 1100,
      category: "Пицца",
      description: "Состав: ветчина, бекон, яйцо, томаты, сыр моцарелла, итальянские травы, сырный соус.",
      images: ["/product-images/product-37.jpg"]
    },
    {
      id: 135,
      slug: "pitstsa-zhyul-en-40-sm",
      title: "Пицца Жульен 40 см",
      price: 1100,
      category: "Пицца",
      description: "Состав: соус ранч, цыплёнок, карбонад, лук фри, сыр моцарелла, соус васаби, шампиньоны, итальянские травы.",
      images: ["/product-images/product-38.jpg"]
    },
    {
      id: 136,
      slug: "pitstsa-tsyplenok-teriyaki-32-sm",
      title: "Пицца Цыпленок Терияки 32 см",
      price: 650,
      category: "Пицца",
      description: "Состав: томатный соус, соус терияки, сыр моцарелла, цыплёнок, ананас, кунжут.",
      images: ["/product-images/product-117.jpg"]
    }
  ];

  const removedSlugs = new Set([
    "shaurma-klassicheskaya",
    "lapsha-wok-tsyplenok-teriyaki"
  ]);

  const applyMenuChanges = (source) => {
    const products = source
      .filter((product) => !removedSlugs.has(product.slug))
      .map((product) => {
        const next = { ...product };

        if (next.category === "Роллы") {
          next.price = Number(next.price) + 20;
        }

        if (next.category === "Пицца" && /32\s*см/i.test(next.title)) {
          next.price = 650;
        }

        if (
          next.slug === "pitstsa-pepperoni-32-sm" ||
          next.slug === "pitstsa-chetyre-syra-32-sm"
        ) {
          next.price = 620;
        }

        return next;
      });

    const existingSlugs = new Set(products.map((product) => product.slug));
    for (const product of addedProducts) {
      if (!existingSlugs.has(product.slug)) {
        products.push(product);
      }
    }

    return products;
  };

  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    const input = args[0];
    const url = typeof input === "string" ? input : input?.url || String(input);

    if (!url.includes(productsFile)) {
      return response;
    }

    try {
      const source = await response.clone().json();
      if (!Array.isArray(source)) {
        return response;
      }

      const products = applyMenuChanges(source);
      const headers = new Headers(response.headers);
      headers.delete("content-length");
      headers.delete("content-encoding");
      headers.set("content-type", "application/json; charset=utf-8");

      return new Response(JSON.stringify(products), {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    } catch (error) {
      console.error("Не удалось применить обновление меню", error);
      return response;
    }
  };
})();
