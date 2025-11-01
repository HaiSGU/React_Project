// Data thuần - chỉ chứa tên file ảnh (không dùng require)

export const MENU_ITEMS = [
  {
    id: 1,
    restaurantId: 1,
    title: "Hamburger",
    image: "Hamburger.jpg", // ← CHỈ TÊN FILE
    description: "Burger bò nướng thơm ngon",
    price: 50000,
    rating: 4.5,
    sold: 120
  },
  {
    id: 2,
    restaurantId: 2,
    title: "Fried Chicken",
    image: "FriedChicken.jpg",
    description: "Gà rán giòn rụm",
    price: 70000,
    rating: 4.8,
    sold: 200
  },
  {
    id: 3,
    restaurantId: 3,
    title: "Pizza",
    description: "Pizza Ý truyền thống",
    image: "Pizza.jpg",
    price: 100000,
    rating: 4.6,
    sold: 90
  },
  {
    id: 4,
    restaurantId: 1,
    title: "Chips",
    description: "Khoai tây chiên giòn",
    image: "Chips.jpg",
    price: 30000,
    rating: 4.3,
    sold: 150
  },
  {
    id: 5,
    restaurantId: 2,
    title: "Pasta",
    description: "Mì Ý sốt kem",
    image: "Pasta.jpg",
    price: 50000,
    rating: 4.4,
    sold: 80
  },
  {
    id: 6,
    restaurantId: [4, 5],
    title: "Matcha Latte",
    description: "Trà xanh latte Nhật Bản",
    image: "matcha.jpg",
    price: 40000,
    rating: 4.7,
    sold: 110
  },
  {
    id: 7,
    restaurantId: 7,
    title: "Cheese Burger",
    image: "cheeseburger.jpg",
    description: "Burger phô mai đặc biệt",
    price: 55000,
    rating: 4.6,
    sold: 130
  },
  {
    id: 8,
    restaurantId: 7,
    title: "French Fries",
    image: "fries.jpg",
    description: "Khoai tây chiên Pháp",
    price: 35000,
    rating: 4.5,
    sold: 180
  },
  {
    id: 9,
    restaurantId: 2,
    title: "Chicken Bucket",
    image: "chickenbucket.jpg",
    description: "Gà rán combo gia đình",
    price: 150000,
    rating: 4.9,
    sold: 95
  },
  {
    id: 10,
    restaurantId: 2,
    title: "Coleslaw Salad",
    image: "ColeslawSalad.jpg",
    description: "Salad bắp cải tươi",
    price: 25000,
    rating: 4.2,
    sold: 70
  },
  {
    id: 11,
    restaurantId: 13,
    title: "Hawaiian Pizza",
    image: "HawaiianPizza.jpg",
    description: "Pizza Hawaii thơm ngon",
    price: 120000,
    rating: 4.7,
    sold: 85
  },
  {
    id: 12,
    restaurantId: 13,
    title: "Pepperoni Pizza",
    image: "PepperoniPizza.jpg",
    description: "Pizza xúc xích cay",
    price: 130000,
    rating: 4.8,
    sold: 100
  },
  {
    id: 13,
    restaurantId: [4, 5, 9],
    title: "Cà phê sữa đá",
    image: "caphe_suada.jpg",
    description: "Cà phê truyền thống",
    price: 30000,
    rating: 4.6,
    sold: 250
  },
  {
    id: 14,
    restaurantId: [4, 5, 9],
    title: "Trà đào cam sả",
    image: "tradao.jpg",
    description: "Trà trái cây tươi mát",
    price: 45000,
    rating: 4.7,
    sold: 200
  },
  {
    id: 15,
    restaurantId: [4, 5, 9],
    title: "Latte",
    image: "latte.jpg",
    description: "Latte kem sữa mịn",
    price: 40000,
    rating: 4.5,
    sold: 180
  },
  {
    id: 16,
    restaurantId: [4, 5, 9],
    title: "Bạc xỉu",
    image: "bacxiu.jpg",
    description: "Cà phê sữa nóng",
    price: 35000,
    rating: 4.4,
    sold: 160
  },
  {
    id: 17,
    restaurantId: [6, 19],
    title: "Trà sữa trân châu",
    image: "trasuachantrau.jpg",
    description: "Trà sữa Đài Loan",
    price: 40000,
    rating: 4.8,
    sold: 300
  },
  {
    id: 18,
    restaurantId: [6, 19],
    title: "Trà sữa Thái xanh",
    image: "thaitea.jpg",
    description: "Trà xanh Thái Lan",
    price: 45000,
    rating: 4.7,
    sold: 280
  },
  {
    id: 19,
    restaurantId: [6, 19],
    title: "Hồng trà sữa",
    image: "hongtra.jpg",
    description: "Hồng trà Ceylon",
    price: 38000,
    rating: 4.6,
    sold: 220
  },
  {
    id: 20,
    restaurantId: 8,
    title: "Cơm tấm sườn bì chả",
    image: "comtam.jpg",
    description: "Cơm tấm Sài Gòn",
    price: 55000,
    rating: 4.7,
    sold: 190
  },
  {
    id: 21,
    restaurantId: 8,
    title: "Cơm gà xối mỡ",
    image: "comga.jpg",
    description: "Cơm gà Hải Nam",
    price: 60000,
    rating: 4.6,
    sold: 150
  },
  {
    id: 22,
    restaurantId: 15,
    title: "Cơm niêu cá kho tộ",
    image: "cakhoto.jpg",
    description: "Cá kho miền Nam",
    price: 80000,
    rating: 4.8,
    sold: 120
  },
  {
    id: 23,
    restaurantId: 15,
    title: "Canh chua cá lóc",
    image: "canhchua.jpg",
    description: "Canh chua miền Tây",
    price: 75000,
    rating: 4.7,
    sold: 110
  },
  {
    id: 24,
    restaurantId: 10,
    title: "Bún bò Huế đặc biệt",
    image: "bunbohue.jpg",
    description: "Bún bò Huế chuẩn vị",
    price: 65000,
    rating: 4.9,
    sold: 210
  },
  {
    id: 25,
    restaurantId: 10,
    title: "Bún bò tái nạm",
    image: "bunbotainam.jpg",
    description: "Bún bò tái chín",
    price: 60000,
    rating: 4.7,
    sold: 180
  },
  {
    id: 26,
    restaurantId: 11,
    title: "Phở tái chín",
    image: "phobo.jpg",
    description: "Phở bò Hà Nội",
    price: 65000,
    rating: 4.9,
    sold: 250
  },
  {
    id: 27,
    restaurantId: 11,
    title: "Phở gà",
    image: "phoga.jpg",
    description: "Phở gà thơm ngon",
    price: 60000,
    rating: 4.6,
    sold: 170
  },
  {
    id: 28,
    restaurantId: [12, 17],
    title: "Cơm chay thập cẩm",
    image: "comchay.jpg",
    description: "Cơm chay dinh dưỡng",
    price: 55000,
    rating: 4.5,
    sold: 90
  },
  {
    id: 29,
    restaurantId: [12, 17],
    title: "Bún riêu chay",
    image: "bunrieuchay.jpg",
    description: "Bún riêu chay đậm đà",
    price: 50000,
    rating: 4.4,
    sold: 80
  },
  {
    id: 30,
    restaurantId: [12, 17],
    title: "Lẩu nấm chay",
    image: "launamchay.jpg",
    description: "Lẩu nấm thập cẩm",
    price: 80000,
    rating: 4.7,
    sold: 95
  },
  {
    id: 31,
    restaurantId: 14,
    title: "Sushi cá hồi",
    image: "sushicahoi.jpg",
    description: "Sushi cá hồi tươi",
    price: 120000,
    rating: 4.8,
    sold: 140
  },
  {
    id: 32,
    restaurantId: 14,
    title: "Sashimi tổng hợp",
    image: "sashimi.jpg",
    description: "Sashimi Nhật Bản",
    price: 200000,
    rating: 4.9,
    sold: 85
  },
  {
    id: 33,
    restaurantId: 14,
    title: "Mì Udon",
    image: "udon.jpg",
    description: "Mì Udon Nhật",
    price: 90000,
    rating: 4.6,
    sold: 110
  },
  {
    id: 34,
    restaurantId: 16,
    title: "Gyudon (cơm bò Nhật)",
    image: "gyudon.jpg",
    description: "Cơm bò Sukiya",
    price: 85000,
    rating: 4.7,
    sold: 160
  },
  {
    id: 35,
    restaurantId: 16,
    title: "Curry Rice",
    image: "curryrice.jpg",
    description: "Cơm cà ri Nhật",
    price: 95000,
    rating: 4.8,
    sold: 130
  },
  {
    id: 36,
    restaurantId: [1, 2, 7],
    title: "Coca Cola",
    image: "cocacola.jpg",
    description: "Nước ngọt có ga",
    price: 20000,
    rating: 4.5,
    sold: 400
  },
  {
    id: 37,
    restaurantId: [1, 2, 7],
    title: "Pepsi",
    image: "pepsi.jpg",
    description: "Nước ngọt Pepsi",
    price: 20000,
    rating: 4.5,
    sold: 380
  },
  {
    id: 38,
    restaurantId: [1, 2, 7],
    title: "Kem Sundae",
    image: "sundae.jpg",
    description: "Kem vani sundae",
    price: 25000,
    rating: 4.6,
    sold: 220
  },
  {
    id: 39,
    restaurantId: [4, 5, 9],
    title: "Trà Oolong",
    image: "oolong.jpg",
    description: "Trà Oolong Đài Loan",
    price: 45000,
    rating: 4.7,
    sold: 150
  },
  {
    id: 40,
    restaurantId: [4, 5, 9],
    title: "Espresso",
    image: "espresso.jpg",
    description: "Espresso Ý đậm đà",
    price: 40000,
    rating: 4.6,
    sold: 130
  },
  {
    id: 41,
    restaurantId: 18,
    title: "Bánh tằm bì",
    image: "banhtam.jpg",
    description: "Bánh tằm miền Tây",
    price: 50000,
    rating: 4.8,
    sold: 100
  },
  {
    id: 42,
    restaurantId: 18,
    title: "Bánh tằm nước cốt dừa",
    image: "banhtamduacot.jpg",
    description: "Bánh tằm nước dừa",
    price: 55000,
    rating: 4.7,
    sold: 90
  },
  {
    id: 43,
    restaurantId: [6, 19],
    title: "Trà sữa kem cheese",
    image: "milkteakemcheese.jpg",
    description: "Trà sữa phô mai",
    price: 48000,
    rating: 4.8,
    sold: 190
  },
  {
    id: 44,
    restaurantId: [6, 19],
    title: "Trà sữa Oreo",
    image: "milkteaoreo.jpg",
    description: "Trà sữa bánh Oreo",
    price: 50000,
    rating: 4.7,
    sold: 200
  },
  {
    id: 45,
    restaurantId: 8,
    title: "Cơm tấm gà nướng",
    image: "comtamganuong.jpg",
    description: "Cơm tấm gà nướng sả",
    price: 60000,
    rating: 4.7,
    sold: 140
  },
  {
    id: 46,
    restaurantId: 3,
    title: "Mì Ý bò bằm",
    image: "miybo.jpg",
    description: "Mì Ý sốt bò bằm",
    price: 80000,
    rating: 4.6,
    sold: 110
  },
  {
    id: 48,
    restaurantId: 1,
    title: "Hotdog",
    image: "hotdog.jpg",
    description: "Hotdog xúc xích",
    price: 40000,
    rating: 4.4,
    sold: 150
  },
  {
    id: 49,
    restaurantId: 7,
    title: "Gà sốt cay",
    image: "gasotcay.jpg",
    description: "Gà rán sốt cay Hàn Quốc",
    price: 75000,
    rating: 4.8,
    sold: 170
  },
  {
    id: 50,
    restaurantId: 2,
    title: "Burger Zinger",
    image: "zinger.jpg",
    description: "Burger gà giòn cay",
    price: 65000,
    rating: 4.7,
    sold: 180
  }
]