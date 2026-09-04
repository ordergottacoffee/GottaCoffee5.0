const MENU = {
  "business": {
    "name": "Gotta Coffee",
    "tagline": "Cold Brews & Iced Macchiatos, Lattes, Matcha, & Gotta Coffee Chai delivered straight to you!",
    "deliveryMinimum": 5.0,
    "venmoDeliveryFee": 2.0,
    "orderCutoff": "05:00",
    "days": "Monday-Friday",
    "areas": {
      "Frenchville": "8:00 AM-9:00 AM",
      "St. Agatha": "8:00 AM-9:00 AM",
      "Madawaska": "9:30 AM-12:00 PM"
    },
    "payments": [
      "Cash",
      "Venmo"
    ]
  },
  "drinks": [
    {
      "sourceName": "Iced Macchiato",
      "name": "Iced Macchiato",
      "size": "Regular",
      "price": 7.5,
      "description": "A layered iced double espresso drink with your choice of flavor(s) & milk.",
      "available": true
    },
    {
      "sourceName": "Iced DECAF Macchiato",
      "name": "Iced DECAF Macchiato",
      "size": "Regular",
      "price": 7.75,
      "description": "A layered iced decaf double espresso drink with your choice of flavor(s) & milk.",
      "available": true
    },
    {
      "sourceName": "Iced Latte",
      "name": "Iced Latte",
      "size": "Regular",
      "price": 7.5,
      "description": "A mixed iced double espresso drink with your choice of flavor(s) & milk.",
      "available": true
    },
    {
      "sourceName": "Iced DECAF Latte",
      "name": "Iced DECAF Latte",
      "size": "Regular",
      "price": 7.5,
      "description": "A mixed iced decaf double espresso drink with your choice of flavor(s) & milk.",
      "available": true
    },
    {
      "sourceName": "Large Cold Brew",
      "name": "Cold Brew",
      "size": "Large",
      "price": 5.75,
      "description": "Gotta's Cold Brew, smooth, delicious, the best iced coffee you'll drink today.",
      "available": true
    },
    {
      "sourceName": "Large DECAF Cold Brew",
      "name": "DECAF Cold Brew",
      "size": "Large",
      "price": 6.0,
      "description": "Gotta's Cold Brew, smooth, delicious, the best iced coffee you'll drink today, but DECAF.",
      "available": true
    },
    {
      "sourceName": "XL Cold Brew",
      "name": "Cold Brew",
      "size": "XL",
      "price": 10.75,
      "description": "Gotta's Cold Brew, smooth, delicious, the best iced coffee you'll drink today, but in a big ol' wonton soup bucket!",
      "available": true
    },
    {
      "sourceName": "XL DECAF Cold Brew",
      "name": "DECAF Cold Brew",
      "size": "XL",
      "price": 11.0,
      "description": "Gotta's Cold Brew, smooth, delicious, the best iced coffee you'll drink today, but DECAF, and in a big ol' wonton soup bucket!",
      "available": true
    },
    {
      "sourceName": "Iced Matcha",
      "name": "Iced Matcha",
      "size": "Regular",
      "price": 6.75,
      "description": "Matcha-- green goodness.",
      "available": true
    },
    {
      "sourceName": "Iced Chai (naturally decaf)",
      "name": "Iced Chai (naturally decaf)",
      "size": "Regular",
      "price": 6.75,
      "description": "Our House Chai, made with all natural spices, it's sure to be one of your instant favorites.",
      "available": true
    },
    {
      "sourceName": "Large Carnival Lemonade",
      "name": "Carnival Lemonade",
      "size": "Large",
      "price": 4.75,
      "description": "Our lemonade is a cut above the rest. Lemon, sugar, water, flavors if you want them. Omg yum!",
      "available": true
    },
    {
      "sourceName": "XL Carnival Lemonade",
      "name": "Carnival Lemonade",
      "size": "XL",
      "price": 9.5,
      "description": "Our lemonade is a cut above the rest. Lemon, sugar, water, flavors if you want them, but in a big ol' wonton soup bucket!",
      "available": true
    },
    {
      "sourceName": "Small Kid’s Milk",
      "name": "Kid’s Milk",
      "size": "Small",
      "price": 3.5,
      "description": "Choose your milk, add flavor, shake it up, enjoy!",
      "available": true
    },
    {
      "sourceName": "Iced Sweet Black Tea",
      "name": "Iced Sweet Black Tea",
      "size": "Regular",
      "price": 3.5,
      "description": "Sweetened southern style black tea",
      "available": true
    },
    {
      "sourceName": "Iced Sweet Green Tea",
      "name": "Iced Sweet Green Tea",
      "size": "Regular",
      "price": 3.5,
      "description": "Sweetened southern style green tea",
      "available": true
    },
    {
      "sourceName": "At home kit - 5 Pack Nespresso variety coffee pod pack and 5 varitety flavors (please list allergies)",
      "name": "At home kit - 5 Pack Nespresso variety coffee pod pack and 5 varitety flavors (please list allergies)",
      "size": "Regular",
      "price": 16.25,
      "description": "Have a Nespresso Machine? Be your own barista! We'll package a work week's worth of Nespresso coffee pods and a variety of flavors you can use to make your own iced or hot coffee for yourself--just add milk, creamer, or have it black.",
      "available": true
    },
    {
      "sourceName": "At home kit - 10 Pack Nespresso variety coffee pod pack and 10 varitety flavors (please list allergies)",
      "name": "At home kit - 10 Pack Nespresso variety coffee pod pack and 10 varitety flavors (please list allergies)",
      "size": "Regular",
      "price": 31.5,
      "description": "Have a Nespresso Machine? Be your own barista! We'll package 10  Nespresso coffee pods and a variety of 10 flavors you can use to make your own iced or hot coffee for yourself--just add milk, creamer, or have it black.",
      "available": true
    }
  ],
  "foods": [
    {
      "name": "Sourdough Bread",
      "price": 10.0,
      "available": false
    },
    {
      "name": "4 pack Of Chocolate Pookies (chocolate cookie with chocolate dream cream)",
      "price": 11.0,
      "available": false
    },
    {
      "name": "Banana Bread Slice",
      "price": 3.0,
      "available": false
    },
    {
      "name": "Zucchini Bread Slice",
      "price": 3.0,
      "available": false
    }
  ],
  "milks": [
    {
      "name": "0.02",
      "available": true
    },
    {
      "name": "Half & Half",
      "available": true
    },
    {
      "name": "Almond",
      "available": false
    },
    {
      "name": "Oat Milk",
      "available": true
    }
  ],
  "flavors": [
    {
      "name": "Vanilla Caramel*",
      "available": true
    },
    {
      "name": "Maple Caramel*",
      "available": true
    },
    {
      "name": "Four Corners*",
      "available": true
    },
    {
      "name": "Hazelnut Mocha*",
      "available": true
    },
    {
      "name": "Sugar Cookie*",
      "available": true
    },
    {
      "name": "Chocolate Covered Strawberry*",
      "available": true
    },
    {
      "name": "Banana Split*",
      "available": false
    },
    {
      "name": "Birthday cake*",
      "available": true
    },
    {
      "name": "Wedding cake*",
      "available": true
    },
    {
      "name": "Benjamin's Campfire*",
      "available": true
    },
    {
      "name": "Waffle with a caramel bottom*",
      "available": true
    },
    {
      "name": "Almond Roca",
      "available": true
    },
    {
      "name": "Apple 🍋",
      "available": true
    },
    {
      "name": "Banana (SF) 🍋",
      "available": false
    },
    {
      "name": "Blood Orange 🍋",
      "available": true
    },
    {
      "name": "Blueberry (SF) 🍋",
      "available": true
    },
    {
      "name": "Blue Raspberry (SF) 🍋",
      "available": true
    },
    {
      "name": "Bourbon Caramel",
      "available": true
    },
    {
      "name": "Brown Sugar Cinnamon (SF)",
      "available": true
    },
    {
      "name": "Butter Pecan",
      "available": true
    },
    {
      "name": "Butterscotch (SF)",
      "available": true
    },
    {
      "name": "Caramel",
      "available": true
    },
    {
      "name": "Caramel (SF)",
      "available": true
    },
    {
      "name": "Cheesecake",
      "available": true
    },
    {
      "name": "Choc. Chip Cookie Dough (SF)",
      "available": true
    },
    {
      "name": "Classic Sweetener 🍋",
      "available": true
    },
    {
      "name": "Sugar Free Sweetener 🍋",
      "available": true
    },
    {
      "name": "Coconut  🍋",
      "available": true
    },
    {
      "name": "Coconut (SF) 🍋",
      "available": true
    },
    {
      "name": "Cupcake",
      "available": true
    },
    {
      "name": "English Toffee",
      "available": true
    },
    {
      "name": "English Toffee (SF)",
      "available": true
    },
    {
      "name": "Gingerbread",
      "available": true
    },
    {
      "name": "Gingerbread (SF)",
      "available": true
    },
    {
      "name": "Green Apple 🍋",
      "available": true
    },
    {
      "name": "Hazelnut",
      "available": true
    },
    {
      "name": "Hazelnut (SF)",
      "available": true
    },
    {
      "name": "Irish Cream (+SF)",
      "available": true
    },
    {
      "name": "Lavender 🍋",
      "available": true
    },
    {
      "name": "Lime 🍋",
      "available": true
    },
    {
      "name": "Macadamia Nut",
      "available": true
    },
    {
      "name": "Macadamia Nut (SF)",
      "available": true
    },
    {
      "name": "Mango 🍋",
      "available": true
    },
    {
      "name": "Maple",
      "available": true
    },
    {
      "name": "Peach 🍋",
      "available": true
    },
    {
      "name": "Peanut Butter",
      "available": true
    },
    {
      "name": "Peppermint",
      "available": true
    },
    {
      "name": "Peppermint (SF)",
      "available": true
    },
    {
      "name": "Pineapple (SF) 🍋",
      "available": true
    },
    {
      "name": "Pumpkin Pie",
      "available": true
    },
    {
      "name": "Pumpkin Pie (SF)",
      "available": true
    },
    {
      "name": "Pumpkin Spice",
      "available": true
    },
    {
      "name": "Raspberry (SF) 🍋",
      "available": true
    },
    {
      "name": "Shortbread",
      "available": true
    },
    {
      "name": "S’mores (SF)",
      "available": true
    },
    {
      "name": "Sour Gummy 🍋",
      "available": true
    },
    {
      "name": "Strawberry 🍋",
      "available": true
    },
    {
      "name": "Strawberry (SF) 🍋",
      "available": true
    },
    {
      "name": "Tiramisu",
      "available": true
    },
    {
      "name": "Toasted Marshmallow (SF)",
      "available": true
    },
    {
      "name": "Vanilla",
      "available": true
    },
    {
      "name": "Vanilla (SF)",
      "available": true
    },
    {
      "name": "Watermelon (SF) 🍋",
      "available": true
    }
  ],
  "bottoms": [
    {
      "name": "Caramel",
      "available": true
    },
    {
      "name": "Sugar Free Caramel",
      "available": false
    },
    {
      "name": "White Chocolate",
      "available": true
    },
    {
      "name": "Sugar Free White Chocolate",
      "available": true
    },
    {
      "name": "Mocha",
      "available": true
    },
    {
      "name": "Sugar Free Mocha",
      "available": true
    },
    {
      "name": "Strawberry",
      "available": true
    }
  ],
  "addons": [
    {
      "name": "Add a Double Shot of Espresso",
      "price": 2.0,
      "available": true
    },
    {
      "name": "Add a Lotus Shot",
      "price": 2.0,
      "available": true
    },
    {
      "name": "Add Cold Foam",
      "price": 0.5,
      "available": true
    }
  ]
};
