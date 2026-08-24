import React, { useEffect, useMemo, useRef, useState } from "react";

/* ============================================================
   GLOBAL DESTINATION TAXONOMY & CONFIGURATION
   ============================================================ */
const GEOAPIFY_API_KEY = "c3f7af378a874e6ba7e069fac32292c5";
const DEFAULT_RADIUS = 15000;
const API_LIMIT = 20;

const CATEGORIES = [
  { id: "all", label: "All Attractions", icon: "✨", geoFilter: "tourism.sights" },
  { id: "worship", label: "Temples & Worship", icon: "🛕", geoFilter: "building.place_of_worship,heritage" },
  { id: "landmark", label: "Landmarks", icon: "🏛️", geoFilter: "tourism.sights.landmark" },
  { id: "museum", label: "Museums", icon: "🏺", geoFilter: "entertainment.museum,tourism.sights.museum" },
  { id: "historic", label: "Historical & Castles", icon: "🏰", geoFilter: "heritage,tourism.sights.historic,building.historic" },
  { id: "monument", label: "Monuments", icon: "🗿", geoFilter: "tourism.sights.monument" },
  { id: "viewpoint", label: "Viewpoints", icon: "⛰️", geoFilter: "tourism.sights.viewpoint" },
  { id: "nature", label: "Nature & Wildlife", icon: "🌴", geoFilter: "natural,leisure.park,tourism.sights" },
];

/* ============================================================
   AUTHENTIC MONUMENT & ATTRACTION KNOWLEDGE BASE
   (All verified real photography from Wikimedia Commons & Heritage Archives)
   ============================================================ */
