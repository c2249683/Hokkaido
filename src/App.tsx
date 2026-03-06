import React, { useState, useMemo } from "react";
import {
  Calendar,
  MapPin,
  Utensils,
  Plane,
  Hotel,
  CloudSun,
  Map,
  Hash,
  X,
  Bus,
  CheckSquare,
  Square,
  ShoppingBag,
  Briefcase,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- 1. 行程資料庫 (完全保留 3/13-3/20 行程，僅優化 description) ---
const TRAVEL_DATA = [
  {
    date: "03/13",
    weekday: "Fri",
    location: "函館",
    weather: "2°C ☁️",
    topInfo: {
      flight: {
        code: "IT236",
        time: "06:45 ~ 11:10",
        route: "桃園機場(T1) ✈️ 函館機場",
      },
      hotel: {
        name: "Hotel Global View Hakodate",
        code: "5779707711",
        tel: "(+81)138-23-8585",
      },
    },
    items: [
      {
        type: "transport",
        time: "06:45",
        title: "航班 IT236 報到出發",
        detail: "TPE ✈️ HKD",
        badge: "去程",
        description:
          "帶著滿滿的期待前往桃園機場！搭乘台灣虎航直飛函館，預計於 11:10 抵達北國大地，開啟這趟冬季雪國之旅。",
      },
      {
        type: "food",
        time: "11:10",
        title: "抵達函館機場與午餐",
        detail: "入境手續 & 航廈 3 樓午餐",
        badge: "機場停留",
        description:
          "11:10 – 12:40。順利入境後，先在機場國內線航廈 3 樓尋找在地拉麵或定食墊墊胃，簡單解決抵達後的第一餐。",
      },
      {
        type: "transport",
        time: "12:50",
        title: "前往飯店 Check-in",
        detail: "機場 ✈️ 市區飯店",
        badge: "交通接駁",
        description:
          "12:50 – 13:20。搭乘計程車前往 Hotel Global View Hakodate。飯店地理位置優越，先辦理入住或寄放行李，讓後續行程更輕鬆。",
      },
      {
        type: "spot",
        time: "13:45",
        title: "湯倉神社",
        detail: "兔子神社與釣神籤體驗",
        badge: "必玩景點",
        description:
          "這裏是湯之川溫泉的發祥地。最特別的是可以體驗用「釣魚」的方式釣起可愛的兔子神籤，是旅遊手帳必備的打卡點！",
      },
      {
        type: "spot",
        time: "15:15",
        title: "五稜郭公園",
        detail: "六花亭下午茶與星形堡壘",
        badge: "人氣推薦",
        description:
          "登上五稜郭塔俯瞰壯麗的星形要塞。隨後前往旁邊的六花亭，坐在整片落地窗前，邊喝咖啡邊品嚐季節甜點，享受雪景時光。",
      },
      {
        type: "food",
        time: "18:00",
        title: "奧芝商店 湯咖哩",
        detail: "推薦：招牌蝦湯頭",
        badge: "在地美食",
        description:
          "函館超熱門的湯咖哩名店。推薦必點濃郁的「蝦湯頭」，鮮甜滋味搭配在地新鮮野菜，是冬季暖心首選。",
      },
    ],
  },
  {
    date: "03/14",
    weekday: "Sat",
    location: "函館",
    weather: "1°C ❄️",
    topInfo: {
      hotel: {
        name: "Hotel Global View Hakodate",
        code: "5779707711",
        tel: "(+81)138-23-8585",
      },
    },
    items: [
      {
        type: "food",
        time: "08:30",
        title: "飯店早餐",
        detail: "08:30 – 09:30",
        badge: "飯店早餐",
        description:
          "在飯店享用精心準備的日式與西式百匯早餐，為今天的漫步行程補足活力。",
      },
      {
        type: "food",
        time: "10:30",
        title: "函館朝市 (10:30 – 12:30)",
        detail: "釣烏賊體驗與海鮮午餐",
        badge: "朝市必訪",
        description:
          "北海道海鮮的大本營！親自挑戰釣活烏賊，現釣現吃體驗爽脆口感，再點份澎湃的海鮮丼飯或碳烤帝王蟹腳。",
      },
      {
        type: "spot",
        time: "13:00",
        title: "金森紅磚倉庫與元町漫步",
        detail: "13:00 – 16:30",
        badge: "城市散策",
        description:
          "在復古的紅磚建築間尋寶，必嚐 SNAFFLE’S 的起司蛋糕。隨後沿著緩坡走向八幡坂，遠眺海港美景，感受元町的異國風情。",
      },
      {
        type: "spot",
        time: "16:30",
        title: "函館山夜景",
        detail: "16:30 – 18:30",
        badge: "百萬夜景",
        description:
          "趁著日落前上山，看著天空從橙色轉為藍色調 (Blue Hour)，直到萬家燈火點亮世界三大夜景之一的璀璨曲線。",
      },
      {
        type: "food",
        time: "19:00",
        title: "晚餐：幸運小丑漢堡",
        detail: "海灣地區本店",
        badge: "在地限定",
        description:
          "函館人的靈魂食物。推薦招牌「中華雞腿堡」與淋上濃郁起司肉醬的薯條，在極具特色的店裝內飽餐一頓。",
      },
    ],
  },
  {
    date: "03/15",
    weekday: "Sun",
    location: "星野 Tomamu",
    weather: "-5°C ❄️",
    topInfo: {
      flight: {
        code: "NH4854",
        time: "12:10 ~ 12:50",
        route: "函館 ✈️ 新千歲",
      },
      hotel: {
        name: "Tomamu The Tower",
        code: "1mxgsd0zdx",
        tel: "(+81) 167-58-1111",
      },
    },
    items: [
      {
        type: "food",
        time: "08:00",
        title: "飯店早餐",
        detail: "最後的函館早餐時間",
        badge: "早餐",
        description:
          "悠閒吃早餐並辦理退房，準備告別充滿魅力的函館，前往下一站。",
      },
      {
        type: "transport",
        time: "09:30",
        title: "退房與前往機場",
        detail: "搭乘計程車/接駁車",
        badge: "出發",
        description:
          "搭車前往函館機場，這趟行程將利用國內線轉移，節省了將近 4 小時的拉車時間。",
      },
      {
        type: "transport",
        time: "12:10",
        title: "航班 NH4854",
        detail: "函館 ✈️ 新千歲",
        badge: "國內飛行",
        description:
          "12:10 – 12:50。體驗短程國內飛行，從空中俯視北海道壯麗的雪白大地。",
      },
      {
        type: "transport",
        time: "14:20",
        title: "Resort Liner 接駁巴士",
        detail: "機場 ✈️ 星野度假村",
        badge: "已預約",
        description:
          "預約號碼：25X03150286。請準時於 14:20 上車，接駁巴士將帶領我們直接進入星野夢幻國度。",
      },
      {
        type: "hotel",
        time: "17:00",
        title: "星野 The Tower 入住",
        detail: "Check-in & 安置",
        badge: "飯店入住",
        description:
          "抵達度假村的地標雙塔。辦理入住後，可以先在房間欣賞窗外壯闊的雪林景色。",
      },
    ],
  },
  {
    date: "03/16",
    weekday: "Mon",
    location: "星野度假村",
    weather: "-8°C ⛄",
    topInfo: {
      hotel: {
        name: "Tomamu The Tower",
        code: "1mxgsd0zdx",
        tel: "(+81) 167-58-1111",
      },
    },
    items: [
      {
        type: "food",
        time: "08:00",
        title: "星野度假村早餐",
        detail: "開啟活力的一天",
        badge: "早餐",
        description:
          "在度假村內的森林餐廳或其他特色餐館享用早餐，看著雪景用餐是最高等級的享受。",
      },
      {
        type: "spot",
        time: "FREE",
        title: "夢幻美景與打卡點",
        detail: "霧冰平台 & 水之教堂",
        badge: "必去朝聖",
        description:
          "● 霧冰平台：搭乘纜車直達山頂，飽覽掛滿冰晶的森林景象。\n● 水之教堂：親自感受安藤忠雄大師筆下，光、影與十字架在雪地中交織的靜謐美學。",
      },
      {
        type: "spot",
        time: "FREE",
        title: "水域放鬆體驗",
        detail: "微笑海灘 & 木林之湯",
        badge: "恆溫30°C",
        description:
          "● 微笑海灘：即使窗外大雪，室內依然如熱帶島嶼般溫暖，享受全日最大人造浪。\n● 木林之湯：在冷洌的空氣中浸入溫泉，與森林零距離接觸。",
      },
      {
        type: "food",
        time: "19:15",
        title: "晚餐：Hal 吃到飽",
        detail: "已預約",
        badge: "預約確認",
        description:
          "Buffet Dining Hal 的必吃清單：鐵板炙燒干貝、頂級牛肉料理。豐富的海鮮食材絕對讓你大呼過癮。",
      },
    ],
  },
  {
    date: "03/17",
    weekday: "Tue",
    location: "美瑛 → 札幌",
    weather: "-3°C ❄️",
    topInfo: {
      hotel: {
        name: "Holiday Inn & Suites Sapporo",
        code: "1677237493",
        tel: "(+81) 11-272-0555",
      },
    },
    items: [
      {
        type: "food",
        time: "08:00",
        title: "星野度假村早餐",
        detail: "準備退房",
        badge: "早餐",
        description: "最後巡禮星野渡假村，享用完精緻早餐後出發。",
      },
      {
        type: "transport",
        time: "10:00",
        title: "星野度假村出發",
        detail: "前往美瑛",
        badge: "出發",
        description:
          "包車/專車行程正式啟動。今日將穿過如詩如畫的美瑛丘陵，進入北海道最美的農田心臟地帶。",
      },
      {
        type: "spot",
        time: "11:00",
        title: "美瑛神社",
        detail: "停留 30 分鐘",
        badge: "景點",
        description:
          "以祈求良緣聞名的神社，尋找隱藏在屋簷、掛飾各處的「心形」圖案（豬目），保佑旅途平安。",
      },
      {
        type: "spot",
        time: "12:00",
        title: "白鬚瀑布",
        detail: "停留 40 分鐘",
        badge: "景點",
        description:
          "從岩石縫隙中湧出的瀑布匯入美瑛川，鈷藍色的河水與岸邊冰雪交融，是冬日北海道最具代表性的畫面。",
      },
      {
        type: "hotel",
        time: "16:40",
        title: "抵達札幌飯店",
        detail: "Check-in",
        badge: "抵達",
        description:
          "抵達札幌 Holiday Inn & Suites。飯店位於市中心，生活機能絕佳，稍作休息後即可外出覓食。",
      },
      {
        type: "food",
        time: "18:45",
        title: "晚餐：焼肉 肉ます",
        detail: "札幌和牛燒肉 (已預約)",
        badge: "和牛",
        description:
          "在充滿氛圍的燒肉店享用高品質和牛。看著油脂在炭火上滋滋作響，是疲勞行程後最療癒的事。",
      },
    ],
  },
  {
    date: "03/18",
    weekday: "Wed",
    location: "札幌 → 小樽",
    weather: "-1°C ❄️",
    topInfo: {
      hotel: {
        name: "Holiday Inn & Suites Sapporo",
        code: "1677237493",
        tel: "(+81) 11-272-0555",
      },
    },
    items: [
      {
        type: "transport",
        time: "09:00",
        title: "札幌飯店出發",
        detail: "開始一日遊",
        badge: "出發",
        description:
          "今天是一整天的小樽與神宮之旅，準備好舒適的鞋子和保暖衣物。",
      },
      {
        type: "spot",
        time: "10:35",
        title: "北海道神宮",
        detail: "10:35 - 12:00",
        badge: "必訪名勝",
        description:
          "造訪北海道總鎮守。漫步在參天古樹夾道的神宮境內，別忘了品嚐限定的「六花亭判官樣」現燒餅。",
      },
      {
        type: "food",
        time: "13:00",
        title: "Century soup curry & Indian Nepalese curry",
        detail: "13:00 - 14:00",
        badge: "午餐",
        description:
          "品嚐風味獨特的湯咖哩與尼泊爾咖哩。香料濃郁且暖胃，是冬季旅遊的最佳能量補給。",
      },
      {
        type: "spot",
        time: "14:00",
        title: "小樽散策：堺町通商店街",
        detail: "14:00 - 16:00",
        badge: "漫步小樽",
        description:
          "彷彿走進宮崎駿的童話世界。在玻璃藝品店尋寶、參觀音樂盒堂，別錯過北一硝子的三色冰淇淋。",
      },
      {
        type: "spot",
        time: "16:15",
        title: "小樽水族館",
        detail: "16:15 - 17:15",
        badge: "海洋體驗",
        description:
          "位於小樽海岸邊。冬季最著名的就是企鵝遊行與有趣的海洋生物表演，大小朋友都會被療癒。",
      },
      {
        type: "transport",
        time: "18:00",
        title: "抵達札幌飯店",
        detail: "返回休息",
        badge: "回程",
        description:
          "帶著小樽採買的伴手禮與戰利品回到札幌，稍微歇腳後再去探索夜晚的薄野地區。",
      },
      {
        type: "food",
        time: "18:30",
        title: "晚餐：飯店附近吃",
        detail: "自由探索",
        badge: "晚餐",
        description:
          "飯店周邊美食雲集，無論是拉麵橫丁的濃厚味噌拉麵，或是居酒屋的新鮮刺身，都能自由決定。",
      },
    ],
  },
  {
    date: "03/19",
    weekday: "Thu",
    location: "札幌 → 千歲",
    weather: "0°C ☁️",
    topInfo: {
      hotel: {
        name: "JR INN Chitose",
        code: "JRINN2026",
        tel: "(+81) 123-25-2111",
      },
    },
    items: [
      {
        type: "transport",
        time: "10:00",
        title: "計程車前往諏訪神社",
        detail: "約 10 分鐘車程",
        badge: "交通",
        description: "移動約 3.2 公里，省去推行李在雪地漫步的體力。",
      },
      {
        type: "spot",
        time: "10:15",
        title: "諏訪神社",
        detail: "10:15 - 11:30",
        badge: "網美景點",
        description:
          "這裏以精美的「花手水」和特殊「透明御守」在社群媒體爆紅，是收集精美御守的絕佳地點。",
      },
      {
        type: "food",
        time: "11:30",
        title: "午餐：SIROYA",
        detail: "11:30 - 13:00",
        badge: "法式吐司",
        description:
          "在大通站附近享受精緻的午餐，特別推薦他們的招牌法式吐司，口感綿密層次豐富。",
      },
      {
        type: "transport",
        time: "13:30",
        title: "返回飯店領行李",
        detail: "札幌飯店取件",
        badge: "取物",
        description: "回到飯店取回早上寄存的行李，準備搭車前往機場區域。",
      },
      {
        type: "transport",
        time: "14:30",
        title: "搭乘 JR 前往千歲",
        detail: "快速 Airport 號",
        badge: "JR 移動",
        description:
          "從 JR 札幌站搭機，不到 30 分鐘即可抵達 JR 千歲站。飯店就在車站旁，非常方便。",
      },
      {
        type: "hotel",
        time: "15:30",
        title: "JR INN 千歲入住",
        detail: "Check-in",
        badge: "入住",
        description:
          "辦理入住，這間飯店以枕頭選單出名，可以挑一顆喜歡的枕頭保證今晚好眠。",
      },
      {
        type: "spot",
        time: "17:00",
        title: "新千歲機場逛街 + 晚餐",
        detail: "17:00 - 20:30",
        badge: "機場衝刺",
        description:
          "新千歲機場堪比購物中心！去拉麵道場排一幻拉麵、逛 Royce 巧克力工廠，把最後的日幣花光！",
      },
    ],
  },
  {
    date: "03/20",
    weekday: "Fri",
    location: "回程",
    weather: "1°C ☁️",
    topInfo: {
      flight: {
        code: "IT235",
        time: "11:55 ~ 15:35",
        route: "新千歲 ✈️ 桃園(T1)",
      },
    },
    items: [
      {
        type: "food",
        time: "07:00",
        title: "享用前一天買的早餐",
        detail: "飯店內用餐",
        badge: "輕食",
        description: "悠閒地在飯店享用早餐，整理好行李與退稅單據。",
      },
      {
        type: "transport",
        time: "08:00",
        title: "搭乘機場接駁巴士",
        detail: "飯店 ✈️ 新千歲機場",
        badge: "接駁",
        description:
          "約 20 分鐘車程。提前到達機場辦理行李託運，把握最後機會在機場免稅店掃貨。",
      },
      {
        type: "transport",
        time: "11:55",
        title: "航班 IT235",
        detail: "CTS ✈️ TPE",
        badge: "返家",
        description:
          "帶著北海道的伴手禮與美好回憶，踏上歸途。預計 15:35 抵達桃園。",
      },
    ],
  },
];

// --- 2. 行李清單資料庫 (不變) ---
const INITIAL_PACKING_DATA = [
  {
    category: "必備證件",
    items: [
      "護照",
      "機票/訂位紀錄",
      "VJW (Visit Japan Web)",
      "日幣現金",
      "信用卡 (海外支付)",
      "保險證明",
    ],
  },
  {
    category: "電子產品",
    items: ["手機 & 充電器", "行動電源", "相機 & 記憶卡", "SIM卡/WIFI機"],
  },
  {
    category: "雪國衣物",
    items: [
      "發熱衣/褲 (極暖)",
      "厚羽絨外套",
      "防滑雪靴",
      "毛帽 & 圍巾",
      "防水手套",
      "睡衣",
      "內衣褲",
      "泳衣",
    ],
  },
  {
    category: "生活用品",
    items: [
      "化妝包",
      "盥洗用品",
      "護唇膏 & 乳液 (防乾燥)",
      "暖暖包",
      "個人藥品",
      "太陽眼鏡 (防雪盲)",
    ],
  },
];

const THEME_MAP = {
  food: { bg: "#F97316", icon: Utensils },
  spot: { bg: "#3B82F6", icon: MapPin },
  transport: { bg: "#475569", icon: Bus },
  hotel: { bg: "#A855F7", icon: Hotel },
};

const DetailModal = ({ item, onClose }) => {
  if (!item) return null;
  const theme = THEME_MAP[item.type] || THEME_MAP.spot;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[60]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-45%" }}
        animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
        exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-45%" }}
        className="fixed top-1/2 left-1/2 w-[88%] max-w-[320px] bg-white rounded-[40px] shadow-2xl z-[70] overflow-hidden"
      >
        <div style={{ backgroundColor: theme.bg }} className="h-5 w-full" />
        <div className="p-8 pt-10 text-center relative">
          <button
            onClick={onClose}
            className="absolute -top-6 right-6 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-400 border border-slate-50"
          >
            <X size={20} />
          </button>
          <div className="mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-2 bg-slate-100 text-slate-500">
              {item.badge || "SCHEDULE"}
            </span>
            <h3 className="text-xl font-black text-slate-800 tracking-tight leading-tight">
              {item.title}
            </h3>
          </div>
          <div className="bg-slate-50 rounded-[28px] p-5 mb-5 border border-slate-100 text-left">
            <p className="text-[13px] text-slate-600 leading-relaxed font-medium whitespace-pre-line">
              {item.description}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ backgroundColor: theme.bg }}
            className="w-full py-4 text-white font-black rounded-[20px] shadow-lg active:scale-95 transition-all"
          >
            確定
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function TravelApp() {
  const [activeTab, setActiveTab] = useState("plan");
  const [dayIdx, setDayIdx] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});

  const currentDay = useMemo(() => TRAVEL_DATA[dayIdx], [dayIdx]);
  const toggleCheck = (item) =>
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }));

  return (
    <div className="max-w-md mx-auto bg-[#F8FBFE] min-h-screen pb-32 shadow-2xl relative overflow-x-hidden font-sans text-slate-900">
      <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />

      <header
        style={{ backgroundColor: "#60c6f0" }}
        className="pt-12 pb-8 px-6 rounded-b-[48px] text-white shadow-lg sticky top-0 z-40"
      >
        <div className="flex justify-between items-center mb-6 px-1">
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">
              {activeTab === "plan" ? "Hokkaido" : "Packing"}
            </h1>
            <p className="text-[11px] font-black opacity-90 mt-2 italic text-white">
              {activeTab === "plan" ? "Winter Trip 2026" : "Checklist"}
            </p>
          </div>
          <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-sm">
            {activeTab === "plan" ? (
              <CloudSun size={28} />
            ) : (
              <Briefcase size={28} />
            )}
          </div>
        </div>
        {activeTab === "plan" && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {TRAVEL_DATA.map((day, idx) => (
              <button
                key={idx}
                onClick={() => setDayIdx(idx)}
                style={{
                  backgroundColor:
                    dayIdx === idx ? "#ffffff" : "rgba(255, 255, 255, 0.3)",
                  color: dayIdx === idx ? "#1d75b5" : "#ffffff",
                  transform: dayIdx === idx ? "scale(1.1)" : "scale(1)",
                }}
                className="flex-shrink-0 w-14 h-20 rounded-2xl flex flex-col items-center justify-center transition-all shadow-md"
              >
                <span className="text-[9px] font-black uppercase mb-1">
                  {day.weekday}
                </span>
                <span className="text-lg font-black">
                  {day.date.split("/")[1]}
                </span>
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="px-5 mt-8">
        <AnimatePresence mode="wait">
          {activeTab === "plan" ? (
            <motion.div
              key="plan"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {currentDay.topInfo.hotel && (
                <section className="mb-6">
                  <div className="bg-white rounded-[24px] p-5 border-2 border-slate-50 shadow-md relative overflow-hidden">
                    <div
                      style={{ backgroundColor: "#60c6f0" }}
                      className="absolute top-0 left-0 w-2 h-full"
                    />
                    <div
                      style={{ color: "#60c6f0" }}
                      className="flex items-center gap-2 mb-3 font-black text-xs uppercase tracking-widest"
                    >
                      <Hotel size={18} />
                      <span>今日住宿</span>
                    </div>
                    <div className="font-black text-slate-800 text-base mb-4 pl-2 leading-tight">
                      {currentDay.topInfo.hotel.name}
                    </div>
                    <div
                      style={{ backgroundColor: "#F0F9FF" }}
                      className="flex items-center gap-3 text-[12px] text-slate-600 p-2.5 rounded-xl border border-sky-100 font-mono font-bold"
                    >
                      <Hash size={14} style={{ color: "#60c6f0" }} />{" "}
                      {currentDay.topInfo.hotel.code}
                    </div>
                  </div>
                </section>
              )}
              <div className="flex justify-between items-end mb-6 px-1 border-b border-sky-50 pb-3">
                <h2 className="text-xl font-black text-slate-800">
                  {currentDay.location}
                </h2>
                <div
                  style={{ color: "#60c6f0" }}
                  className="text-[12px] font-black bg-white border-2 px-4 py-1.5 rounded-full shadow-sm"
                >
                  🌡️ {currentDay.weather}
                </div>
              </div>
              {currentDay.items.map((item, i) => {
                const theme = THEME_MAP[item.type] || THEME_MAP.spot;
                const Icon = theme.icon;
                return (
                  <motion.div
                    key={i}
                    onClick={() => setSelectedItem(item)}
                    className="bg-white rounded-[32px] p-5 mb-4 shadow-sm border border-slate-100 active:scale-[0.98] cursor-pointer"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded-lg text-slate-500 font-mono">
                        {item.time}
                      </span>
                      {item.badge && (
                        <span
                          style={{
                            color: "#60c6f0",
                            backgroundColor: "#F0F9FF",
                          }}
                          className="text-[10px] px-2 py-1 rounded-full font-bold border border-sky-100"
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-4">
                      <div className="bg-slate-50 p-3 rounded-2xl h-fit">
                        <Icon size={18} style={{ color: theme.bg }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 text-md leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="packing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {INITIAL_PACKING_DATA.map((cat, idx) => (
                <div
                  key={idx}
                  className="mb-8 bg-white rounded-[32px] p-6 shadow-sm border border-slate-50"
                >
                  <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                    <div
                      className="w-2 h-6 rounded-full"
                      style={{ backgroundColor: "#60c6f0" }}
                    />
                    {cat.category}
                  </h3>
                  <div className="space-y-3">
                    {cat.items.map((packItem, i) => (
                      <div
                        key={i}
                        onClick={() => toggleCheck(packItem)}
                        className={`flex items-center gap-4 p-3 rounded-2xl transition-all cursor-pointer ${
                          checkedItems[packItem]
                            ? "bg-slate-50 opacity-50"
                            : "bg-white"
                        }`}
                      >
                        {checkedItems[packItem] ? (
                          <CheckSquare size={20} style={{ color: "#60c6f0" }} />
                        ) : (
                          <Square size={20} className="text-slate-300" />
                        )}
                        <span
                          className={`text-sm font-bold ${
                            checkedItems[packItem]
                              ? "line-through text-slate-400"
                              : "text-slate-700"
                          }`}
                        >
                          {packItem}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-white/95 backdrop-blur-2xl rounded-[32px] h-20 flex items-center justify-around shadow-xl px-10 z-50 border border-sky-50">
        <button
          onClick={() => setActiveTab("plan")}
          className="flex flex-col items-center gap-1"
        >
          <Calendar
            size={24}
            style={{ color: activeTab === "plan" ? "#60c6f0" : "#CBD5E1" }}
          />
          <span
            style={{ color: activeTab === "plan" ? "#60c6f0" : "#CBD5E1" }}
            className="text-[10px] font-black uppercase"
          >
            Plan
          </span>
        </button>
        <div className="w-px h-8 bg-slate-100" />
        <button
          onClick={() => setActiveTab("packing")}
          className="flex flex-col items-center gap-1"
        >
          <ShoppingBag
            size={24}
            style={{ color: activeTab === "packing" ? "#60c6f0" : "#CBD5E1" }}
          />
          <span
            style={{ color: activeTab === "packing" ? "#60c6f0" : "#CBD5E1" }}
            className="text-[10px] font-black uppercase"
          >
            Packing
          </span>
        </button>
      </nav>
    </div>
  );
}
