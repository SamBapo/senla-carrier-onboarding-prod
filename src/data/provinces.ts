export interface ProvinceOption {
  value: string;
  label: string;
  region: string;
  provinces: string[];
}

// Helper function to remove Vietnamese accents for searching
export const removeAccents = (str: string): string => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

export const PROVINCE_OPTIONS: ProvinceOption[] = [
  // South
  {
    value: "an-giang",
    label: "An Giang",
    region: "South",
    provinces: ["An Giang", "Kiên Giang"].sort(),
  },
  {
    value: "can-tho",
    label: "Cần Thơ",
    region: "South",
    provinces: ["Cần Thơ", "Hậu Giang", "Sóc Trăng"].sort(),
  },
  {
    value: "ca-mau",
    label: "Cà Mau",
    region: "South",
    provinces: ["Bạc Liêu", "Cà Mau"].sort(),
  },
  {
    value: "dak-lak",
    label: "Đắk Lắk",
    region: "South",
    provinces: ["Đắk Lắk", "Phú Yên"].sort(),
  },
  {
    value: "dong-nai",
    label: "Đồng Nai",
    region: "South",
    provinces: ["Bình Phước", "Đồng Nai"].sort(),
  },
  {
    value: "dong-thap",
    label: "Đồng Tháp",
    region: "South",
    provinces: ["Đồng Tháp", "Tiền Giang"].sort(),
  },
  {
    value: "hcm",
    label: "Ho Chi Minh",
    region: "South",
    provinces: ["Bà Rịa–Vũng Tàu", "Bình Dương", "Ho Chi Minh"].sort(),
  },
  {
    value: "tay-ninh",
    label: "Tây Ninh",
    region: "South",
    provinces: ["Long An", "Tây Ninh"].sort(),
  },
  {
    value: "vinh-long",
    label: "Vĩnh Long",
    region: "South",
    provinces: ["Bến Tre", "Trà Vinh", "Vĩnh Long"].sort(),
  },
  
  // Central
  {
    value: "da-nang",
    label: "Đà Nẵng",
    region: "Central",
    provinces: ["Đà Nẵng", "Quảng Nam"].sort(),
  },
  {
    value: "gia-lai",
    label: "Gia Lai",
    region: "Central",
    provinces: ["Bình Định", "Gia Lai"].sort(),
  },
  {
    value: "hue",
    label: "Huế",
    region: "Central",
    provinces: ["Huế"],
  },
  {
    value: "khanh-hoa",
    label: "Khánh Hòa",
    region: "Central",
    provinces: ["Khánh Hòa", "Ninh Thuận"].sort(),
  },
  {
    value: "lam-dong",
    label: "Lâm Đồng",
    region: "Central",
    provinces: ["Bình Thuận", "Đắk Nông", "Lâm Đồng"].sort(),
  },
  {
    value: "quang-ngai",
    label: "Quảng Ngãi",
    region: "Central",
    provinces: ["Kon Tum", "Quảng Ngãi"].sort(),
  },
  {
    value: "quang-tri",
    label: "Quảng Trị",
    region: "Central",
    provinces: ["Quảng Bình", "Quảng Trị"].sort(),
  },

  // North Central & Northern Mountains
  {
    value: "cao-bang",
    label: "Cao Bằng",
    region: "North Central & Northern Mountains",
    provinces: ["Cao Bằng"],
  },
  {
    value: "dien-bien",
    label: "Điện Biên",
    region: "North Central & Northern Mountains",
    provinces: ["Điện Biên"],
  },
  {
    value: "ha-tinh",
    label: "Hà Tĩnh",
    region: "North Central & Northern Mountains",
    provinces: ["Hà Tĩnh"],
  },
  {
    value: "lai-chau",
    label: "Lai Châu",
    region: "North Central & Northern Mountains",
    provinces: ["Lai Châu"],
  },
  {
    value: "lang-son",
    label: "Lạng Sơn",
    region: "North Central & Northern Mountains",
    provinces: ["Lạng Sơn"],
  },
  {
    value: "nghe-an",
    label: "Nghệ An",
    region: "North Central & Northern Mountains",
    provinces: ["Nghệ An"],
  },
  {
    value: "quang-ninh",
    label: "Quảng Ninh",
    region: "North Central & Northern Mountains",
    provinces: ["Quảng Ninh"],
  },
  {
    value: "son-la",
    label: "Sơn La",
    region: "North Central & Northern Mountains",
    provinces: ["Sơn La"],
  },
  {
    value: "thanh-hoa",
    label: "Thanh Hóa",
    region: "North Central & Northern Mountains",
    provinces: ["Thanh Hóa"],
  },

  // North
  {
    value: "bac-ninh",
    label: "Bắc Ninh",
    region: "North",
    provinces: ["Bắc Giang", "Bắc Ninh"].sort(),
  },
  {
    value: "hai-phong",
    label: "Hải Phòng",
    region: "North",
    provinces: ["Hải Dương", "Hải Phòng"].sort(),
  },
  {
    value: "hanoi",
    label: "Hà Nội",
    region: "North",
    provinces: ["Hà Nội"],
  },
  {
    value: "hung-yen",
    label: "Hưng Yên",
    region: "North",
    provinces: ["Hưng Yên", "Thái Bình"].sort(),
  },
  {
    value: "lao-cai",
    label: "Lào Cai",
    region: "North",
    provinces: ["Lào Cai", "Yên Bái"].sort(),
  },
  {
    value: "ninh-binh",
    label: "Ninh Bình",
    region: "North",
    provinces: ["Hà Nam", "Nam Định", "Ninh Bình"].sort(),
  },
  {
    value: "phu-tho",
    label: "Phú Thọ",
    region: "North",
    provinces: ["Hòa Bình", "Phú Thọ", "Vĩnh Phúc"].sort(),
  },
  {
    value: "thai-nguyen",
    label: "Thái Nguyên",
    region: "North",
    provinces: ["Bắc Kạn", "Thái Nguyên"].sort(),
  },
  {
    value: "tuyen-quang",
    label: "Tuyên Quang",
    region: "North",
    provinces: ["Hà Giang", "Tuyên Quang"].sort(),
  },
];

export const REGIONS = [
  "South",
  "Central",
  "North Central & Northern Mountains",
  "North",
] as const;

export const REGION_TRANSLATIONS = {
  en: {
    "South": "South",
    "Central": "Central",
    "North Central & Northern Mountains": "North Central & Northern Mountains",
    "North": "North",
  },
  vi: {
    "South": "Miền Nam",
    "Central": "Miền Trung",
    "North Central & Northern Mountains": "Miền Trung Bắc & Miền Núi Phía Bắc",
    "North": "Miền Bắc",
  }
};