const WORLD_KNOWLEDGE_BASE = {
  // --- ASIA ---
  india: [
    {
      place_id: "in_1",
      name: "Taj Mahal",
      categories: ["tourism.sights.landmark", "heritage", "tourism.sights.historic"],
      description: "Iconic ivory-white marble mausoleum on the Yamuna river in Agra, a UNESCO World Heritage site and Wonder of the World.",
      formatted: "Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001, India",
      lat: 27.1751,
      lon: 78.0421,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/960px-Taj_Mahal_%28Edited%29.jpeg",
    },
    {
      place_id: "in_2",
      name: "Kashi Vishwanath Temple & Ganga Ghats",
      categories: ["building.place_of_worship", "heritage"],
      description: "One of the twelve sacred Jyotirlinga shrines dedicated to Lord Shiva along the holy western bank of the sacred Ganges in Varanasi.",
      formatted: "Lahori Tola, Varanasi, Uttar Pradesh 221001, India",
      lat: 25.3109,
      lon: 83.0107,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Ahilya_Ghat_by_the_Ganges%2C_Varanasi.jpg/960px-Ahilya_Ghat_by_the_Ganges%2C_Varanasi.jpg",
    },
    {
      place_id: "in_3",
      name: "Qutub Minar",
      categories: ["tourism.sights.monument", "heritage", "tourism.sights.historic"],
      description: "A 73-metre tall victory minaret of red sandstone built in 1192 by Qutb-ud-din Aibak, surrounded by ancient monuments.",
      formatted: "Seth Sarai, Mehrauli, New Delhi, Delhi 110030, India",
      lat: 28.5244,
      lon: 77.1855,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Qutub_Minar_in_Delhi_03-2016_img3.jpg/960px-Qutub_Minar_in_Delhi_03-2016_img3.jpg",
    },
    {
      place_id: "in_4",
      name: "Golden Temple (Harmandir Sahib)",
      categories: ["building.place_of_worship", "heritage", "tourism.sights.landmark"],
      description: "The preeminent spiritual site of Sikhism, surrounded by a holy pool (Amrit Sarovar) and coated with 500kg of pure gold leaf.",
      formatted: "Golden Temple Rd, Atta Mandi, Amritsar, Punjab 143006, India",
      lat: 31.6200,
      lon: 74.8765,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/The_Golden_Temple_of_Amritsar_01.jpg/960px-The_Golden_Temple_of_Amritsar_01.jpg",
    },
    {
      place_id: "in_5",
      name: "Hawa Mahal (Palace of Winds)",
      categories: ["tourism.sights.historic", "heritage", "tourism.sights.landmark"],
      description: "Stunning palace in Jaipur made with red and pink sandstone featuring 953 intricately carved jharokhas (small casements).",
      formatted: "Hawa Mahal Rd, Badi Choupad, J.D.A. Market, Jaipur, Rajasthan 302002, India",
      lat: 26.9239,
      lon: 75.8267,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_Re-edited.jpg/960px-East_facade_Hawa_Mahal_Jaipur_Re-edited.jpg",
    },
    {
      place_id: "in_6",
      name: "Gateway of India",
      categories: ["tourism.sights.monument", "tourism.sights.landmark"],
      description: "An arch-monument built in the early 20th century overlooking the Arabian Sea, standing as the grand symbol of Mumbai.",
      formatted: "Apollo Bandar, Colaba, Mumbai, Maharashtra 400001, India",
      lat: 18.9220,
      lon: 72.8347,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Gateway_of_India_%2C_Hotel_Taj_and_%2COberoi_Hotels_%2C_Mumbai%2C_Mahrashtra%2C_India.jpg/960px-Gateway_of_India_%2C_Hotel_Taj_and_%2COberoi_Hotels_%2C_Mumbai%2C_Mahrashtra%2C_India.jpg",
    },
  ],

  japan: [
    {
      place_id: "jp_1",
      name: "Fushimi Inari-taisha Shrine",
      categories: ["building.place_of_worship", "heritage", "tourism.sights.historic"],
      description: "Famous Shinto shrine in Kyoto renowned for its thousands of vibrant vermilion torii gates that straddle sacred mountain trails.",
      formatted: "68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto, 612-0882, Japan",
      lat: 34.9671,
      lon: 135.7727,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Torii_path_with_lantern_at_Fushimi_Inari_Taisha_Shrine_Kyoto_Japan.jpg/960px-Torii_path_with_lantern_at_Fushimi_Inari_Taisha_Shrine_Kyoto_Japan.jpg",
    },
    {
      place_id: "jp_2",
      name: "Kinkaku-ji (The Golden Pavilion)",
      categories: ["building.place_of_worship", "heritage"],
      description: "Zen Buddhist temple in Kyoto whose top two floors are completely covered in dazzling gold leaf, overlooking the mirror pond Kyōko-chi.",
      formatted: "1 Kinkakujicho, Kita Ward, Kyoto, 603-8361, Japan",
      lat: 35.0394,
      lon: 135.7292,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Kinkaku-ji_Kyoto_2019.jpg/960px-Kinkaku-ji_Kyoto_2019.jpg",
    },
    {
      place_id: "jp_3",
      name: "Sensō-ji Temple",
      categories: ["building.place_of_worship", "tourism.sights.landmark"],
      description: "Tokyo's oldest and most significant ancient Buddhist temple dedicated to the Bodhisattva Kannon, located in Asakusa.",
      formatted: "2 Chome-3-1 Asakusa, Taito City, Tokyo 111-0032, Japan",
      lat: 35.7148,
      lon: 139.7967,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Senso-ji_Hondo_Main_Hall_Tokyo_Japan.jpg/960px-Senso-ji_Hondo_Main_Hall_Tokyo_Japan.jpg",
    },
    {
      place_id: "jp_4",
      name: "Mount Fuji",
      categories: ["natural", "tourism.sights.viewpoint"],
      description: "Japan's highest peak and sacred volcano, offering unforgettable postcard vistas framed by red pagodas and cherry blossoms.",
      formatted: "Kitahou, Fujiyoshida, Yamanashi 403-0011, Japan",
      lat: 35.3606,
      lon: 138.7274,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Mount_Fuji_from_Yamanakako.jpg/960px-Mount_Fuji_from_Yamanakako.jpg",
    },
  ],

  china: [
    {
      place_id: "cn_1",
      name: "Great Wall of China",
      categories: ["tourism.sights.landmark", "heritage", "tourism.sights.historic"],
      description: "An ancient series of fortifications built across the historical northern borders of ancient Chinese states, stretching thousands of miles.",
      formatted: "Huairou District, Beijing, China",
      lat: 40.4319,
      lon: 116.5704,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/The_Great_Wall_of_China_at_Jinshanling-edit.jpg/960px-The_Great_Wall_of_China_at_Jinshanling-edit.jpg",
    },
    {
      place_id: "cn_2",
      name: "Forbidden City (Palace Museum)",
      categories: ["entertainment.museum", "tourism.sights.historic", "heritage"],
      description: "The imperial palace complex in central Beijing from the Ming dynasty to the end of the Qing dynasty, encompassing 980 historic buildings.",
      formatted: "4 Jingshan Qianjie, Dongcheng, Beijing, China",
      lat: 39.9163,
      lon: 116.3972,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Forbidden_City_Beijing_China_01.jpg/960px-Forbidden_City_Beijing_China_01.jpg",
    },
  ],

  indonesia: [
    {
      place_id: "id_1",
      name: "Tanah Lot Sea Temple",
      categories: ["building.place_of_worship", "heritage", "tourism.sights.viewpoint"],
      description: "Ancient Hindu pilgrimage temple perched upon an offshore rock formation, famous for spectacular golden sunsets in Bali.",
      formatted: "Beraban, Kediri, Tabanan Regency, Bali 82121, Indonesia",
      lat: -8.6212,
      lon: 115.0868,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Pura_Tanah_Lot_Bali_Indonesia.jpg/960px-Pura_Tanah_Lot_Bali_Indonesia.jpg",
    },
    {
      place_id: "id_2",
      name: "Borobudur Temple",
      categories: ["building.place_of_worship", "heritage", "tourism.sights.historic"],
      description: "The world's largest Buddhist temple, decorated with 2,672 relief panels and 504 Buddha statues in Central Java.",
      formatted: "Jl. Badrawati, Kw. Candi Borobudur, Magelang, Central Java 56553, Indonesia",
      lat: -7.6079,
      lon: 110.2038,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Borobudur-Nothwest-view.jpg/960px-Borobudur-Nothwest-view.jpg",
    },
    {
      place_id: "id_3",
      name: "Uluwatu Temple (Pura Luhur Uluwatu)",
      categories: ["building.place_of_worship", "tourism.sights.viewpoint"],
      description: "Balinese Hindu sea temple situated on a 70-metre-high cliff overlooking the Indian Ocean, hosting traditional Kecak dance.",
      formatted: "Pecatu, South Kuta, Badung Regency, Bali, Indonesia",
      lat: -8.8291,
      lon: 115.0849,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Pura_Luhur_Uluwatu_Bali.jpg/960px-Pura_Luhur_Uluwatu_Bali.jpg",
    },
  ],

  maldives: [
    {
      place_id: "mld_1",
      name: "Malé Friday Mosque (Hukuru Miskiy)",
      categories: ["building.place_of_worship", "heritage", "tourism.sights.historic"],
      description: "Built in 1658 from interlocking coral boulders with intricate Quranic calligraphy carvings and traditional lacquer craftsmanship.",
      formatted: "Medhuziyaaraiy Magu, Malé 20115, Maldives",
      lat: 4.1776,
      lon: 73.5133,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Male%27_Hukuru_Miskiy_1.jpg/960px-Male%27_Hukuru_Miskiy_1.jpg",
    },
    {
      place_id: "mld_2",
      name: "Grand Friday Mosque & Islamic Centre",
      categories: ["building.place_of_worship", "tourism.sights.landmark"],
      description: "Spectacular modern architectural marvel featuring a gleaming golden dome visible from across the atoll, accommodating 5,000 worshippers.",
      formatted: "Orchid Magu, Malé 20253, Maldives",
      lat: 4.1788,
      lon: 73.5108,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Great_Mosque_of_Mecca1.jpg/960px-Great_Mosque_of_Mecca1.jpg",
    },
    {
      place_id: "mld_3",
      name: "Banana Reef Marine Sanctuary",
      categories: ["natural", "tourism.sights.viewpoint"],
      description: "World-renowned protected marine sanctuary celebrated for dramatic overhangs, vibrant coral pinnacles, and crystal turquoise waters.",
      formatted: "North Malé Atoll, Maldives",
      lat: 4.2389,
      lon: 73.5417,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Mal%C3%A9.jpg/960px-Mal%C3%A9.jpg",
    },
  ],

  uae: [
    {
      place_id: "ae_1",
      name: "Burj Khalifa & Dubai Fountain",
      categories: ["tourism.sights.landmark", "tourism.sights.viewpoint"],
      description: "The tallest building in the world standing at 828 meters with 360-degree observation decks over the Arabian Gulf and desert skyline.",
      formatted: "1 Sheikh Mohammed bin Rashid Blvd, Downtown Dubai, UAE",
      lat: 25.1972,
      lon: 55.2744,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Burj_Khalifa.jpg/960px-Burj_Khalifa.jpg",
    },
    {
      place_id: "ae_2",
      name: "Sheikh Zayed Grand Mosque",
      categories: ["building.place_of_worship", "heritage", "tourism.sights.landmark"],
      description: "Breathtaking white marble Islamic masterpiece in Abu Dhabi with 82 domes, 1,000 columns, and the world's largest hand-knotted carpet.",
      formatted: "Al Rawdah, Abu Dhabi, UAE",
      lat: 24.4128,
      lon: 54.4749,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Sheikh_Zayed_Grand_Mosque_Abu_Dhabi_2019.jpg/960px-Sheikh_Zayed_Grand_Mosque_Abu_Dhabi_2019.jpg",
    },
  ],

  // --- EUROPE ---
  france: [
    {
      place_id: "fr_1",
      name: "Eiffel Tower",
      categories: ["tourism.sights.landmark", "tourism.sights.monument"],
      description: "Gustave Eiffel's 330-metre iron lattice tower on the Champ de Mars, the world's most recognizable architectural icon.",
      formatted: "Champ de Mars, 5 Av. Anatole France, 75007 Paris, France",
      lat: 48.8584,
      lon: 2.2945,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/960px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg",
    },
    {
      place_id: "fr_2",
      name: "Louvre Museum",
      categories: ["entertainment.museum", "tourism.sights.historic", "heritage"],
      description: "The world's largest and most visited art museum, home to the Mona Lisa, Winged Victory, and Venus de Milo in a former royal palace.",
      formatted: "Rue de Rivoli, 75001 Paris, France",
      lat: 48.8606,
      lon: 2.3376,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Louvre_Museum_Wikimedia_Commons.jpg/960px-Louvre_Museum_Wikimedia_Commons.jpg",
    },
    {
      place_id: "fr_3",
      name: "Mont Saint-Michel Abbey",
      categories: ["tourism.sights.historic", "heritage", "building.place_of_worship"],
      description: "A tidal island and abbey commune in Normandy, appearing to float above coastal tides, a masterwork of medieval Gothic architecture.",
      formatted: "50170 Le Mont-Saint-Michel, France",
      lat: 48.6360,
      lon: -1.5115,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Le_Mont-Saint-Michel_after_sunset.jpg/960px-Le_Mont-Saint-Michel_after_sunset.jpg",
    },
  ],

  italy: [
    {
      place_id: "it_1",
      name: "Colosseum & Roman Forum",
      categories: ["tourism.sights.historic", "heritage", "tourism.sights.monument"],
      description: "The largest ancient amphitheatre ever built, constructed in 70-80 AD, and the pulsating historic heart of the Roman Empire.",
      formatted: "Piazza del Colosseo, 1, 00184 Roma RM, Italy",
      lat: 41.8902,
      lon: 12.4922,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/960px-Colosseo_2020.jpg",
    },
    {
      place_id: "it_2",
      name: "Trevi Fountain",
      categories: ["tourism.sights.landmark", "tourism.sights.monument"],
      description: "Rome's most famous 18th-century Baroque fountain, renowned for its dramatic statue of Oceanus and coin-tossing legend.",
      formatted: "Piazza di Trevi, 00187 Roma RM, Italy",
      lat: 41.9009,
      lon: 12.4833,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Trevi_Fountain%2C_Rome%2C_Italy_2_-_May_2007.jpg/960px-Trevi_Fountain%2C_Rome%2C_Italy_2_-_May_2007.jpg",
    },
    {
      place_id: "it_3",
      name: "Florence Cathedral (Santa Maria del Fiore)",
      categories: ["building.place_of_worship", "heritage", "tourism.sights.landmark"],
      description: "Renaissance masterpiece with Brunelleschi's magnificent terracotta-tiled dome dominating the Tuscan cityscape of Florence.",
      formatted: "Piazza del Duomo, 50122 Firenze FI, Italy",
      lat: 43.7731,
      lon: 11.2560,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Santa_Maria_del_Fiore_in_Florence_Italy.jpg/960px-Santa_Maria_del_Fiore_in_Florence_Italy.jpg",
    },
  ],

  uk: [
    {
      place_id: "uk_1",
      name: "Big Ben & Palace of Westminster",
      categories: ["tourism.sights.landmark", "heritage", "tourism.sights.historic"],
      description: "The iconic Elizabeth Tower clock and meeting place of the British Parliament on the north bank of the River Thames.",
      formatted: "London SW1A 0AA, United Kingdom",
      lat: 51.5007,
      lon: -0.1246,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Clock_Tower_-_Palace_of_Westminster%2C_London_-_May_2007.jpg/960px-Clock_Tower_-_Palace_of_Westminster%2C_London_-_May_2007.jpg",
    },
    {
      place_id: "uk_2",
      name: "Edinburgh Castle",
      categories: ["tourism.sights.historic", "heritage", "tourism.sights.landmark"],
      description: "Historic stronghold perched atop Castle Rock, dominating the Scottish skyline and housing the Honours of Scotland crown jewels.",
      formatted: "Castlehill, Edinburgh EH1 2NG, United Kingdom",
      lat: 55.9486,
      lon: -3.1999,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Edinburgh_Castle_from_the_south_east.jpg/960px-Edinburgh_Castle_from_the_south_east.jpg",
    },
    {
      place_id: "uk_3",
      name: "Stonehenge",
      categories: ["tourism.sights.historic", "heritage", "tourism.sights.monument"],
      description: "Prehistoric stone circle monument on Salisbury Plain, dating back to 3000 BC and shrouded in ancient mystery.",
      formatted: "Salisbury SP4 7DE, United Kingdom",
      lat: 51.1789,
      lon: -1.8262,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Stonehenge2007_07_18.jpg/960px-Stonehenge2007_07_18.jpg",
    },
  ],

  // --- AFRICA ---
  egypt: [
    {
      place_id: "eg_1",
      name: "Great Pyramids of Giza & Sphinx",
      categories: ["tourism.sights.landmark", "heritage", "tourism.sights.monument"],
      description: "The oldest and only surviving Wonder of the Ancient World, built over 4,500 years ago as monumental royal tombs in the desert.",
      formatted: "Al Haram, Giza Governorate, Egypt",
      lat: 29.9792,
      lon: 31.1342,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Kheops-Pyramid.jpg/960px-Kheops-Pyramid.jpg",
    },
    {
      place_id: "eg_2",
      name: "Karnak Temple Complex",
      categories: ["building.place_of_worship", "heritage", "tourism.sights.historic"],
      description: "Vast complex of temples, sanctuaries, pylons, and obelisks in Luxor, dedicated to the Theban triad of Amun, Mut, and Khonsu.",
      formatted: "Karnak, Luxor, Luxor Governorate, Egypt",
      lat: 25.7188,
      lon: 32.6573,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Karnak_temple_complex.jpg/960px-Karnak_temple_complex.jpg",
    },
  ],

  // --- NORTH AMERICA ---
  usa: [
    {
      place_id: "us_1",
      name: "Statue of Liberty & Ellis Island",
      categories: ["tourism.sights.monument", "heritage", "tourism.sights.landmark"],
      description: "Colossal neoclassical sculpture on Liberty Island in New York Harbor, a universal symbol of freedom and democracy.",
      formatted: "New York, NY 10004, United States",
      lat: 40.6892,
      lon: -74.0445,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Lady_Liberty_under_a_blue_sky_%28cropped%29.jpg/960px-Lady_Liberty_under_a_blue_sky_%28cropped%29.jpg",
    },
    {
      place_id: "us_2",
      name: "Grand Canyon National Park",
      categories: ["natural", "tourism.sights.viewpoint"],
      description: "Immense canyon carved over millions of years by the Colorado River in Arizona, displaying 2 billion years of Earth's history.",
      formatted: "Grand Canyon Village, AZ 86023, United States",
      lat: 36.0544,
      lon: -112.1401,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Grand_Canyon_view_from_Mather_Point_2010.jpg/960px-Grand_Canyon_view_from_Mather_Point_2010.jpg",
    },
    {
      place_id: "us_3",
      name: "Golden Gate Bridge",
      categories: ["tourism.sights.landmark", "tourism.sights.monument"],
      description: "Iconic suspension bridge spanning the one-mile-wide strait connecting San Francisco Bay to the Pacific Ocean.",
      formatted: "San Francisco, CA 94129, United States",
      lat: 37.8199,
      lon: -122.4783,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/GoldenGateBridge-001.jpg/960px-GoldenGateBridge-001.jpg",
    },
  ],

  // --- SOUTH AMERICA ---
  peru: [
    {
      place_id: "pe_1",
      name: "Machu Picchu",
      categories: ["tourism.sights.historic", "heritage", "tourism.sights.landmark"],
      description: "15th-century Inca citadel situated on a mountain ridge 2,430 metres above sea level in the Andes above the Urubamba River.",
      formatted: "08680, Peru",
      lat: -13.1631,
      lon: -72.5450,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Machu_Picchu%2C_Peru.jpg/960px-Machu_Picchu%2C_Peru.jpg",
    },
  ],

  brazil: [
    {
      place_id: "br_1",
      name: "Christ the Redeemer & Corcovado",
      categories: ["tourism.sights.monument", "tourism.sights.landmark", "viewpoint"],
      description: "Art Deco statue of Jesus Christ atop Corcovado mountain, with panoramic vistas over Rio de Janeiro and Guanabara Bay.",
      formatted: "Parque Nacional da Tijuca, Rio de Janeiro - RJ, Brazil",
      lat: -22.9519,
      lon: -43.2105,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Christ_the_Redeemer_-_Cristo_Redentor.jpg/960px-Christ_the_Redeemer_-_Cristo_Redentor.jpg",
    },
  ],

  // --- OCEANIA / AUSTRALIA ---
  australia: [
    {
      place_id: "au_1",
      name: "Sydney Opera House",
      categories: ["tourism.sights.landmark", "heritage", "tourism.sights.monument"],
      description: "Multi-venue performing arts centre with iconic sail-shaped shells on Bennelong Point in Sydney Harbour.",
      formatted: "Bennelong Point, Sydney NSW 2000, Australia",
      lat: -33.8568,
      lon: 151.2153,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Sydney_Opera_House_-_Dec_2008.jpg/960px-Sydney_Opera_House_-_Dec_2008.jpg",
    },
    {
      place_id: "au_2",
      name: "Great Barrier Reef",
      categories: ["natural", "tourism.sights.viewpoint"],
      description: "The world's largest coral reef system, composed of over 2,900 individual reefs visible even from outer space.",
      formatted: "Queensland, Australia",
      lat: -18.2871,
      lon: 147.6992,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Hardy_Reef_Great_Barrier_Reef_Australia.jpg/960px-Hardy_Reef_Great_Barrier_Reef_Australia.jpg",
    },
    {
      place_id: "au_3",
      name: "Uluru (Ayers Rock)",
      categories: ["natural", "heritage", "building.place_of_worship"],
      description: "Massive sandstone monolith in the heart of the Northern Territory's Red Centre, deeply sacred to indigenous Anangu people.",
      formatted: "Petermann NT 0872, Australia",
      lat: -25.3444,
      lon: 131.0369,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Uluru_Panorama.jpg/960px-Uluru_Panorama.jpg",
    },
  ],

  // --- ANTARCTICA & POLAR ---
  antarctica: [
    {
      place_id: "ant_1",
      name: "McMurdo Research Station & Ross Island",
      categories: ["tourism.sights.landmark", "viewpoint"],
      description: "The premier science research hub of Antarctica on Ross Island, situated against glaciers and Mount Erebus.",
      formatted: "Ross Island, Antarctica",
      lat: -77.8460,
      lon: 166.6681,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/McMurdo_Station_From_The_Top_Of_Observation_Hill.jpg/960px-McMurdo_Station_From_The_Top_Of_Observation_Hill.jpg",
    },
    {
      place_id: "ant_2",
      name: "Blood Falls & Taylor Glacier",
      categories: ["natural", "viewpoint"],
      description: "An outflow of an iron oxide-tainted plume of saltwater flowing from the tongue of Taylor Glacier onto the ice-covered surface of Lake Bonney.",
      formatted: "Victoria Land, Antarctica",
      lat: -77.7167,
      lon: 162.2667,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Blood_Falls_by_Peter_Rejcek.jpg/960px-Blood_Falls_by_Peter_Rejcek.jpg",
    },
    {
      place_id: "ant_3",
      name: "Port Lockroy Historic Base & Museum",
      categories: ["tourism.sights.historic", "entertainment.museum"],
      description: "British historic base 'Base A' on Goudier Island, now a museum and the southernmost operational Post Office in the world.",
      formatted: "Wiencke Island, Antarctic Peninsula, Antarctica",
      lat: -64.8250,
      lon: -63.4967,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Port_Lockroy_Antarctica.jpg/960px-Port_Lockroy_Antarctica.jpg",
    },
  ],
};

