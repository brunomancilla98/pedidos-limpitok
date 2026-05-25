import React, { useMemo, useState } from "react";
import logoLimpitok from "./assets/logo-limpitok.jpeg";

const WHATSAPP = "543364029927";
const FREE_DELIVERY_MINIMUM = 30000;
const DELIVERY_BASE_PRICE = 3000;
const DELIVERY_PRICE_PER_KM = 550;

type Tier = "minorista" | "mayorista";
type DeliveryOption = "route" | "paid" | "pickup";

type Format = {
  size: string;
  price: number | null;
  tier: Tier;
  unit?: string;
  minQty?: number;
  maxQty?: number;
  yieldText?: string;
};

type Product = {
  id: number;
  category: string;
  name: string;
  badge?: string;
  formats: Format[];
};

type CartItem = Format & {
  key: string;
  name: string;
  category: string;
  qty: number;
  hasBidon: "si" | "no" | "no aplica";
};

type DeliveryZone = {
  name: string;
  day: string;
  route: string;
  km: number;
};

const PAYMENT_METHODS = [
  "Efectivo",
  "Transferencia",
  "QR",
  "Tarjeta Crédito",
  "Tarjeta Débito"
];

const DELIVERY_ZONES: DeliveryZone[] = [
  { name: "Zona Norte - San Nicolás", day: "Lunes", route: "Ruta 1 | Corredor Norte", km: 9 },
  { name: "Theobald", day: "Lunes", route: "Ruta 1 | Corredor Norte", km: 13 },
  { name: "Empalme Villa Constitución", day: "Lunes", route: "Ruta 1 | Corredor Norte", km: 23 },
  { name: "Villa Constitución", day: "Lunes", route: "Ruta 1 | Corredor Norte", km: 14 },

  { name: "Zona Centro - San Nicolás", day: "Martes", route: "Ruta 2 | Centro / Oeste", km: 3 },
  { name: "Zona Oeste - San Nicolás", day: "Martes", route: "Ruta 2 | Centro / Oeste", km: 7 },
  { name: "Villa Hermosa", day: "Martes", route: "Ruta 2 | Centro / Oeste", km: 12 },
  { name: "Villa Riccio", day: "Martes", route: "Ruta 2 | Centro / Oeste", km: 14 },
  { name: "Villa Campi", day: "Martes", route: "Ruta 2 | Centro / Oeste", km: 15 },
  { name: "La Emilia", day: "Martes", route: "Ruta 2 | Centro / Oeste", km: 17 },

  { name: "Zona Sur - San Nicolás", day: "Jueves", route: "Ruta 4 | Corredor Ramallo", km: 7 },
  { name: "Parque Comirsa", day: "Jueves", route: "Ruta 4 | Corredor Ramallo", km: 8 },
  { name: "Villa General Savio", day: "Jueves", route: "Ruta 4 | Corredor Ramallo", km: 15 },
  { name: "Ramallo", day: "Jueves", route: "Ruta 4 | Corredor Ramallo", km: 27 },
  { name: "Villa Ramallo", day: "Jueves", route: "Ruta 4 | Corredor Ramallo", km: 29 },
  { name: "El Paraíso", day: "Jueves", route: "Ruta 4 | Corredor Ramallo", km: 40 },

  { name: "Zona Sur hasta Ruta 188 - San Nicolás", day: "Viernes", route: "Ruta 3 | Ruta 188 / Interior", km: 7 },
  { name: "Barrios Ruta 188 - San Nicolás", day: "Viernes", route: "Ruta 3 | Ruta 188 / Interior", km: 6 },
  { name: "Campos Salles", day: "Viernes", route: "Ruta 3 | Ruta 188 / Interior", km: 10 },
  { name: "Villa Esperanza", day: "Viernes", route: "Ruta 3 | Ruta 188 / Interior", km: 13 },
  { name: "General Rojo", day: "Viernes", route: "Ruta 3 | Ruta 188 / Interior", km: 18 },
  { name: "Erézcano", day: "Viernes", route: "Ruta 3 | Ruta 188 / Interior", km: 25 },
  { name: "Conesa", day: "Viernes", route: "Ruta 3 | Ruta 188 / Interior", km: 34 }
];

const CONTAINER_PRICES = {
  "5L": 1500,
  "20L": 3800,
  "20KG": 3800
};

