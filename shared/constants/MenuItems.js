export const MENU_ITEMS = [
    {
        id: 1,
        restaurantId: 1, 
        title: "Hamburger",
        image: require('@/assets/images/menu/Hamburger.jpg'),
        description: "...",
        price: 50000
    },
    {
        id: 2,
        restaurantId: 2,
        title: "Fried Chicken",
        image: require('@/assets/images/menu/FriedChicken.jpg'),
        description: "...",
        price: 70000
    },
    {
        id: 3,
        restaurantId: 3, 
        title: "Pizza",
        description: "...",
        image: require('@/assets/images/menu/Pizza.jpg'),
        price: 100000
    },
    {
        id: 4,
        restaurantId: 1, 
        title: "Chips",
        description: "...",
        image: require('@/assets/images/menu/Chips.jpg'),
        price: 30000
    },
    {
        id: 5,
        restaurantId: 2, 
        title: "Pasta",
        description: "...",
        image: require('@/assets/images/menu/Pasta.jpg'),
        price: 50000
    },
    {
        id: 6,
        restaurantId: [4,5], 
        title: "Matcha Latte",
        description: "...",
        image: require('@/assets/images/menu/matcha.jpg'),
        price: 40000
    },
    {
    id: 7,
    restaurantId: 7,
    title: "Cheese Burger",
    image: require('@/assets/images/menu/cheeseburger.jpg'),
    description: "...",
    price: 55000
  },
  {
    id: 8,
    restaurantId: 7,
    title: "French Fries",
    image: require('@/assets/images/menu/fries.jpg'),
    description: "...",
    price: 35000
  },

  // KFC
  {
    id: 9,
    restaurantId: 2,
    title: "Chicken Bucket",
    image: require('@/assets/images/menu/chickenbucket.jpg'),
    description: "...",
    price: 150000
  },
  {
    id: 10,
    restaurantId: 2,
    title: "Coleslaw Salad",
    image: require('@/assets/images/menu/ColeslawSalad.jpg'),
    description: "...",
    price: 25000
  },

  // Pizza Hut
  {
    id: 11,
    restaurantId: 13,
    title: "Hawaiian Pizza",
    image: require('@/assets/images/menu/HawaiianPizza.jpg'),
    description: "...",
    price: 120000
  },
  {
    id: 12,
    restaurantId: 13,
    title: "Pepperoni Pizza",
    image: require('@/assets/images/menu/PepperoniPizza.jpg'),
    description: "...",
    price: 130000
  },

  // Coffee shops
  {
    id: 13,
    restaurantId: [4, 5, 9],
    title: "Cà phê sữa đá",
    image: require('@/assets/images/menu/caphe_suada.jpg'),
    description: "...",
    price: 30000
  },
  {
    id: 14,
    restaurantId: [4, 5, 9],
    title: "Trà đào cam sả",
    image: require('@/assets/images/menu/tradao.jpg'),
    description: "...",
    price: 45000
  },
  {
    id: 15,
    restaurantId: [4, 5, 9],
    title: "Latte",
    image: require('@/assets/images/menu/latte.jpg'),
    description: "...",
    price: 40000
  },
  {
    id: 16,
    restaurantId: [4, 5, 9],
    title: "Bạc xỉu",
    image: require('@/assets/images/menu/bacxiu.jpg'),
    description: "...",
    price: 35000
  },

  // Milk tea shops
  {
    id: 17,
    restaurantId: [6, 19],
    title: "Trà sữa trân châu",
    image: require('@/assets/images/menu/trasuachantrau.jpg'),
    description: "...",
    price: 40000
  },
  {
    id: 18,
    restaurantId: [6, 19],
    title: "Trà sữa Thái xanh",
    image: require('@/assets/images/menu/thaitea.jpg'),
    description: "...",
    price: 45000
  },
  {
    id: 19,
    restaurantId: [6, 19],
    title: "Hồng trà sữa",
    image: require('@/assets/images/menu/hongtra.jpg'),
    description: "...",
    price: 38000
  },

  // Cơm
  {
    id: 20,
    restaurantId: 8,
    title: "Cơm tấm sườn bì chả",
    image: require('@/assets/images/menu/comtam.jpg'),
    description: "...",
    price: 55000
  },
  {
    id: 21,
    restaurantId: 8,
    title: "Cơm gà xối mỡ",
    image: require('@/assets/images/menu/comga.jpg'),
    description: "...",
    price: 60000
  },
  {
    id: 22,
    restaurantId: 15,
    title: "Cơm niêu cá kho tộ",
    image: require('@/assets/images/menu/cakhoto.jpg'),
    description: "...",
    price: 80000
  },
  {
    id: 23,
    restaurantId: 15,
    title: "Canh chua cá lóc",
    image: require('@/assets/images/menu/canhchua.jpg'),
    description: "...",
    price: 75000
  },

  // Bún - Phở
  {
    id: 24,
    restaurantId: 10,
    title: "Bún bò Huế đặc biệt",
    image: require('@/assets/images/menu/bunbohue.jpg'),
    description: "...",
    price: 65000
  },
  {
    id: 25,
    restaurantId: 10,
    title: "Bún bò tái nạm",
    image: require('@/assets/images/menu/bunbotainam.jpg'),
    description: "...",
    price: 60000
  },
  {
    id: 26,
    restaurantId: 11,
    title: "Phở tái chín",
    image: require('@/assets/images/menu/phobo.jpg'),
    description: "...",
    price: 65000
  },
  {
    id: 27,
    restaurantId: 11,
    title: "Phở gà",
    image: require('@/assets/images/menu/phoga.jpg'),
    description: "...",
    price: 60000
  },

  // Chay
  {
    id: 28,
    restaurantId: [12, 17],
    title: "Cơm chay thập cẩm",
    image: require('@/assets/images/menu/comchay.jpg'),
    description: "...",
    price: 55000
  },
  {
    id: 29,
    restaurantId: [12, 17],
    title: "Bún riêu chay",
    image: require('@/assets/images/menu/bunrieuchay.jpg'),
    description: "...",
    price: 50000
  },
  {
    id: 30,
    restaurantId: [12, 17],
    title: "Lẩu nấm chay",
    image: require('@/assets/images/menu/launamchay.jpg'),
    description: "...",
    price: 80000
  },

  // Asia - Sushi / Sukiya
  {
    id: 31,
    restaurantId: 14,
    title: "Sushi cá hồi",
    image: require('@/assets/images/menu/sushicahoi.jpg'),
    description: "...",
    price: 120000
  },
  {
    id: 32,
    restaurantId: 14,
    title: "Sashimi tổng hợp",
    image: require('@/assets/images/menu/sashimi.jpg'),
    description: "...",
    price: 200000
  },
  {
    id: 33,
    restaurantId: 14,
    title: "Mì Udon",
    image: require('@/assets/images/menu/udon.jpg'),
    description: "...",
    price: 90000
  },
  {
    id: 34,
    restaurantId: 16,
    title: "Gyudon (cơm bò Nhật)",
    image: require('@/assets/images/menu/gyudon.jpg'),
    description: "...",
    price: 85000
  },
  {
    id: 35,
    restaurantId: 16,
    title: "Curry Rice",
    image: require('@/assets/images/menu/curryrice.jpg'),
    description: "...",
    price: 95000
  },

  // Thêm món nước / tráng miệng
  {
    id: 36,
    restaurantId: [1, 2, 7],
    title: "Coca Cola",
    image: require('@/assets/images/menu/cocacola.jpg'),
    description: "...",
    price: 20000
  },
  {
    id: 37,
    restaurantId: [1, 2, 7],
    title: "Pepsi",
    image: require('@/assets/images/menu/pepsi.jpg'),
    description: "...",
    price: 20000
  },
  {
    id: 38,
    restaurantId: [1, 2, 7],
    title: "Kem Sundae",
    image: require('@/assets/images/menu/sundae.jpg'),
    description: "...",
    price: 25000
  },

  // Thêm món cho TCH, Phúc Long, Highlands
  {
    id: 39,
    restaurantId: [4, 5, 9],
    title: "Trà Oolong",
    image: require('@/assets/images/menu/oolong.jpg'),
    description: "...",
    price: 45000
  },
  {
    id: 40,
    restaurantId: [4, 5, 9],
    title: "Espresso",
    image: require('@/assets/images/menu/espresso.jpg'),
    description: "...",
    price: 40000
  },

  // Thêm món cho các quán đặc sản
  {
    id: 41,
    restaurantId: 18,
    title: "Bánh tằm bì",
    image: require('@/assets/images/menu/banhtam.jpg'),
    description: "...",
    price: 50000
  },
  {
    id: 42,
    restaurantId: 18,
    title: "Bánh tằm nước cốt dừa",
    image: require('@/assets/images/menu/banhtamduacot.jpg'),
    description: "...",
    price: 55000
  },

  // Thêm món milk tea extra
  {
    id: 43,
    restaurantId: [6, 19],
    title: "Trà sữa kem cheese",
    image: require('@/assets/images/menu/milkteakemcheese.jpg'),
    description: "...",
    price: 48000
  },
  {
    id: 44,
    restaurantId: [6, 19],
    title: "Trà sữa Oreo",
    image: require('@/assets/images/menu/milkteaoreo.jpg'),
    description: "...",
    price: 50000
  },

  // Extra cho cơm tấm
  {
    id: 45,
    restaurantId: 8,
    title: "Cơm tấm gà nướng",
    image: require('@/assets/images/menu/comtamganuong.jpg'),
    description: "...",
    price: 60000
  },

  // Extra món fastfood snack
  {
    id: 46,
    restaurantId: 3,
    title: "Mì Ý bò bằm",
    image: require('@/assets/images/menu/miybo.jpg'),
    description: "...",
    price: 80000
  },
  {
    id: 48,
    restaurantId: 1,
    title: "Hotdog",
    image: require('@/assets/images/menu/hotdog.jpg'),
    description: "...",
    price: 40000
  },
  {
    id: 49,
    restaurantId: 7,
    title: "Gà sốt cay",
    image: require('@/assets/images/menu/gasotcay.jpg'),
    description: "...",
    price: 75000
  },
  {
    id: 50,
    restaurantId: 2,
    title: "Burger Zinger",
    image: require('@/assets/images/menu/zinger.jpg'),
    description: "...",
    price: 65000
  }
]