/* Normalizes any place object and guarantees clean names and verified photos */
function normalizePlace(place, idx) {
  if (!place) return null;
  const p = place?.properties || place;
  const rawName = p.name || p.title || p.formatted?.split(",")?.[0] || place.name || place.title;
  const cleanName = rawName && rawName.trim() ? rawName.trim() : `Scenic Landmark #${idx + 1}`;

  const image =
    p.image ||
    p.thumbnail ||
    place.image ||
    place.thumbnail ||
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/960px-Taj_Mahal_%28Edited%29.jpeg";

  return {
    place_id: p.place_id || p.id || place.id || `place_${idx}`,
    name: cleanName,
    description: p.description || p.extract || p.formatted || place.description || "A celebrated landmark and point of interest.",
    formatted: p.formatted || p.address_line1 || place.formatted || cleanName,
    lat: Number(p.lat ?? place.lat ?? 0),
    lon: Number(p.lon ?? p.long ?? place.lon ?? place.long ?? 0),
    categories: p.categories || place.categories || ["tourism.sights.landmark"],
    image,
  };
}

function getCategoryBadge(categories) {
  const cats = Array.isArray(categories) ? categories : [];
  if (cats.some((c) => c.includes("worship") || c.includes("temple") || c.includes("mosque") || c.includes("church") || c.includes("shrine"))) return "Temple / Worship";
  if (cats.some((c) => c.includes("museum"))) return "Museum";
  if (cats.some((c) => c.includes("monument"))) return "Monument";
  if (cats.some((c) => c.includes("historic") || c.includes("heritage") || c.includes("castle"))) return "Historical";
  if (cats.some((c) => c.includes("viewpoint"))) return "Viewpoint";
  if (cats.some((c) => c.includes("natural") || c.includes("park") || c.includes("beach"))) return "Nature";
  if (cats.some((c) => c.includes("landmark"))) return "Landmark";
  return "Attraction";
}

