// Data thuần - dùng chung cho cả Web và Mobile
export const RESTAURANTS_DATA = [
  {
    id: 1,
    name: "Jollibee",
    category: 'fastfood',
    imageName: 'Jollibee.png',
    address: "123 Đường ABC, Quận 1",
    rating: 4.7,
    menu: [],
    isFeatured: true,
    coordinates: {
      latitude: 10.7769,
      longitude: 106.7009
    },
    // ✅ THÊM THÔNG TIN OWNER
    owner: {
      username: 'jollibee_admin',
      password: 'jollibee123',
      email: 'admin@jollibee.com',
      phone: '0901234567',
    }
  },
  {
    id: 2,
    name: "KFC",
    category: 'fastfood',
    imageName: 'KFC.jpg',
    address: "456 Đường XYZ, Quận 3",
    rating: 4.5,
    menu: [],
    isFeatured: true,
    coordinates: {
      latitude: 10.7829,
      longitude: 106.7009
    },
    owner: {
      username: 'kfc_admin',
      password: 'kfc123',
      email: 'admin@kfc.com',
      phone: '0901234568',
    }
  },
  {
    id: 3,
    name: "Texas Chicken",
    category: 'fastfood',
    imageName: 'Texas.png',
    address: "456 Đường XYZ, Quận 3",
    rating: 4.5,
    menu: [],
    isFeatured: false,
    coordinates: {
      latitude: 10.7889,
      longitude: 106.7009
    },
    owner: {
      username: 'texas_admin',
      password: 'texas123',
      email: 'admin@texas.com',
      phone: '0901234569',
    }
  },
  {
    id: 4,
    name: "Phúc Long",
    category: ['coffee','milktea'],
    imageName: 'phuclong.png',
    address: "456 Đường XYZ, Quận 7",
    rating: 4.6,
    menu: [],
    isFeatured: true,
    coordinates: {
      latitude: 10.7329,
      longitude: 106.7209
    },
    owner: {
      username: 'phuclong_admin',
      password: 'phuclong123',
      email: 'admin@phuclong.com',
      phone: '0901234570',
    }
  },
  {
    id: 5,
    name: "Highlands Coffee",
    category: ['coffee','milktea'],
    imageName: 'highland.png',
    address: "456 Đường XYZ, Quận 7",
    rating: 4.6,
    menu: [],
    isFeatured: true,
    coordinates: {
      latitude: 10.7429,
      longitude: 106.7309
    },
    owner: {
      username: 'highlands_admin',
      password: 'highlands123',
      email: 'admin@highlands.com',
      phone: '0901234571',
    }
  },
  {
    id: 6,
    name: "Maycha",
    category: 'milktea',
    imageName: 'maycha.png',
    address: "456 Đường XYZ, Quận 7",
    rating: 4.6,
    menu: [],
    isFeatured: false,
    owner: {
      username: 'maycha_admin',
      password: 'maycha123',
      email: 'admin@maycha.com',
      phone: '0901234572',
    }
  },
  {
    id: 7,
    name: "Lotteria",
    category: "fastfood",
    imageName: 'lotteria.png',
    address: "22 Trần Hưng Đạo, Quận 5",
    rating: 4.3,
    menu: [],
    isFeatured: true,
    owner: {
      username: 'lotteria_admin',
      password: 'lotteria123',
      email: 'admin@lotteria.com',
      phone: '0901234573',
    }
  },
  {
    id: 8,
    name: "Cơm Tấm Cali",
    category: "rice",
    imageName: "cali.png",
    address: "18 Lý Tự Trọng, Quận 1",
    rating: 4.6,
    menu: [],
    isFeatured: false,
    owner: {
      username: 'cali_admin',
      password: 'cali123',
      email: 'admin@cali.com',
      phone: '0901234574',
    }
  },
  {
    id: 20,
    name: "Cơm Tấm Sà Bì Chưởng",
    category: "rice",
    imageName: "sabichuong.jpg",
    address: "20 Trần Bình Trọng, Quận 5",
    rating: 4.6,
    menu: [],
    isFeatured: true,
    owner: {
      username: 'sabichuong_admin',
      password: 'sabichuong123',
      email: 'admin@sabichuong.com',
      phone: '0901234575',
    }
  },
  {
    id: 9,
    name: "The Coffee House",
    category: "coffee",
    imageName: "TCH.jpg",
    address: "23 Nguyễn Thị Minh Khai, Quận 3",
    rating: 4.5,
    menu: [],
    isFeatured: true,
    owner: {
      username: 'tch_admin',
      password: 'tch123',
      email: 'admin@thecoffeehouse.com',
      phone: '0901234576',
    }
  },
  {
    id: 10,
    name: "Bún Bò Huế 3A",
    category: "noodle",
    imageName: "Bunbohue3A.jpg",
    address: "78 Điện Biên Phủ, Quận Bình Thạnh",
    rating: 4.4,
    menu: [],
    isFeatured: false,
    owner: {
      username: 'bunbo3a_admin',
      password: 'bunbo3a123',
      email: 'admin@bunbo3a.com',
      phone: '0901234577',
    }
  },
  {
    id: 11,
    name: "Phở Hòa",
    category: "noodle",
    imageName: "PhoHoa.png",
    address: "260 Pasteur, Quận 3",
    rating: 4.8,
    menu: [],
    isFeatured: true,
    owner: {
      username: 'phohoa_admin',
      password: 'phohoa123',
      email: 'admin@phohoa.com',
      phone: '0901234578',
    }
  },
  {
    id: 12,
    name: "Chay Bồ Đề",
    category: "vegetable",
    imageName: "chaybode.jpg",
    address: "12 Nguyễn Văn Trỗi, Phú Nhuận",
    rating: 4.6,
    menu: [],
    isFeatured: false,
    owner: {
      username: 'chaybode_admin',
      password: 'chaybode123',
      email: 'admin@chaybode.com',
      phone: '0901234579',
    }
  },
  {
    id: 13,
    name: "Pizza Hut",
    category: "fastfood",
    imageName: "pizzahut.jpg",
    address: "11 Hai Bà Trưng, Quận 1",
    rating: 4.4,
    menu: [],
    isFeatured: false,
    owner: {
      username: 'pizzahut_admin',
      password: 'pizzahut123',
      email: 'admin@pizzahut.com',
      phone: '0901234580',
    }
  },
  {
    id: 14,
    name: "Sushi Kei",
    category: "asia",
    imageName: "sushikei.png",
    address: "Vincom Đồng Khởi, Quận 1",
    rating: 4.7,
    menu: [],
    isFeatured: false,
    owner: {
      username: 'sushikei_admin',
      password: 'sushikei123',
      email: 'admin@sushikei.com',
      phone: '0901234581',
    }
  },
  {
    id: 15,
    name: "Cơm Niêu Sài Gòn",
    category: "rice",
    imageName: "comnieusaigon.png",
    address: "75 Lê Văn Sỹ, Quận 3",
    rating: 4.6,
    menu: [],
    isFeatured: true,
    owner: {
      username: 'comnieu_admin',
      password: 'comnieu123',
      email: 'admin@comnieu.com',
      phone: '0901234582',
    }
  },
  {
    id: 16,
    name: "Sukiya",
    category: ["asia","rice"],
    imageName: "sukiya.png",
    address: "Vincom Đồng Khởi, Quận 1",
    rating: 4.7,
    menu: [],
    isFeatured: true,
    owner: {
      username: 'sukiya_admin',
      password: 'sukiya123',
      email: 'admin@sukiya.com',
      phone: '0901234583',
    }
  },
  {
    id: 17,
    name: "Nhà Hàng Chay Mandala",
    category: "vegetable",
    imageName: "mandala.jpg",
    address: "101 Lý Chính Thắng, Quận 3",
    rating: 4.7,
    menu: [],
    isFeatured: true,
    owner: {
      username: 'mandala_admin',
      password: 'mandala123',
      email: 'admin@mandala.com',
      phone: '0901234584',
    }
  },
  {
    id: 18,
    name: "Bánh tằm Thầy Ba",
    category: "asia",
    imageName: "thayba.jpg",
    address: "101 Lý Chính Thắng, Quận 3",
    rating: 4.7,
    menu: [],
    isFeatured: true,
    owner: {
      username: 'thayba_admin',
      password: 'thayba123',
      email: 'admin@thayba.com',
      phone: '0901234585',
    }
  },
  {
    id: 19,
    name: "Hồng Trà Ngô Gia",
    category: "milktea",
    imageName: "ngogia.jpg",
    address: "101 Lý Chính Thắng, Quận 3",
    rating: 4.7,
    menu: [],
    isFeatured: true,
    owner: {
      username: 'ngogia_admin',
      password: 'ngogia123',
      email: 'admin@ngogia.com',
      phone: '0901234586',
    }
  },
];