const products: Product[] = [
  {
    id: 1,
    category: "Jabones textiles",
    name: "Jabón líquido Tipo Ariel",
    formats: [
      { size: "1L", price: 1200, tier: "minorista" },
      { size: "5L", price: 3000, tier: "minorista" },
      { size: "20L a 99L", price: 400, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 2,
    category: "Jabones textiles",
    name: "Jabón líquido Tipo Skip",
    formats: [
      { size: "1L", price: 1200, tier: "minorista" },
      { size: "5L", price: 3000, tier: "minorista" },
      { size: "20L a 99L", price: 400, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 3,
    category: "Jabones textiles",
    name: "Jabón líquido Uva Caramelo",
    formats: [
      { size: "1L", price: 1600, tier: "minorista" },
      { size: "5L", price: 4000, tier: "minorista" },
      { size: "20L a 99L", price: 635, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 4,
    category: "Jabones textiles",
    name: "Jabón líquido Ariel Premium",
    formats: [
      { size: "1L", price: 1700, tier: "minorista" },
      { size: "5L", price: 4600, tier: "minorista" },
      { size: "20L a 99L", price: 715, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 5,
    category: "Jabones textiles",
    name: "Jabón líquido Skip Premium",
    formats: [
      { size: "1L", price: 1700, tier: "minorista" },
      { size: "5L", price: 4600, tier: "minorista" },
      { size: "20L a 99L", price: 715, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 6,
    category: "Jabones textiles",
    name: "Jabón líquido Ala Matic Premium",
    formats: [
      { size: "1L", price: 1700, tier: "minorista" },
      { size: "5L", price: 4600, tier: "minorista" },
      { size: "20L a 99L", price: 715, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 7,
    category: "Jabones textiles",
    name: "Jabón líquido Ace Premium",
    formats: [
      { size: "1L", price: 1700, tier: "minorista" },
      { size: "5L", price: 4600, tier: "minorista" },
      { size: "20L a 99L", price: 715, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 8,
    category: "Suavizantes textiles",
    name: "Suavizante celeste eco",
    formats: [
      { size: "1L", price: 1600, tier: "minorista" },
      { size: "5L", price: 4250, tier: "minorista" },
      { size: "20L a 99L", price: 680, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 9,
    category: "Suavizantes textiles",
    name: "Suavizante perfumado celeste",
    formats: [
      { size: "1L", price: 1900, tier: "minorista" },
      { size: "5L", price: 5200, tier: "minorista" },
      { size: "20L a 99L", price: 830, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 10,
    category: "Suavizantes textiles",
    name: "Suavizante perfumado New White",
    formats: [
      { size: "1L", price: 1900, tier: "minorista" },
      { size: "5L", price: 5200, tier: "minorista" },
      { size: "20L a 99L", price: 830, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 11,
    category: "Detergentes",
    name: "Detergente lavavajillas limón",
    formats: [
      { size: "1L", price: 2000, tier: "minorista" },
      { size: "5L", price: 5800, tier: "minorista" },
      { size: "20KG a 99KG", price: 885, tier: "mayorista", unit: "x kg", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 12,
    category: "Detergentes",
    name: "Detergente con desengrasante",
    formats: [
      { size: "1L", price: 2400, tier: "minorista" },
      { size: "5L", price: 7400, tier: "minorista" },
      { size: "20KG a 99KG", price: 1140, tier: "mayorista", unit: "x kg", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 13,
    category: "Jabones para manos",
    name: "Jabón para manos coco",
    formats: [
      { size: "1L", price: 1700, tier: "minorista" },
      { size: "5L", price: 4600, tier: "minorista" },
      { size: "20L a 99L", price: 715, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 14,
    category: "Jabones para manos",
    name: "Jabón para manos cherry",
    formats: [
      { size: "1L", price: 1700, tier: "minorista" },
      { size: "5L", price: 4600, tier: "minorista" },
      { size: "20L a 99L", price: 715, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },

  ...makePerfumesTextiles(100, "Perfumes textiles / ambiente / corporal", [
    ["Uva caramelo", 2900, 6100, 2250, 4800],
    ["Mora y crema", 2900, 5900, 2250, 4650],
    ["Frutos rojos", 2900, 6800, 2450, 5350],
    ["Frutilla", 2900, 6200, 2300, 4800],
    ["Cherry", 2900, 6300, 2300, 5000],
    ["Ariel OXY", 2900, 7400, 2600, 5800],
    ["Skip", 2900, 5800, 2250, 4450],
    ["Ala matic", 2900, 6600, 2400, 5150],
    ["Ace", 2900, 5800, 2250, 4450],
    ["Limón", 2900, 5000, 2000, 3900],
    ["Lavanda", 2900, 5000, 2000, 3900],
    ["New White fresco", 2900, 6800, 2450, 5350],
    ["Citronella", 2900, 5800, 2150, 4250],
    ["Confort", 2900, 6200, 2300, 4800],
    ["Colonia de bebé", 2900, 6200, 2250, 4800],
    ["Pradera de bosque", 2900, 5900, 2200, 4600]
  ]),

  {
    id: 200,
    category: "Desengrasantes",
    name: "Desengrasante multiuso",
    formats: [
      { size: "250cc c/push", price: 1700, tier: "minorista" },
      { size: "1L", price: 2600, tier: "minorista" },
      { size: "5L", price: 7200, tier: "minorista" },
      { size: "20L a 99L", price: 1200, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 201,
    category: "Desengrasantes",
    name: "Desengrasante industrial",
    formats: [
      { size: "250cc c/push", price: 2500, tier: "minorista" },
      { size: "1L", price: 4900, tier: "minorista" },
      { size: "5L", price: 18000, tier: "minorista" },
      { size: "20L a 99L", price: 2900, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 202,
    category: "Lavandinas / cloro",
    name: "Lavandina concentrada",
    formats: [
      { size: "1L", price: 900, tier: "minorista" },
      { size: "5L", price: 2500, tier: "minorista" },
      { size: "20L", price: 350, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 203,
    category: "Lavandinas / cloro",
    name: "Cloro líquido puro",
    formats: [
      { size: "1L", price: 1500, tier: "minorista" },
      { size: "5L", price: 4200, tier: "minorista" },
      { size: "20L", price: 650, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 204,
    category: "Lavandinas / cloro",
    name: "Lavandina gel",
    formats: [{ size: "Consultar", price: null, tier: "minorista" }]
  },

  ...makePerfuminas(300, [
    ["Perfumina Uva Caramelo", 2000, 5000, 1700, 4600],
    ["Perfumina Colonia de bebé", 2000, 5000, 1700, 4600],
    ["Perfumina Frutos Rojos", 2000, 5200, 1700, 4800],
    ["Perfumina Frutilla", 2000, 4700, 1700, 4300],
    ["Perfumina Cherry", 2000, 4500, 1700, 4100],
    ["Perfumina Limón", 2000, 4100, 1700, 3800],
    ["Perfumina Lavanda", 2000, 4100, 1700, 3800],
    ["Perfumina Pino", 2000, 4000, 1700, 3700],
    ["Perfumina Citronella", 2000, 4900, 1700, 4500],
    ["Perfumina Citrus", 2000, 4500, 1700, 4100]
  ]),

  ...makeBulkProducts(400, "Insecticidas y varios", [
    ["Fluido creolina negra", 1900, 5300, 21200, 3810],
    ["K-otrina concentrada 1+4", 1200, 3000, 10100, 1810, "Rinde 5 veces más"],
    ["Flit original aceite", 4200, 12600, 36600, 5700],
    ["Flit ecológico", 1400, 3800, 13800, 2600],
    ["Repelente con citronella", 2000, 4250, 16850, 3150],
    ["Cera para pisos", 1800, 4800, 18800, 2900]
  ]),
  {
    id: 406,
    category: "Insecticidas y varios",
    name: "Mojalampazos",
    formats: [
      { size: "250cc", price: 3800, tier: "minorista" },
      { size: "1L", price: 10800, tier: "minorista" }
    ]
  },
  {
    id: 407,
    category: "Insecticidas y varios",
    name: "Matayuyo",
    formats: [
      { size: "250cc", price: 1300, tier: "minorista" },
      { size: "1L", price: 3000, tier: "minorista" },
      { size: "20L a 99L", price: 530, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  },
  {
    id: 408,
    category: "Insecticidas y varios",
    name: "Bicarbonato de limpieza",
    formats: [
      { size: "100gr", price: 600, tier: "minorista" },
      { size: "1/2kg", price: 2500, tier: "minorista" },
      { size: "1kg", price: 4000, tier: "minorista" },
      { size: "+3kg", price: 3500, tier: "mayorista", unit: "x kg", minQty: 3 }
    ]
  },
  ...makePartialBulkProducts(409, "Insecticidas y varios", [
    ["Vinagre de limpieza", 1800, 5300, 995],
    ["Quitasarro concentrado 1+1", 3100, 11300, 2125],
    ["Limpiavidrios", 1700, 4500, 730]
  ]),

  ...makeBulkProducts(500, "Cosmética / limpieza automotor", [
    ["Shampoo siliconado extra teflón", 2100, 5780, 23100, 4360],
    ["Revividor neumáticos siliconado", 1450, 4250, 16850, 3200],
    ["Revividor de neumáticos negro", 1200, 3500, 13500, 2550],
    ["Desengrasante automotor", 2500, 4900, 18000, 2900]
  ]),
  {
    id: 504,
    category: "Cosmética / limpieza automotor",
    name: "Espuma activa",
    formats: [{ size: "Consultar", price: null, tier: "minorista" }]
  }
];

function makePerfumesTextiles(
  startId: number,
  category: string,
  rows: Array<[string, number, number, number, number]>
): Product[] {
  return rows.map(([name, p250, p1, m250, m1], index) => ({
    id: startId + index,
    category,
    name,
    badge: "Mayorista por cantidad",
    formats: [
      { size: "250cc c/push", price: p250, tier: "minorista" },
      { size: "1L", price: p1, tier: "minorista" },
      { size: "250cc c/push mayorista", price: m250, tier: "mayorista", minQty: 4 },
      { size: "1L mayorista", price: m1, tier: "mayorista", minQty: 2 }
    ]
  }));
}

function makePerfuminas(startId: number, rows: Array<[string, number, number, number, number]>): Product[] {
  return rows.map(([name, p250, p1, m250, m1], index) => ({
    id: startId + index,
    category: "Pisos / perfuminas",
    name,
    badge: "Concentrada",
    formats: [
      { size: "250cc", price: p250, tier: "minorista", yieldText: "Rinde 5 litros" },
      { size: "1L", price: p1, tier: "minorista", yieldText: "Rinde 20 litros" },
      { size: "250cc mayorista", price: m250, tier: "mayorista", minQty: 4, yieldText: "Rinde 5 litros" },
      { size: "1L mayorista", price: m1, tier: "mayorista", minQty: 2, yieldText: "Rinde 20 litros" }
    ]
  }));
}

function makeBulkProducts(
  startId: number,
  category: string,
  rows: Array<[string, number, number, number, number, string?]>
): Product[] {
  return rows.map(([name, p250, p1, p5, p20, yieldText], index) => ({
    id: startId + index,
    category,
    name,
    formats: [
      { size: "250cc", price: p250, tier: "minorista", yieldText },
      { size: "1L", price: p1, tier: "minorista", yieldText },
      { size: "5L", price: p5, tier: "minorista", yieldText },
      { size: "20L a 99L", price: p20, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99, yieldText }
    ]
  }));
}

function makePartialBulkProducts(
  startId: number,
  category: string,
  rows: Array<[string, number, number, number]>
): Product[] {
  return rows.map(([name, p1, p5, p20], index) => ({
    id: startId + index,
    category,
    name,
    formats: [
      { size: "1L", price: p1, tier: "minorista" },
      { size: "5L", price: p5, tier: "minorista" },
      { size: "20L a 99L", price: p20, tier: "mayorista", unit: "x litro", minQty: 20, maxQty: 99 }
    ]
  }));
}

const categories = ["Todas", ...Array.from(new Set(products.map(product => product.category)))];

function money(n: number | null) {
  if (n === null) return "Consultar";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(n);
}

function isReturnableFormat(size: string) {
  return size.includes("5L") || size.includes("20L") || size.includes("20KG");
}

function containerPriceFor(size: string) {
  if (size.includes("20KG")) return CONTAINER_PRICES["20KG"];
  if (size.includes("20L")) return CONTAINER_PRICES["20L"];
  if (size.includes("5L")) return CONTAINER_PRICES["5L"];
  return 0;
}

function itemMinQty(format: Format) {
  return format.minQty || 1;
}

function itemMaxQty(format: Format) {
  return format.maxQty;
}

function paidDeliveryCost(zone: DeliveryZone) {
  return DELIVERY_BASE_PRICE + zone.km * DELIVERY_PRICE_PER_KM;
}

export default function App() {
  const [mode, setMode] = useState<Tier>("minorista");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryZoneName, setDeliveryZoneName] = useState(DELIVERY_ZONES[0].name);
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>("route");
  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    phone: "",
    notes: "",
    paymentMethod: "Efectivo"
  });

  const selectedZone = DELIVERY_ZONES.find(zone => zone.name === deliveryZoneName) || DELIVERY_ZONES[0];

  const visibleProducts = useMemo(() => {
    const search = query.toLowerCase().trim();

    return products
      .map(product => ({
        ...product,
        formats: product.formats.filter(format => format.tier === mode)
      }))
      .filter(product => product.formats.length > 0)
      .filter(product => category === "Todas" || product.category === category)
      .filter(product => `${product.name} ${product.category}`.toLowerCase().includes(search));
  }, [mode, category, query]);

  function add(product: Product, format: Format) {
    const key = `${product.id}-${format.size}`;

    setCart(prev => {
      if (prev.some(item => item.key === key)) return prev;

      return [
        ...prev,
        {
          key,
          name: product.name,
          category: product.category,
          ...format,
          qty: itemMinQty(format),
          hasBidon: isReturnableFormat(format.size) ? "si" : "no aplica"
        }
      ];
    });
  }

  function updateQty(key: string, value: number) {
    setCart(prev =>
      prev.map(item => {
        if (item.key !== key) return item;
        const min = itemMinQty(item);
        const max = itemMaxQty(item);
        let qty = Math.max(min, value || min);
        if (max) qty = Math.min(max, qty);
        return { ...item, qty };
      })
    );
  }

  function productSubtotal(item: CartItem) {
    if (item.price === null) return 0;
    return item.price * item.qty;
  }

  function containerSubtotal(item: CartItem) {
    if (!isReturnableFormat(item.size)) return 0;
    if (item.hasBidon !== "no") return 0;
    return containerPriceFor(item.size);
  }

  function subtotal(item: CartItem) {
    return productSubtotal(item) + containerSubtotal(item);
  }

  const productsTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + subtotal(item), 0);
  }, [cart]);

  const hasConsultItems = cart.some(item => item.price === null);
  const qualifiesFreeDelivery = productsTotal >= FREE_DELIVERY_MINIMUM;
  const calculatedPaidDelivery = paidDeliveryCost(selectedZone);

  const deliveryCost = useMemo(() => {
    if (deliveryOption === "pickup") return 0;
    if (deliveryOption === "route" && qualifiesFreeDelivery) return 0;
    return calculatedPaidDelivery;
  }, [deliveryOption, qualifiesFreeDelivery, calculatedPaidDelivery]);

  const finalTotal = productsTotal + deliveryCost;

  const deliveryStatus = useMemo(() => {
    if (deliveryOption === "pickup") return "Retiro por local sin costo.";
    if (deliveryOption === "route" && qualifiesFreeDelivery) {
      return `Envío gratis disponible el ${selectedZone.day}.`;
    }
    if (deliveryOption === "route") {
      return `No llega al mínimo de ${money(FREE_DELIVERY_MINIMUM)}. Puede recibir abonando envío.`;
    }
    return "Envío fuera del día de reparto con costo adicional.";
  }, [deliveryOption, qualifiesFreeDelivery, selectedZone.day]);

  const whatsappText = useMemo(() => {
    const productsText = cart.length
      ? cart.map(item => {
          const containerText = containerSubtotal(item) > 0
            ? `Envase/bidón nuevo: ${money(containerSubtotal(item))}`
            : "";

          const bidonText = isReturnableFormat(item.size)
            ? `Bidón retornable: ${
                item.hasBidon === "si"
                  ? "Sí, entrega envase para recambio"
                  : "No, necesita bidón/envase nuevo"
              }`
            : "";

          return `• ${item.name}
Formato: ${item.size}
Cantidad: ${item.qty}
Precio: ${item.price === null ? "Consultar" : `${money(item.price)} ${item.unit || ""}`}
${item.yieldText ? `Rinde: ${item.yieldText}` : ""}
Producto: ${item.price === null ? "Consultar" : money(productSubtotal(item))}
${containerText}
${bidonText}
Subtotal: ${item.price === null ? "Consultar" : money(subtotal(item))}`;
        }).join("\n\n")
      : "Sin productos cargados";

    const deliveryOptionText =
      deliveryOption === "pickup"
        ? "Retiro por local"
        : deliveryOption === "route"
          ? "Reparto de zona"
          : "Envío fuera de día de reparto";

    return encodeURIComponent(
`Hola Limpitok, quiero hacer este pedido:

CLIENTE
Nombre: ${customer.name || "-"}
Dirección: ${customer.address || "-"}
Teléfono: ${customer.phone || "-"}

PRODUCTOS

${productsText}

ENTREGA
Zona/localidad: ${selectedZone.name}
Ruta: ${selectedZone.route}
Día de reparto gratis: ${selectedZone.day}
Opción elegida: ${deliveryOptionText}
Estado: ${deliveryStatus}
Costo de envío: ${money(deliveryCost)}

PAGO
Forma de pago: ${customer.paymentMethod}

TOTALES
Productos: ${hasConsultItems ? `${money(productsTotal)} + productos a consultar` : money(productsTotal)}
Total final: ${hasConsultItems ? `${money(finalTotal)} + productos a consultar` : money(finalTotal)}

Observaciones: ${customer.notes || "-"}`
    );
  }, [cart, customer, selectedZone, deliveryOption, deliveryStatus, deliveryCost, productsTotal, finalTotal, hasConsultItems]);

  return (
    <>
      <style>{css}</style>

      <div className="page">
        <header className="header">
          <img className="logo" src={logoLimpitok} alt="Limpitok" />
          <div>
            <h1>Limpitok</h1>
            <p>Pedido rápido por WhatsApp</p>
            <span>Av. Illia 645 · San Nicolás · 3364 02-9927</span>
          </div>
        </header>

        <section className="modeBox">
          <button className={mode === "minorista" ? "mode active" : "mode"} onClick={() => setMode("minorista")}>
            Minorista
            <span>Unidades, 1L y 5L</span>
          </button>

          <button className={mode === "mayorista" ? "mode active" : "mode"} onClick={() => setMode("mayorista")}>
            Mayorista
            <span>20L/20KG o promos por cantidad</span>
          </button>
        </section>

        <section className="filters">
          <input placeholder="Buscar producto" value={query} onChange={e => setQuery(e.target.value)} />
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(item => <option key={item}>{item}</option>)}
          </select>
        </section>

        <main className="layout">
          <section className="products">
            {visibleProducts.map(product => (
              <article className="product" key={product.id}>
                <div className="productHeader">
                  <div>
                    <p className="category">{product.category}</p>
                    <h2>{product.name}</h2>
                  </div>
                  {product.badge && <span className="badge">{product.badge}</span>}
                </div>

                {product.formats.map(format => (
                  <div className="format" key={format.size}>
                    <div>
                      <strong>{format.size}</strong>
                      <p className="price">{money(format.price)} {format.unit || ""}</p>
                      {format.minQty && <p className="detail">Mínimo: {format.minQty}</p>}
                      {format.yieldText && <p className="detail">{format.yieldText}</p>}
                      {isReturnableFormat(format.size) && <p className="detail">Bidón retornable</p>}
                    </div>

                    <button className="addButton" onClick={() => add(product, format)}>
                      Agregar
                    </button>
                  </div>
                ))}
              </article>
            ))}
          </section>

          <aside className="cart">
            <h2>Pedido</h2>

            {cart.length === 0 && <p className="empty">Todavía no agregaste productos.</p>}

            {cart.map(item => (
              <div className="cartItem" key={item.key}>
                <strong>{item.name}</strong>
                <p>{item.size}</p>

                <label>Cantidad</label>
                <input
                  type="number"
                  value={item.qty}
                  min={itemMinQty(item)}
                  max={itemMaxQty(item)}
                  onChange={e => updateQty(item.key, Number(e.target.value))}
                />

                {isReturnableFormat(item.size) && (
                  <>
                    <label>¿Tiene bidón para recambio?</label>
                    <select
                      value={item.hasBidon}
                      onChange={e => {
                        const value = e.target.value as "si" | "no";
                        setCart(prev =>
                          prev.map(cartItem =>
                            cartItem.key === item.key ? { ...cartItem, hasBidon: value } : cartItem
                          )
                        );
                      }}
                    >
                      <option value="si">Sí, entrega bidón</option>
                      <option value="no">No, necesita bidón nuevo</option>
                    </select>
                  </>
                )}

                <p className="subtotal">Producto: {item.price === null ? "Consultar" : money(productSubtotal(item))}</p>

                {containerSubtotal(item) > 0 && (
                  <p className="subtotal">Bidón/envase nuevo: {money(containerSubtotal(item))}</p>
                )}

                <p className="subtotal">Subtotal: {item.price === null ? "Consultar" : money(subtotal(item))}</p>

                <button className="remove" onClick={() => setCart(prev => prev.filter(cartItem => cartItem.key !== item.key))}>
                  Quitar
                </button>
              </div>
            ))}

            <div className="panel">
              <h3>Entrega</h3>

              <label>Zona/localidad</label>
              <select value={deliveryZoneName} onChange={e => setDeliveryZoneName(e.target.value)}>
                {DELIVERY_ZONES.map(zone => (
                  <option key={zone.name}>{zone.name}</option>
                ))}
              </select>

              <div className="deliveryInfo">
                <strong>{selectedZone.day}</strong>
                <span>{selectedZone.route}</span>
                <span>{selectedZone.km} km desde Av. Illia 645</span>
              </div>

              <label>Forma de entrega</label>
              <select value={deliveryOption} onChange={e => setDeliveryOption(e.target.value as DeliveryOption)}>
                <option value="route">Reparto de zona</option>
                <option value="paid">Envío fuera de día de reparto</option>
                <option value="pickup">Retiro por local</option>
              </select>

              <p className={deliveryCost === 0 ? "goodNotice" : "notice"}>{deliveryStatus}</p>
              <p className="subtotal">Envío: {money(deliveryCost)}</p>
            </div>

            <div className="panel">
              <h3>Datos del cliente</h3>

              <input placeholder="Nombre" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
              <input placeholder="Dirección" value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} />
              <input placeholder="Teléfono" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} />

              <label>Forma de pago</label>
              <select value={customer.paymentMethod} onChange={e => setCustomer({ ...customer, paymentMethod: e.target.value })}>
                {PAYMENT_METHODS.map(method => <option key={method}>{method}</option>)}
              </select>

              <textarea placeholder="Observaciones" value={customer.notes} onChange={e => setCustomer({ ...customer, notes: e.target.value })} />
            </div>

            <div className="totalBox">
              <p>Productos: {hasConsultItems ? `${money(productsTotal)} + consultar` : money(productsTotal)}</p>
              <p>Envío: {money(deliveryCost)}</p>
              <strong>Total: {hasConsultItems ? `${money(finalTotal)} + consultar` : money(finalTotal)}</strong>
            </div>

            <a className="whatsapp" href={`https://wa.me/${WHATSAPP}?text=${whatsappText}`} target="_blank" rel="noreferrer">
              Enviar pedido por WhatsApp
            </a>
          </aside>
        </main>
      </div>
    </>
  );
}

const css = `
* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

.page {
  min-height: 100vh;
  background: #f4f7fb;
  color: #162033;
  font-family: Arial, sans-serif;
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #ffffff;
  border-bottom: 1px solid #dde5ee;
  padding: 18px;
}

.logo {
  width: 92px;
  height: 92px;
  object-fit: cover;
  border-radius: 14px;
  border: 1px solid #d9e4f0;
}

.header h1 {
  margin: 0;
  color: #0057a8;
  font-size: 34px;
}

.header p {
  margin: 5px 0;
  font-weight: 700;
}

.header span {
  color: #5d6b7a;
}

.modeBox,
.filters {
  display: grid;
  gap: 10px;
  padding: 14px;
}

.modeBox {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.filters {
  grid-template-columns: 1fr 240px;
  padding-top: 0;
}

.mode,
button,
select,
input,
textarea {
  font: inherit;
}

.mode {
  background: #ffffff;
  border: 1px solid #cfd9e5;
  border-radius: 10px;
  padding: 14px;
  cursor: pointer;
  font-weight: 800;
  color: #162033;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mode span {
  font-weight: 500;
  color: #65758a;
}

.mode.active {
  background: #0057a8;
  border-color: #0057a8;
  color: #ffffff;
}

.mode.active span {
  color: #eaf4ff;
}

input,
select,
textarea {
  width: 100%;
  padding: 11px;
  border-radius: 8px;
  border: 1px solid #cfd9e5;
  background: #ffffff;
  margin-top: 8px;
}

textarea {
  min-height: 80px;
  resize: vertical;
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 390px;
  gap: 14px;
  padding: 14px;
}

.products {
  display: grid;
  gap: 12px;
  align-content: start;
}

.product,
.cart,
.panel,
.cartItem {
  background: #ffffff;
  border: 1px solid #dde5ee;
  border-radius: 10px;
}

.product {
  padding: 14px;
}

.productHeader {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.category {
  margin: 0;
  color: #0057a8;
  font-size: 13px;
  font-weight: 800;
}

.product h2 {
  margin: 4px 0 8px;
  font-size: 20px;
}

.badge {
  background: #e8f2ff;
  color: #0057a8;
  border-radius: 8px;
  padding: 5px 8px;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}

.format {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  border-top: 1px solid #edf2f7;
  padding-top: 12px;
  margin-top: 12px;
}

.price {
  margin: 4px 0;
  font-weight: 700;
}

.detail {
  margin: 3px 0;
  color: #65758a;
  font-size: 13px;
}

.addButton {
  background: #0057a8;
  color: #ffffff;
  border: 0;
  border-radius: 8px;
  padding: 10px 12px;
  cursor: pointer;
  font-weight: 800;
}

.cart {
  padding: 14px;
  height: fit-content;
  position: sticky;
  top: 10px;
}

.cart h2,
.panel h3 {
  margin: 0 0 10px;
}

.empty {
  color: #65758a;
}

.cartItem {
  padding: 10px;
  margin-bottom: 10px;
}

.cartItem p {
  margin: 5px 0;
  color: #65758a;
}

label {
  display: block;
  margin-top: 10px;
  font-size: 13px;
  font-weight: 800;
}

.subtotal {
  color: #162033 !important;
  font-weight: 800;
}

.remove {
  background: #fff1f2;
  color: #be123c;
  border: 1px solid #fecdd3;
  border-radius: 8px;
  padding: 8px 10px;
  cursor: pointer;
}

.panel {
  padding: 12px;
  margin-top: 12px;
}

.deliveryInfo {
  display: grid;
  gap: 3px;
  background: #f4f7fb;
  border: 1px solid #e3eaf2;
  border-radius: 8px;
  padding: 10px;
  margin-top: 10px;
  color: #4b5b6d;
}

.deliveryInfo strong {
  color: #0057a8;
}

.notice,
.goodNotice {
  border-radius: 8px;
  padding: 10px;
  margin: 10px 0;
  font-weight: 700;
}

.notice {
  background: #fff7ed;
  color: #9a3412;
}

.goodNotice {
  background: #ecfdf5;
  color: #047857;
}

.totalBox {
  border-top: 1px solid #dde5ee;
  margin-top: 12px;
  padding-top: 12px;
}

.totalBox p {
  display: flex;
  justify-content: space-between;
  margin: 6px 0;
}

.totalBox strong {
  display: flex;
  justify-content: space-between;
  font-size: 21px;
  margin-top: 8px;
}

.whatsapp {
  display: block;
  background: #16a34a;
  color: #ffffff;
  text-align: center;
  padding: 14px;
  border-radius: 10px;
  font-weight: 900;
  text-decoration: none;
  margin-top: 12px;
}

@media (max-width: 850px) {
  .header {
    align-items: flex-start;
  }

  .logo {
    width: 76px;
    height: 76px;
  }

  .header h1 {
    font-size: 28px;
  }

  .filters,
  .layout {
    grid-template-columns: 1fr;
  }

  .cart {
    position: static;
  }
}

@media (max-width: 520px) {
  .modeBox {
    grid-template-columns: 1fr;
  }

  .format {
    align-items: flex-start;
  }

  .addButton {
    min-width: 92px;
  }
}
`;