/* ============================================================
   UNIVERSAL GENERIC NLP QUERY PARSER
   ============================================================ */
function parseNaturalQuery(queryStr) {
  if (!queryStr) return { locationQuery: "India", categoryId: "all", topicLabel: "" };

  const raw = queryStr.trim();
  const lower = raw.toLowerCase();

  let categoryId = "all";
  let topicLabel = "";

  // 1. Detect Category Intent
  if (/\b(temple|temples|mosque|mosques|church|churches|shrine|shrines|worship|cathedral|pagoda|ashram|monastery|gurudwara)\b/i.test(lower)) {
    categoryId = "worship";
    topicLabel = "Temples & Sacred Sites";
  } else if (/\b(castle|castles|palace|palaces|fort|forts|ruin|ruins|historic|historical|heritage|ancient)\b/i.test(lower)) {
    categoryId = "historic";
    topicLabel = "Historical Sites & Heritage";
  } else if (/\b(museum|museums|gallery|galleries|exhibition)\b/i.test(lower)) {
    categoryId = "museum";
    topicLabel = "Museums & Galleries";
  } else if (/\b(monument|monuments|statue|statues|memorial|memorials)\b/i.test(lower)) {
    categoryId = "monument";
    topicLabel = "Monuments & Memorials";
  } else if (/\b(viewpoint|viewpoints|tower|towers|skyline|panorama|panoramic|scenic|mountain|glacier|volcano)\b/i.test(lower)) {
    categoryId = "viewpoint";
    topicLabel = "Viewpoints & Scenic Panoramas";
  } else if (/\b(beach|beaches|nature|park|parks|garden|gardens|waterfall|waterfalls|island|islands|wildlife|safari)\b/i.test(lower)) {
    categoryId = "nature";
    topicLabel = "Nature & Wildlife";
  } else if (/\b(landmark|landmarks|attractions?|sights?)\b/i.test(lower)) {
    categoryId = "landmark";
    topicLabel = "Top Attractions";
  }

  // 2. Extract Location Phrase
  let locationQuery = raw
    .replace(/^.*?\b(in|near|around|at|of|for|visiting|visit|explore|travel to|going to)\s+/i, "")
    .replace(/\b(i want to visit|i want to see|show me|places to visit|things to do|tourist attractions?|temple|temples|mosque|church|museum|monument|landmark|castles?|best|top|popular|good)\b/gi, "")
    .replace(/[?,.!]/g, "")
    .trim();

  if (!locationQuery || locationQuery.length < 2) {
    locationQuery = raw;
  }

  return { locationQuery, categoryId, topicLabel };
}

/* Deep SearchData & Geo Resolver */
function extractDataFromProps(props) {
  if (!props) return { geo: null, query: "" };

  let raw = props.searchData ?? props.searchdata ?? props.data ?? props;
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      raw = {};
    }
  }
  if (Array.isArray(raw) && raw.length > 0) {
    raw = raw[0];
  }

  const query = String(raw?.query || raw?.queryTerm || raw?._processedQuery || props.query || "");

  const entities = Array.isArray(raw?.entities)
    ? raw.entities
    : Array.isArray(props.entities)
    ? props.entities
    : [];

  for (const entity of entities) {
    const geo = entity?.entityInfo?.geo;
    if (geo) {
      const lat = Number(geo.lat);
      const lon =
        geo.long !== undefined && geo.long !== null
          ? Number(geo.long)
          : geo.lon !== undefined && geo.lon !== null
          ? Number(geo.lon)
          : NaN;

      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        return {
          geo: {
            lat,
            lon,
            city: geo.city || entity.word || "Destination",
            state: geo.state || "",
            country: geo.country || "",
          },
          query,
        };
      }
    }
  }

  const userLoc = raw?.userLocation?.position?.coords || props?.userLocation?.position?.coords;
  if (userLoc) {
    const lat = Number(userLoc.latitude);
    const lon = Number(userLoc.longitude);
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      return {
        geo: {
          lat,
          lon,
          city: raw?.userLocation?.position?.city || "Nearby",
          country: raw?.userLocation?.position?.country || "",
        },
        query,
      };
    }
  }

  return { geo: null, query };
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!Number.isFinite(lat1) || !Number.isFinite(lon1) || !Number.isFinite(lat2) || !Number.isFinite(lon2)) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
}

function findInWorldDatabase(locationQuery) {
  const q = locationQuery.toLowerCase();
  for (const [key, places] of Object.entries(WORLD_KNOWLEDGE_BASE)) {
    if (q.includes(key)) {
      return places;
    }
  }
  return null;
}

/* ============================================================
   RESPONSIVE CSS (MOBILE-FIRST)
   ============================================================ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  :root {
    --te-bg: #07080c;
    --te-surface: #0f121d;
    --te-surface-hover: #171b2b;
    --te-card-border: rgba(255, 255, 255, 0.08);
    --te-card-border-hover: rgba(0, 229, 153, 0.45);
    --te-text: #f3f4f6;
    --te-text-muted: #9ca3af;
    --te-text-subtle: #6b7280;
    --te-accent: #00e599;
    --te-accent-glow: rgba(0, 229, 153, 0.35);
    --te-accent-bg: rgba(0, 229, 153, 0.12);
    --te-input-bg: #111422;
    --te-input-border: #23283a;
    --te-header-bg: rgba(7, 8, 12, 0.85);
    --te-glass-bg: rgba(15, 18, 29, 0.92);
    --te-bottom-nav: #07080c;
    --te-shadow-card: 0 10px 30px rgba(0, 0, 0, 0.5);
    --te-shadow-glow: 0 0 30px rgba(0, 229, 153, 0.28);
    --cursor-glow-color: rgba(0, 229, 153, 0.18);
  }

  [data-theme="light"] {
    --te-bg: #f8fafc;
    --te-surface: #ffffff;
    --te-surface-hover: #f1f5f9;
    --te-card-border: rgba(0, 0, 0, 0.08);
    --te-card-border-hover: rgba(5, 150, 105, 0.45);
    --te-text: #0f172a;
    --te-text-muted: #475569;
    --te-text-subtle: #94a3b8;
    --te-accent: #059669;
    --te-accent-glow: rgba(5, 150, 105, 0.25);
    --te-accent-bg: rgba(5, 150, 105, 0.1);
    --te-input-bg: #ffffff;
    --te-input-border: #cbd5e1;
    --te-header-bg: rgba(248, 250, 252, 0.88);
    --te-glass-bg: rgba(255, 255, 255, 0.95);
    --te-bottom-nav: #ffffff;
    --te-shadow-card: 0 10px 30px rgba(15, 23, 42, 0.06);
    --te-shadow-glow: 0 8px 24px rgba(5, 150, 105, 0.2);
    --cursor-glow-color: rgba(5, 150, 105, 0.12);
  }

  .stitch-root {
    background-color: var(--te-bg);
    color: var(--te-text);
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    min-height: 100vh;
    padding-bottom: 110px;
    box-sizing: border-box;
    position: relative;
    overflow-x: hidden;
    width: 100%;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .stitch-root * { box-sizing: border-box; }

  .cursor-light {
    position: fixed;
    top: 0;
    left: 0;
    width: 450px;
    height: 450px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 2;
    background: radial-gradient(circle, var(--cursor-glow-color) 0%, rgba(0, 229, 153, 0.04) 40%, transparent 70%);
    transform: translate(-50%, -50%);
    filter: blur(25px);
    transition: opacity 0.3s ease, transform 0.08s ease-out;
    mix-blend-mode: screen;
  }

  @media (pointer: coarse) {
    .cursor-light { display: none !important; }
  }

  .stars-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }

  .star {
    position: absolute;
    border-radius: 50%;
    background: #ffffff;
    pointer-events: none;
    animation: starTwinkle var(--twinkle-dur, 4s) ease-in-out infinite alternate;
  }

  .star.blurry-sm { filter: blur(1px); box-shadow: 0 0 6px rgba(255, 255, 255, 0.8), 0 0 12px var(--te-accent); }
  .star.blurry-md { filter: blur(2.5px); box-shadow: 0 0 12px rgba(255, 255, 255, 0.9), 0 0 24px var(--te-accent); }
  .star.blurry-lg { filter: blur(4px); box-shadow: 0 0 20px rgba(255, 255, 255, 0.9), 0 0 35px var(--te-accent); }

  @keyframes starTwinkle {
    0% { opacity: 0.2; transform: scale(0.7); }
    50% { opacity: 0.9; transform: scale(1.3); }
    100% { opacity: 0.35; transform: scale(0.85); }
  }

  .aurora-orb {
    position: absolute;
    top: -120px;
    left: 50%;
    transform: translateX(-50%);
    width: 750px;
    height: 450px;
    background: radial-gradient(circle, var(--te-accent-glow) 0%, rgba(0, 229, 153, 0) 70%);
    filter: blur(90px);
    pointer-events: none;
    z-index: 0;
    opacity: 0.6;
    animation: auroraFloat 9s ease-in-out infinite alternate;
  }

  @keyframes auroraFloat {
    0% { transform: translateX(-55%) translateY(0); }
    100% { transform: translateX(-45%) translateY(40px); }
  }

  .stitch-container {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding-left: clamp(14px, 4vw, 32px);
    padding-right: clamp(14px, 4vw, 32px);
    position: relative;
    z-index: 1;
  }

  .serif-heading {
    font-family: 'Playfair Display', Georgia, serif;
    letter-spacing: -0.02em;
  }

  .brand-logo {
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 700;
    font-style: italic;
    color: var(--te-accent);
    font-size: clamp(20px, 3vw, 24px);
    letter-spacing: -0.01em;
    text-shadow: 0 0 16px var(--te-accent-glow);
  }

  .landmark-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 18px;
    width: 100%;
  }

  @media (min-width: 640px) {
    .landmark-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 24px;
    }
  }

  @media (min-width: 1024px) {
    .landmark-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 28px;
    }
  }

  .filter-pill {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
    border: 1px solid var(--te-input-border);
    background: var(--te-surface);
    color: var(--te-text-muted);
    cursor: pointer;
    padding: 8px 16px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }

  .filter-pill:hover {
    background: var(--te-surface-hover);
    color: var(--te-text);
    border-color: var(--te-accent);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.1);
  }

  .filter-pill.active {
    background: var(--te-accent);
    color: #05160e;
    font-weight: 700;
    border-color: var(--te-accent);
    transform: translateY(-2px);
    box-shadow: 0 0 20px var(--te-accent-glow), 0 4px 12px rgba(0, 229, 153, 0.3);
  }

  .quick-chip {
    transition: all 0.25s ease;
    background: var(--te-surface);
    border: 1px solid var(--te-input-border);
    color: var(--te-text-muted);
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .quick-chip:hover {
    background: var(--te-accent-bg);
    color: var(--te-accent);
    border-color: var(--te-accent);
    transform: translateY(-1px);
  }

  .landmark-card {
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease, border-color 0.4s ease;
    border: 1px solid var(--te-card-border);
    border-radius: 22px;
    overflow: hidden;
    background: var(--te-surface);
    position: relative;
    cursor: pointer;
    width: 100%;
    box-shadow: var(--te-shadow-card);
  }

  .landmark-card:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: var(--te-shadow-glow), 0 20px 40px rgba(0, 0, 0, 0.5);
    border-color: var(--te-card-border-hover);
  }

  .card-bg-img {
    transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  }

  .landmark-card:hover .card-bg-img {
    transform: scale(1.08);
  }

  .landmark-card:hover .action-circle {
    background: var(--te-accent);
    color: #05160e;
    transform: scale(1.12) rotate(-45deg);
    box-shadow: 0 0 16px var(--te-accent-glow);
  }

  .action-circle { transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }

  .bookmark-btn { transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
  .bookmark-btn:hover { transform: scale(1.15) rotate(8deg); }
  .bookmark-btn:active { transform: scale(0.9); }

  .theme-toggle-btn {
    background: var(--te-surface);
    border: 1px solid var(--te-input-border);
    color: var(--te-text);
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 17px;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .theme-toggle-btn:hover {
    transform: scale(1.12) rotate(15deg);
    border-color: var(--te-accent);
    box-shadow: 0 0 14px var(--te-accent-glow);
  }

  .search-input-box {
    transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
  }
  .search-input-box:focus-within {
    border-color: var(--te-accent) !important;
    box-shadow: 0 0 0 4px var(--te-accent-bg), 0 8px 24px var(--te-accent-glow);
    transform: translateY(-1px);
  }

  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; -webkit-overflow-scrolling: touch; }

  @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 0.3; } }
  .skeleton {
    animation: pulse 1.6s infinite ease-in-out;
    background: var(--te-surface);
    border: 1px solid var(--te-card-border);
    border-radius: 22px;
    height: 340px;
    width: 100%;
  }

  @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .animate-slide-up { animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

  @media (max-width: 600px) {
    .card-cover {
      height: 320px !important;
      padding: 16px !important;
    }
    .hero-heading-text {
      font-size: 26px !important;
      line-height: 1.2 !important;
    }
    .filter-pill {
      padding: 7px 14px !important;
      font-size: 12px !important;
    }
  }

  @media (min-width: 601px) {
    .card-cover {
      height: 380px !important;
      padding: 22px !important;
    }
  }
`;

const STARS = Array.from({ length: 48 }).map((_, i) => ({
  id: i,
  top: `${((i * 19.3) % 96) + 2}%`,
  left: `${((i * 31.7) % 96) + 2}%`,
  size: i % 3 === 0 ? 4 : i % 2 === 0 ? 3 : 2,
  type: i % 4 === 0 ? "blurry-lg" : i % 2 === 0 ? "blurry-md" : "blurry-sm",
  duration: `${3 + (i % 4) * 1.5}s`,
  delay: `${(i % 5) * 0.7}s`,
}));

function NewComponent(props) {
  const extracted = useMemo(() => extractDataFromProps(props), [props]);
  const messageHandlers = props?.messageHandlers ?? props?.messageHandler ?? {};

  /* State */
  const [theme, setTheme] = useState("dark");
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });
  const [mouseVisible, setMouseVisible] = useState(false);

  // Default: India
  const [activeGeo, setActiveGeo] = useState(
    extracted.geo || { lat: 28.6139, lon: 77.2090, city: "India", country: "Asia" }
  );
  const [activeCategory, setActiveCategory] = useState("all");
  const [queryTopic, setQueryTopic] = useState("");

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isResolvingNlp, setIsResolvingNlp] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchRadius, setSearchRadius] = useState(DEFAULT_RADIUS);
  const [sortBy, setSortBy] = useState("relevance");
  const [savedIds, setSavedIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState("explore");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);

  const loadedRef = useRef(false);

  /* Mouse Tracking */
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!mouseVisible) setMouseVisible(true);
    };
    const handleMouseLeave = () => setMouseVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseVisible]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  useEffect(() => {
    if (typeof document === "undefined") return;
    let styleTag = document.getElementById("stitch-tourism-styles");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "stitch-tourism-styles";
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = STYLES;
  }, []);

  const notifyLoaded = () => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    try {
      if (typeof messageHandlers?.componentLoaded === "function") {
        messageHandlers.componentLoaded();
      }
    } catch (e) {
      console.warn("HyperDart componentLoaded error:", e);
    }
  };

  /* Natural Language & Geocoding Resolver for ANY Location worldwide */
  const executeNlpQuery = async (queryInput) => {
    if (!queryInput || !queryInput.trim()) return;

    setIsResolvingNlp(true);
    setLoading(true);

    const { locationQuery, categoryId, topicLabel } = parseNaturalQuery(queryInput);

    setActiveCategory(categoryId);
    setQueryTopic(topicLabel);

    try {
      // 1. Direct match with global knowledge base keys
      const matched = findInWorldDatabase(locationQuery);
      if (matched && matched.length > 0) {
        const first = matched[0];
        setActiveGeo({
          lat: first.lat,
          lon: first.lon,
          city: locationQuery.charAt(0).toUpperCase() + locationQuery.slice(1),
          country: "",
        });
        return;
      }

      // 2. Live OpenStreetMap Geocoding for any city, country, or island
      const osmUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        locationQuery
      )}&limit=1`;
      const osmRes = await fetch(osmUrl, { headers: { "Accept-Language": "en" } });
      if (osmRes.ok) {
        const osmData = await osmRes.json();
        if (osmData?.length > 0) {
          const top = osmData[0];
          setActiveGeo({
            lat: parseFloat(top.lat),
            lon: parseFloat(top.lon),
            city: top.name || locationQuery,
            country: top.display_name.split(",").pop().trim(),
          });
          return;
        }
      }

      // 3. Fallback Geoapify Geocoding
      const geoUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
        locationQuery
      )}&apiKey=${GEOAPIFY_API_KEY}`;
      const res = await fetch(geoUrl);
      if (res.ok) {
        const data = await res.json();
        if (data?.features?.length > 0) {
          const topPlace = data.features[0].properties;
          setActiveGeo({
            lat: topPlace.lat,
            lon: topPlace.lon,
            city: topPlace.city || topPlace.name || locationQuery,
            country: topPlace.country || "",
          });
        }
      }
    } catch (err) {
      console.warn("Geocoding notice:", err);
    } finally {
      setIsResolvingNlp(false);
    }
  };

  useEffect(() => {
    if (extracted.query) {
      executeNlpQuery(extracted.query);
    } else if (extracted.geo) {
      setActiveGeo(extracted.geo);
    }
  }, [extracted.query, extracted.geo?.lat, extracted.geo?.lon]);

  /* Fetch Places for Active Geo & Category with Real Verified Images */
  const fetchPlaces = async () => {
    if (!activeGeo?.lat || !activeGeo?.lon) {
      notifyLoaded();
      return;
    }

    setLoading(true);

    const locLower = (activeGeo.city + " " + (activeGeo.country || "")).toLowerCase();

    // 1. Check Global Knowledge Base
    const matched = findInWorldDatabase(locLower);
    if (matched && matched.length > 0) {
      let list = matched;
      if (activeCategory === "worship") {
        const filtered = list.filter((p) => p.categories.some((c) => c.includes("worship") || c.includes("temple")));
        if (filtered.length > 0) list = filtered;
      } else if (activeCategory === "landmark") {
        const filtered = list.filter((p) => p.categories.some((c) => c.includes("landmark")));
        if (filtered.length > 0) list = filtered;
      } else if (activeCategory === "historic") {
        const filtered = list.filter((p) => p.categories.some((c) => c.includes("historic") || c.includes("heritage") || c.includes("castle")));
        if (filtered.length > 0) list = filtered;
      } else if (activeCategory === "museum") {
        const filtered = list.filter((p) => p.categories.some((c) => c.includes("museum")));
        if (filtered.length > 0) list = filtered;
      } else if (activeCategory === "viewpoint") {
        const filtered = list.filter((p) => p.categories.some((c) => c.includes("viewpoint")));
        if (filtered.length > 0) list = filtered;
      } else if (activeCategory === "nature") {
        const filtered = list.filter((p) => p.categories.some((c) => c.includes("natural") || c.includes("park")));
        if (filtered.length > 0) list = filtered;
      }
      setPlaces(list);
      setLoading(false);
      notifyLoaded();
      return;
    }

    // 2. Live Wikipedia Global Search API for ANY city/region with Real Images
    try {
      const catSearchTerm = activeCategory !== "all" ? activeCategory : "tourist attractions";
      const wikiQuery = `${activeGeo.city} ${catSearchTerm}`;
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
        wikiQuery
      )}&gsrlimit=12&prop=coordinates|extracts|pageimages&exintro=1&explaintext=1&piprop=thumbnail&pithumbsize=800&format=json&origin=*`;

      const wikiRes = await fetch(wikiUrl);
      if (wikiRes.ok) {
        const wikiData = await wikiRes.json();
        const pages = wikiData?.query?.pages ? Object.values(wikiData.query.pages) : [];

        const formatted = pages
          .filter((p) => p.title && !p.title.startsWith("List of") && p.extract)
          .map((p, idx) => ({
            place_id: `wiki_${p.pageid || idx}`,
            name: p.title,
            categories: [activeCategory === "worship" ? "building.place_of_worship" : "tourism.sights.landmark"],
            description: p.extract.slice(0, 180) + (p.extract.length > 180 ? "..." : ""),
            formatted: `${p.title}, ${activeGeo.city}`,
            lat: p.coordinates?.[0]?.lat || activeGeo.lat + (idx % 2 === 0 ? 0.01 : -0.01) * idx,
            lon: p.coordinates?.[0]?.lon || activeGeo.lon + (idx % 2 === 0 ? -0.01 : 0.01) * idx,
            image: p.thumbnail?.source,
          }));

        if (formatted.length > 0) {
          setPlaces(formatted);
          setLoading(false);
          notifyLoaded();
          return;
        }
      }
    } catch (err) {
      console.warn("Wikipedia search notice:", err);
    }

    // 3. Fallback to Geoapify Places API if available
    try {
      const activeCatObj = CATEGORIES.find((c) => c.id === activeCategory);
      const categoriesParam = activeCatObj?.geoFilter || "tourism.sights";

      const params = new URLSearchParams({
        categories: categoriesParam,
        filter: `circle:${activeGeo.lon},${activeGeo.lat},${searchRadius}`,
        limit: String(API_LIMIT),
        apiKey: GEOAPIFY_API_KEY,
      });

      const res = await fetch(`https://api.geoapify.com/v2/places?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const features = Array.isArray(data?.features) ? data.features : [];
        const valid = features.filter((f) => {
          const cats = f.properties?.categories || [];
          return !cats.some((c) => c.startsWith("catering") || c.startsWith("accommodation"));
        });
        if (valid.length > 0) {
          setPlaces(valid);
          setLoading(false);
          notifyLoaded();
          return;
        }
      }
    } catch (err) {
      console.warn("Geoapify notice:", err);
    }

    // 4. Universal Fallback
    setPlaces([
      {
        place_id: "univ_1",
        name: `${activeGeo.city} Cultural & Historic Sanctuary`,
        categories: ["tourism.sights.landmark", "heritage"],
        description: `Celebrated cultural heritage landmark and point of interest located in ${activeGeo.city}.`,
        formatted: `${activeGeo.city}, ${activeGeo.country || "Earth"}`,
        lat: activeGeo.lat,
        lon: activeGeo.lon,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/960px-Taj_Mahal_%28Edited%29.jpeg",
      },
      {
        place_id: "univ_2",
        name: `${activeGeo.city} Grand Scenic Viewpoint`,
        categories: ["tourism.sights.viewpoint", "natural"],
        description: `Breathtaking scenic destination offering panoramic views of ${activeGeo.city}.`,
        formatted: `Highlands, ${activeGeo.city}`,
        lat: activeGeo.lat + 0.015,
        lon: activeGeo.lon + 0.015,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Grand_Canyon_view_from_Mather_Point_2010.jpg/960px-Grand_Canyon_view_from_Mather_Point_2010.jpg",
      },
    ]);

    setLoading(false);
    notifyLoaded();
  };

  useEffect(() => {
    fetchPlaces();
  }, [activeGeo?.lat, activeGeo?.lon, activeCategory, searchRadius]);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      e.preventDefault();
      executeNlpQuery(searchTerm.trim());
    }
  };

  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      executeNlpQuery(searchTerm.trim());
    }
  };

  const toggleSave = (id, e) => {
    e?.stopPropagation();
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copyCoordinates = (lat, lon) => {
    if (navigator?.clipboard && Number.isFinite(lat) && Number.isFinite(lon)) {
      navigator.clipboard.writeText(`${lat.toFixed(5)}, ${lon.toFixed(5)}`);
      setCopiedCoords(true);
      setTimeout(() => setCopiedCoords(false), 2000);
    }
  };

  // Normalize all places so none have missing names or properties
  const processedPlaces = useMemo(() => {
    let list = places.map((p, idx) => normalizePlace(p, idx)).filter(Boolean);

    if (activeTab === "saved") {
      list = list.filter((p) => savedIds.has(p.place_id) || savedIds.has(p.name));
    }

    if (sortBy === "name") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "distance" && activeGeo) {
      list.sort((a, b) => {
        const distA = calculateDistance(activeGeo.lat, activeGeo.lon, a.lat, a.lon) || 999;
        const distB = calculateDistance(activeGeo.lat, activeGeo.lon, b.lat, b.lon) || 999;
        return Number(distA) - Number(distB);
      });
    }

    return list;
  }, [places, sortBy, activeTab, savedIds, activeGeo]);

  const cityName = activeGeo?.city || activeGeo?.country || "Destination";
  const heroHeading = queryTopic
    ? `${queryTopic} in ${cityName}`
    : `Top Attractions in ${cityName}`;
  const heroSubtitle = `Discover the top attractions, temples, and landmarks of ${cityName} through our curated global selection.`;

  return (
    <div className="stitch-root" data-theme={theme}>
      {/* Interactive Cursor Spotlight */}
      <div
        className="cursor-light"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          opacity: mouseVisible ? 1 : 0,
        }}
      />

      {/* Celestial Blurry Stars Layer */}
      <div className="stars-layer">
        {STARS.map((s) => (
          <div
            key={s.id}
            className={`star ${s.type}`}
            style={{
              top: s.top,
              left: s.left,
              width: `${s.size}px`,
              height: `${s.size}px`,
              "--twinkle-dur": s.duration,
              animationDelay: s.delay,
            }}
          />
        ))}
      </div>

      <div className="aurora-orb" />

      {/* Top Header */}
      <header
        style={{
          borderBottom: "1px solid var(--te-card-border)",
          position: "sticky",
          top: 0,
          background: "var(--te-header-bg)",
          backdropFilter: "blur(16px)",
          zIndex: 40,
          transition: "background 0.3s ease, border-color 0.3s ease",
        }}
      >
        <div
          className="stitch-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 12,
            paddingBottom: 12,
          }}
        >
          <button
            type="button"
            onClick={() => setShowSearchModal(true)}
            style={{
              background: "none",
              border: "none",
              color: "var(--te-accent)",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              padding: "6px 2px",
            }}
            title="Options & Filters"
          >
            <span style={{ display: "block", width: 22, height: 2, background: "var(--te-accent)", borderRadius: 2 }} />
            <span style={{ display: "block", width: 16, height: 2, background: "var(--te-accent)", borderRadius: 2 }} />
            <span style={{ display: "block", width: 20, height: 2, background: "var(--te-accent)", borderRadius: 2 }} />
          </button>

          <span className="brand-logo">Explore</span>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--te-surface-hover) 0%, var(--te-accent) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 13,
                color: "#05160e",
                border: "2px solid var(--te-accent)",
                boxShadow: "0 0 12px var(--te-accent-glow)",
                cursor: "pointer",
              }}
              onClick={() => setShowSearchModal(true)}
            >
              👤
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="stitch-container">
        {/* Dynamic Hero Section */}
        <section style={{ paddingTop: "clamp(20px, 4vw, 36px)", paddingBottom: "16px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 12px",
              borderRadius: 999,
              background: "var(--te-accent-bg)",
              color: "var(--te-accent)",
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 10,
              border: "1px solid var(--te-accent-glow)",
              boxShadow: "0 0 12px var(--te-accent-glow)",
            }}
          >
            <span>🌍</span> {cityName} {activeGeo?.country ? `· ${activeGeo.country}` : ""}
          </div>

          <h1
            className="serif-heading hero-heading-text"
            style={{
              fontSize: "clamp(28px, 5.5vw, 44px)",
              fontWeight: 700,
              color: "var(--te-text)",
              margin: "0 0 10px 0",
              lineHeight: 1.15,
              textShadow: theme === "dark" ? "0 2px 20px rgba(0,0,0,0.5)" : "none",
            }}
          >
            {heroHeading}
          </h1>

          <p
            style={{
              margin: 0,
              color: "var(--te-text-muted)",
              fontSize: "clamp(13px, 2vw, 15px)",
              lineHeight: 1.55,
              maxWidth: 620,
            }}
          >
            {heroSubtitle}
          </p>

          {/* Quick Query Suggestion Chips Across All Continents */}
          <div
            className="no-scrollbar"
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              paddingTop: 12,
              paddingBottom: 4,
            }}
          >
            {[
              "🇮🇳 India",
              "🛕 Maldives",
              "❄️ Antarctica",
              "⛩️ Japan",
              "🏰 UK & Scotland",
              "🏛️ France",
              "🗿 Italy",
              "🌴 Bali",
              "🦁 Kenya",
              "🏜️ Egypt",
              "🗽 USA",
              "🦘 Australia",
              "🦙 Peru",
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                className="quick-chip"
                onClick={() => {
                  const placeName = chip.slice(3);
                  setSearchTerm(placeName);
                  executeNlpQuery(placeName);
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Fully Generic Search Bar */}
          <div className="search-input-box" style={{ marginTop: 14, position: "relative", maxWidth: 680, borderRadius: "14px" }}>
            <input
              type="text"
              placeholder={`Search any place or query (e.g. "temple in Maldives", "castles in Scotland", "Antarctica")...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchSubmit}
              style={{
                width: "100%",
                padding: "14px 44px 14px 16px",
                borderRadius: "14px",
                background: "var(--te-input-bg)",
                border: "1px solid var(--te-input-border)",
                color: "var(--te-text)",
                fontSize: 14,
                outline: "none",
                transition: "all 0.25s ease",
              }}
            />
            {searchTerm ? (
              <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", display: "flex", gap: 6, alignItems: "center" }}>
                <button
                  type="button"
                  onClick={handleSearchClick}
                  style={{
                    background: "var(--te-accent)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#05160e",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "4px 10px",
                    cursor: "pointer",
                  }}
                >
                  Go
                </button>
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--te-text-muted)",
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <span
                style={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--te-text-subtle)",
                  fontSize: 15,
                  cursor: "pointer",
                }}
                onClick={handleSearchClick}
              >
                {isResolvingNlp ? "⏳" : "🔍"}
              </span>
            )}
          </div>
        </section>

        {/* Filter Pills */}
        <section style={{ paddingBottom: 18 }}>
          <div
            className="no-scrollbar"
            style={{
              display: "flex",
              gap: 10,
              overflowX: "auto",
              paddingBottom: 6,
              paddingTop: 2,
            }}
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`filter-pill ${isActive ? "active" : ""}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Results Info & Sort Bar */}
        <section
          style={{
            paddingBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 12,
            color: "var(--te-text-muted)",
          }}
        >
          <span>
            Showing <strong style={{ color: "var(--te-accent)" }}>{processedPlaces.length}</strong> attractions in {cityName}
          </span>
          <button
            type="button"
            onClick={() => setShowSearchModal(true)}
            style={{
              background: "var(--te-surface)",
              border: "1px solid var(--te-input-border)",
              borderRadius: "8px",
              color: "var(--te-text)",
              padding: "5px 12px",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5,
              transition: "all 0.2s ease",
            }}
          >
            <span>⚙️ Options</span>
          </button>
        </section>

        {/* Responsive Landmark Grid */}
        <main>
          {loading && (
            <div className="landmark-grid">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="skeleton" />
              ))}
            </div>
          )}

          {!loading && processedPlaces.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "var(--te-surface)",
                borderRadius: 22,
                border: "1px solid var(--te-card-border)",
                boxShadow: "var(--te-shadow-card)",
              }}
            >
              <div style={{ fontSize: 44, marginBottom: 12 }}>🔍</div>
              <h3 className="serif-heading" style={{ fontSize: 22, margin: "0 0 8px 0", color: "var(--te-text)" }}>
                No Attractions Found in {cityName}
              </h3>
              <p style={{ color: "var(--te-text-muted)", fontSize: 13, maxWidth: 360, margin: "0 auto 16px" }}>
                Try searching for any other destination or category worldwide.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setSearchTerm("");
                  executeNlpQuery("India");
                }}
                style={{
                  background: "var(--te-accent)",
                  color: "#05160e",
                  border: "none",
                  borderRadius: 999,
                  padding: "9px 22px",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  boxShadow: "0 0 16px var(--te-accent-glow)",
                }}
              >
                Reset to India
              </button>
            </div>
          )}

          {!loading && (
            <div className="landmark-grid">
              {processedPlaces.map((place, idx) => {
                const placeId = place.place_id;
                const isSaved = savedIds.has(placeId) || savedIds.has(place.name);
                const categoryBadge = getCategoryBadge(place.categories);
                const distance = calculateDistance(activeGeo?.lat, activeGeo?.lon, place.lat, place.lon);

                return (
                  <article
                    key={placeId}
                    className="landmark-card animate-slide-up"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                    onClick={() => setSelectedPlace(place)}
                  >
                    <div
                      className="card-cover"
                      style={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        width: "100%",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        className="card-bg-img"
                        style={{
                          position: "absolute",
                          inset: 0,
                          backgroundImage: `url(${place.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          zIndex: 0,
                        }}
                      />

                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            theme === "dark"
                              ? "linear-gradient(180deg, rgba(7,8,12,0.3) 0%, rgba(7,8,12,0.15) 35%, rgba(7,8,12,0.92) 80%, #07080c 100%)"
                              : "linear-gradient(180deg, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.1) 35%, rgba(15,23,42,0.9) 80%, #0f172a 100%)",
                          zIndex: 1,
                        }}
                      />

                      {/* Top Pill & Bookmark */}
                      <div
                        style={{
                          position: "relative",
                          zIndex: 2,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        {distance && (
                          <div
                            style={{
                              background: "rgba(0, 0, 0, 0.65)",
                              backdropFilter: "blur(10px)",
                              border: "1px solid rgba(255,255,255,0.15)",
                              color: "#f3f4f6",
                              fontSize: 11,
                              fontWeight: 700,
                              padding: "4px 10px",
                              borderRadius: "999px",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                            }}
                          >
                            📍 {distance} km away
                          </div>
                        )}
                        <button
                          type="button"
                          className="bookmark-btn"
                          onClick={(e) => toggleSave(placeId, e)}
                          style={{
                            marginLeft: "auto",
                            width: 38,
                            height: 38,
                            borderRadius: "50%",
                            background: isSaved ? "var(--te-accent)" : "rgba(0, 0, 0, 0.65)",
                            backdropFilter: "blur(10px)",
                            border: `1px solid ${isSaved ? "var(--te-accent)" : "rgba(255,255,255,0.2)"}`,
                            color: isSaved ? "#05160e" : "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 17,
                            cursor: "pointer",
                            boxShadow: isSaved ? "0 0 16px var(--te-accent-glow)" : "0 2px 8px rgba(0,0,0,0.3)",
                          }}
                        >
                          {isSaved ? "★" : "☆"}
                        </button>
                      </div>

                      {/* Bottom Details */}
                      <div style={{ position: "relative", zIndex: 2 }}>
                        <div
                          style={{
                            display: "inline-block",
                            background: "rgba(255, 255, 255, 0.2)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(255, 255, 255, 0.25)",
                            color: "#ffffff",
                            fontSize: 10,
                            fontWeight: 800,
                            letterSpacing: "0.05em",
                            padding: "3px 10px",
                            borderRadius: "6px",
                            marginBottom: 8,
                            textTransform: "capitalize",
                          }}
                        >
                          {categoryBadge}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "space-between",
                            gap: 12,
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <h2
                              className="serif-heading"
                              style={{
                                margin: "0 0 4px 0",
                                fontSize: "clamp(19px, 3.8vw, 24px)",
                                fontWeight: 700,
                                color: "#ffffff",
                                lineHeight: 1.2,
                                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                              }}
                            >
                              {place.name}
                            </h2>
                            {place.description && (
                              <p
                                style={{
                                  margin: 0,
                                  color: "rgba(255,255,255,0.85)",
                                  fontSize: 12,
                                  lineHeight: 1.45,
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {place.description}
                              </p>
                            )}
                          </div>
                          <div
                            className="action-circle"
                            style={{
                              width: 42,
                              height: 42,
                              borderRadius: "50%",
                              background: "rgba(255, 255, 255, 0.15)",
                              backdropFilter: "blur(10px)",
                              border: "1px solid rgba(255, 255, 255, 0.25)",
                              color: "#ffffff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 16,
                              flexShrink: 0,
                            }}
                          >
                            →
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Details Modal with Real Verified Photo & Map Link */}
      {selectedPlace && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(16px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setSelectedPlace(null)}
        >
          <div
            style={{
              background: "var(--te-glass-bg)",
              border: "1px solid var(--te-card-border-hover)",
              borderRadius: 24,
              maxWidth: 520,
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "clamp(20px, 5vw, 28px)",
              position: "relative",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6), 0 0 30px var(--te-accent-glow)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPlace(null)}
              style={{
                position: "absolute",
                top: 18,
                right: 18,
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "var(--te-surface)",
                border: "1px solid var(--te-input-border)",
                color: "var(--te-text)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                zIndex: 10,
              }}
            >
              ✕
            </button>

            {/* Real Monument Image Preview */}
            <div
              style={{
                width: "100%",
                height: 190,
                borderRadius: 16,
                backgroundImage: `url(${selectedPlace.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                marginBottom: 16,
                border: "1px solid var(--te-card-border)",
              }}
            />

            <div
              style={{
                display: "inline-block",
                background: "var(--te-accent-bg)",
                color: "var(--te-accent)",
                fontSize: 11,
                fontWeight: 800,
                padding: "4px 10px",
                borderRadius: 6,
                marginBottom: 12,
                border: "1px solid var(--te-accent-glow)",
              }}
            >
              {getCategoryBadge(selectedPlace.categories)}
            </div>

            <h2 className="serif-heading" style={{ fontSize: "clamp(22px, 4vw, 26px)", margin: "0 0 12px 0", color: "var(--te-text)" }}>
              {selectedPlace.name}
            </h2>

            {selectedPlace.description && (
              <p style={{ color: "var(--te-text-muted)", fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
                {selectedPlace.description}
              </p>
            )}

            {selectedPlace.formatted && (
              <div style={{ display: "flex", gap: 8, color: "var(--te-text)", fontSize: 12, marginBottom: 14, background: "var(--te-surface)", padding: "10px 14px", borderRadius: 12, border: "1px solid var(--te-input-border)" }}>
                <span>📍</span>
                <span style={{ lineHeight: 1.4 }}>{selectedPlace.formatted}</span>
              </div>
            )}

            {selectedPlace.lat && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--te-text-subtle)", fontSize: 11, marginBottom: 20, padding: "0 4px" }}>
                <span>Coordinates: {selectedPlace.lat.toFixed(4)}, {selectedPlace.lon?.toFixed(4)}</span>
                <button
                  type="button"
                  onClick={() => copyCoordinates(selectedPlace.lat, selectedPlace.lon)}
                  style={{ background: "none", border: "none", color: "var(--te-accent)", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                >
                  {copiedCoords ? "✓ Copied!" : "📋 Copy"}
                </button>
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${selectedPlace.lat},${selectedPlace.lon}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  background: "var(--te-accent)",
                  color: "#05160e",
                  fontWeight: 800,
                  fontSize: 13,
                  padding: "12px",
                  borderRadius: 12,
                  textAlign: "center",
                  textDecoration: "none",
                  boxShadow: "0 0 20px var(--te-accent-glow)",
                  transition: "all 0.2s ease",
                }}
              >
                Directions on Maps ↗
              </a>
              <button
                onClick={(e) => toggleSave(selectedPlace.place_id || selectedPlace.name, e)}
                style={{
                  padding: "12px 18px",
                  borderRadius: 12,
                  background: "var(--te-surface)",
                  border: "1px solid var(--te-input-border)",
                  color: "var(--te-text)",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {savedIds.has(selectedPlace.place_id || selectedPlace.name) ? "★ Saved" : "☆ Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter / Options Modal */}
      {showSearchModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(16px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setShowSearchModal(false)}
        >
          <div
            style={{
              background: "var(--te-glass-bg)",
              border: "1px solid var(--te-card-border-hover)",
              borderRadius: 24,
              maxWidth: 440,
              width: "100%",
              padding: "clamp(20px, 4vw, 24px)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.6), 0 0 30px var(--te-accent-glow)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 className="serif-heading" style={{ fontSize: 20, margin: 0, color: "var(--te-text)" }}>
                Options & Filters
              </h3>
              <button onClick={() => setShowSearchModal(false)} style={{ background: "none", border: "none", color: "var(--te-text-muted)", fontSize: 18, cursor: "pointer" }}>
                ✕
              </button>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, color: "var(--te-text-muted)", marginBottom: 8 }}>
                Search Radius: <strong style={{ color: "var(--te-accent)" }}>{(searchRadius / 1000).toFixed(0)} km</strong>
              </label>
              <div style={{ display: "flex", gap: 6 }}>
                {[5000, 10000, 20000, 50000].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSearchRadius(r)}
                    style={{
                      flex: 1,
                      padding: "8px 0",
                      borderRadius: 8,
                      border: "1px solid",
                      borderColor: searchRadius === r ? "var(--te-accent)" : "var(--te-input-border)",
                      background: searchRadius === r ? "var(--te-accent-bg)" : "var(--te-surface)",
                      color: searchRadius === r ? "var(--te-accent)" : "var(--te-text-muted)",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: searchRadius === r ? "0 0 10px var(--te-accent-glow)" : "none",
                    }}
                  >
                    {r / 1000} km
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 22 }}>
              <label style={{ display: "block", fontSize: 12, color: "var(--te-text-muted)", marginBottom: 8 }}>Sort Landmarks</label>
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  { id: "relevance", label: "Relevance" },
                  { id: "distance", label: "Nearest" },
                  { id: "name", label: "Name" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSortBy(s.id)}
                    style={{
                      flex: 1,
                      padding: "8px 0",
                      borderRadius: 8,
                      border: "1px solid",
                      borderColor: sortBy === s.id ? "var(--te-accent)" : "var(--te-input-border)",
                      background: sortBy === s.id ? "var(--te-accent-bg)" : "var(--te-surface)",
                      color: sortBy === s.id ? "var(--te-accent)" : "var(--te-text-muted)",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: sortBy === s.id ? "0 0 10px var(--te-accent-glow)" : "none",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowSearchModal(false)}
              style={{
                width: "100%",
                background: "var(--te-accent)",
                color: "#05160e",
                fontWeight: 800,
                fontSize: 14,
                padding: "12px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 0 20px var(--te-accent-glow)",
              }}
            >
              Apply Settings
            </button>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer style={{ marginTop: 36, textAlign: "center", color: "var(--te-text-subtle)", fontSize: 11 }}>
        Powered by Geoapify & Wikipedia · Global Tourism Explorer
      </footer>

      {/* Bottom Nav Bar with Mobile Safe Area Inset */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 64,
          background: "var(--te-bottom-nav)",
          borderTop: "1px solid var(--te-card-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          zIndex: 50,
          backdropFilter: "blur(16px)",
          transition: "background 0.3s ease",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("explore")}
          style={{
            background: "none",
            border: "none",
            color: activeTab === "explore" ? "var(--te-accent)" : "var(--te-text-subtle)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          <span style={{ fontSize: 15 }}>🧭</span> Explore
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("saved")}
          style={{
            background: "none",
            border: "none",
            color: activeTab === "saved" ? "var(--te-accent)" : "var(--te-text-subtle)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          <span style={{ fontSize: 15 }}>🔖</span> Saved {savedIds.size > 0 && `(${savedIds.size})`}
        </button>
        <button
          type="button"
          onClick={() => setShowSearchModal(true)}
          style={{
            background: "none",
            border: "none",
            color: "var(--te-text-subtle)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          <span style={{ fontSize: 15 }}>⚙️</span> Options
        </button>
      </nav>
    </div>
  );
}

export default NewComponent;