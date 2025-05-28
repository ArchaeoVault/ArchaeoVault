import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./NewportArtifacts.css";

let backend_url = '';
if (process.env.REACT_APP_DJANGO_ENV === 'production'){ backend_url = `https://${process.env.DJANGO_ALLOWED_HOST_1}/api/`;} else {
  backend_url = 'http://localhost:8000/api/';
}

const NewportArtifacts = () => {
  const [artifacts, setArtifacts] = useState([]);
  const [filteredArtifacts, setFilteredArtifacts] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const [scannedFilter, setScannedFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [organicFilter, setOrganicFilter] = useState("All");
  const [materialFilter, setMaterialFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedArtifactIndex, setExpandedArtifactIndex] = useState(null);

  const artifactsPerPage = 9;

  const imageMappings = [
    { your_table_id: "627", filepath: "2024-0-00-2.jpeg", id: 1 },
    { your_table_id: "377", filepath: "2024-0-00-3.jpeg", id: 2 },
    { your_table_id: "7", filepath: "2024-0-00-4.jpeg", id: 3 },
    { your_table_id: "24", filepath: "2024-0-00-7.jpeg", id: 4 },
    { your_table_id: "415", filepath: "2024-0-00-9.jpeg", id: 5 },
    { your_table_id: "529", filepath: "MD-00.jpeg", id: 6 },
    { your_table_id: "21", filepath: "MD-03.jpeg", id: 7 },
    { your_table_id: "989", filepath: "MD-03.jpeg", id: 8 },
    { your_table_id: "542", filepath: "MD-08.jpeg", id: 9 },
    { your_table_id: "589", filepath: "MD-08.jpeg", id: 10 },
    { your_table_id: "617", filepath: "MD-12.jpeg", id: 11 },
    { your_table_id: "506", filepath: "MD-33.jpeg", id: 12 },
    { your_table_id: "837", filepath: "MD-35.jpeg", id: 13 },
    { your_table_id: "1156", filepath: "2022-7-14-412-CREAMWARE.jpg", id: 14 },
    { your_table_id: "400", filepath: "2022-7-12-429-E,F,G-PEARLWARE.jpg", id: 15 },
    { your_table_id: "426", filepath: "2022-7-12-429-E,F,G-PEARLWARE.jpg", id: 16 },
    { your_table_id: "958", filepath: "2022-7-12-429-E,F,G-PEARLWARE.jpg", id: 17 },
    { your_table_id: "479", filepath: "2022-5-25-235-EARTHENWARE.jpg", id: 18 },
    { your_table_id: "340", filepath: "2021-6-1-56-GLASS_1.jpg", id: 19 },
    { your_table_id: "395", filepath: "2022-7-19-380-PORCELAIN.jpg", id: 20 },
    { your_table_id: "1196", filepath: "2022-7-11-297-RHENISHSTONEWARE_1.jpg", id: 21 },
    { your_table_id: "58", filepath: "2022-6-10-281-B,C-EARTHENWARE.jpg", id: 22 },
    { your_table_id: "702", filepath: "2022-6-10-281-B,C-EARTHENWARE.jpg", id: 23 },
    { your_table_id: "979", filepath: "2022-7-21-411-A,B,C-EARTHENWARE_1.jpg", id: 24 },
    { your_table_id: "592", filepath: "2022-7-21-411-A,B,C-EARTHENWARE_1.jpg", id: 25 },
    { your_table_id: "606", filepath: "2022-7-21-411-A,B,C-EARTHENWARE_1.jpg", id: 26 },
    { your_table_id: "1120", filepath: "2021-6-1-11-D-CREAMWARE.jpg", id: 27 },
    { your_table_id: "979", filepath: "2022-7-21-411-A,B,C-EARTHENWARE_3.jpg", id: 28 },
    { your_table_id: "592", filepath: "2022-7-21-411-A,B,C-EARTHENWARE_3.jpg", id: 29 },
    { your_table_id: "606", filepath: "2022-7-21-411-A,B,C-EARTHENWARE_3.jpg", id: 30 },
    { your_table_id: "1215", filepath: "2021-6-7-112-A-REDWARE.jpg", id: 31 },
    { your_table_id: "1216", filepath: "2022-9-29-576-PEARLWARE.jpg", id: 32 },
    { your_table_id: "1052", filepath: "2021-6-2-183-CERAMIC_2.jpg", id: 33 },
    { your_table_id: "198", filepath: "2022-7-1-439-PEARLWARE.jpg", id: 34 },
    { your_table_id: "773", filepath: "2022-5-25-222-EARTHENWARE.jpg", id: 35 },
    { your_table_id: "1010", filepath: "2022-7-27-453-GLASS_1.jpg", id: 36 },
    { your_table_id: "992", filepath: "2021-10-17-208-PIPESTEM.jpg", id: 37 },
    { your_table_id: "998", filepath: "2022-7-14-414-STONEWARE_1.jpg", id: 38 },
    { your_table_id: "1223", filepath: "2022-7-22-517-BONE_1.jpg", id: 39 },
    { your_table_id: "594", filepath: "2019-9-1-289-STONEWARE_2.jpg", id: 40 },
    { your_table_id: "147", filepath: "2022-7-12-392-GLASS.jpg", id: 41 },
    { your_table_id: "623", filepath: "2021-5-19-90-C-EARTHENWARE.jpg", id: 42 },
    { your_table_id: "148", filepath: "2022-7-21-402-GLASS.jpg", id: 43 },
    { your_table_id: "1184", filepath: "2021-5-17-29-CERAMIC_2.jpg", id: 44 },
    { your_table_id: "297", filepath: "2022-7-26-491-A,B,C-PEARLWARE.jpg", id: 45 },
    { your_table_id: "990", filepath: "2022-7-26-491-A,B,C-PEARLWARE.jpg", id: 46 },
    { your_table_id: "365", filepath: "2022-7-26-491-A,B,C-PEARLWARE.jpg", id: 47 },
    { your_table_id: "784", filepath: "2022-8-4-514-PIPESTEM.jpg", id: 48 },
    { your_table_id: "652", filepath: "2022-7-14-415-REDWARE_2.jpg", id: 49 },
    { your_table_id: "131", filepath: "2022-7-7-367-GLASS_1.jpg", id: 50 },
    { your_table_id: "967", filepath: "2022-7-16-570-B,M-EARTHENWARE_1.jpg", id: 51 },
    { your_table_id: "736", filepath: "2022-7-16-570-B,M-EARTHENWARE_1.jpg", id: 52 },
    { your_table_id: "959", filepath: "2022-7-12-375-CREAMWARE.jpg", id: 53 },
    { your_table_id: "41", filepath: "2021-5-12-171-PIPESTEM_1.jpg", id: 54 },
    { your_table_id: "102", filepath: "2022-7-12-397-PEARLWARE.jpg", id: 55 },
    { your_table_id: "826", filepath: "2022-7-12-404-GLASS_1.jpg", id: 56 },
    { your_table_id: "60", filepath: "2022-7-26-505-GLASS.jpg", id: 57 },
    { your_table_id: "28", filepath: "2022-5-31-276-PIPESTEM.jpg", id: 58 },
    { your_table_id: "594", filepath: "2019-9-1-289-STONEWARE_1.jpg", id: 59 },
    { your_table_id: "984", filepath: "2021-5-19-42-BONE.jpg", id: 60 },
    { your_table_id: "877", filepath: "2022-5-26-243-REDWARE_2.jpg", id: 61 },
    { your_table_id: "1086", filepath: "2022-7-27-511-GLASS_2.jpg", id: 62 },
    { your_table_id: "953", filepath: "2022-7-16-570-K,L-EARTHENWARE.jpg", id: 63 },
    { your_table_id: "656", filepath: "2022-7-16-570-K,L-EARTHENWARE.jpg", id: 64 },
    { your_table_id: "603", filepath: "2021-5-14-133-GLASS_2.jpg", id: 65 },
    { your_table_id: "203", filepath: "2021-6-23-2-BONE_1.jpg", id: 66 },
    { your_table_id: "916", filepath: "2021-6-2-179-CERAMIC_3.jpg", id: 67 },
    { your_table_id: "700", filepath: "2022-7-5-443-GLASS_2.jpg", id: 68 },
    { your_table_id: "1149", filepath: "2022-7-16-570-C,D,E,F-EARTHENWARE.jpg", id: 69 },
    { your_table_id: "648", filepath: "2022-7-16-570-C,D,E,F-EARTHENWARE.jpg", id: 70 },
    { your_table_id: "526", filepath: "2022-7-16-570-C,D,E,F-EARTHENWARE.jpg", id: 71 },
    { your_table_id: "851", filepath: "2022-7-16-570-C,D,E,F-EARTHENWARE.jpg", id: 72 },
    { your_table_id: "87", filepath: "2022-7-12-308-CREAMWARE.jpg", id: 73 },
    { your_table_id: "51", filepath: "2022-8-4-474-A,B,C,D-GLASS_1.jpg", id: 74 },
    { your_table_id: "287", filepath: "2022-8-4-474-A,B,C,D-GLASS_1.jpg", id: 75 },
    { your_table_id: "54", filepath: "2022-8-4-474-A,B,C,D-GLASS_1.jpg", id: 76 },
    { your_table_id: "55", filepath: "2022-8-4-474-A,B,C,D-GLASS_1.jpg", id: 77 },
    { your_table_id: "67", filepath: "2022-7-14-504-A,B,C,D,E,F,G-GLASS_2.jpg", id: 78 },
    { your_table_id: "73", filepath: "2022-7-14-504-A,B,C,D,E,F,G-GLASS_2.jpg", id: 79 },
    { your_table_id: "74", filepath: "2022-7-14-504-A,B,C,D,E,F,G-GLASS_2.jpg", id: 80 },
    { your_table_id: "81", filepath: "2022-7-14-504-A,B,C,D,E,F,G-GLASS_2.jpg", id: 81 },
    { your_table_id: "191", filepath: "2022-7-14-504-A,B,C,D,E,F,G-GLASS_2.jpg", id: 82 },
    { your_table_id: "84", filepath: "2022-7-14-504-A,B,C,D,E,F,G-GLASS_2.jpg", id: 83 },
    { your_table_id: "162", filepath: "2022-7-14-504-A,B,C,D,E,F,G-GLASS_2.jpg", id: 84 },
    { your_table_id: "901", filepath: "2022-7-7-349-C,D-REDWARE.jpg", id: 85 },
    { your_table_id: "629", filepath: "2022-7-7-349-C,D-REDWARE.jpg", id: 86 },
    { your_table_id: "165", filepath: "2022-7-12-556-BONE.jpg", id: 87 },
    { your_table_id: "1102", filepath: "2021-6-22-84-Ceramic_2.jpg", id: 88 },
    { your_table_id: "603", filepath: "2021-5-14-133-GLASS_1.jpg", id: 89 },
    { your_table_id: "61", filepath: "2022-6-7-277-B,C,D,E,F-EARTHENWARE_1.jpg", id: 90 },
    { your_table_id: "62", filepath: "2022-6-7-277-B,C,D,E,F-EARTHENWARE_1.jpg", id: 91 },
    { your_table_id: "844", filepath: "2022-6-7-277-B,C,D,E,F-EARTHENWARE_1.jpg", id: 92 },
    { your_table_id: "20", filepath: "2022-6-7-277-B,C,D,E,F-EARTHENWARE_1.jpg", id: 93 },
    { your_table_id: "31", filepath: "2022-6-7-277-B,C,D,E,F-EARTHENWARE_1.jpg", id: 94 },
    { your_table_id: "919", filepath: "2022-7-1-436-A,B-CREAMWARE.jpg", id: 95 },
    { your_table_id: "957", filepath: "2022-7-1-436-A,B-CREAMWARE.jpg", id: 96 },
    { your_table_id: "1010", filepath: "2022-7-27-453-GLASS_2.jpg", id: 97 },
    { your_table_id: "1111", filepath: "2021-5-18-21-BONE_1.jpg", id: 98 },
    { your_table_id: "945", filepath: "2022-7-28-459-A,B,C,D,E-CREAMWARE.jpg", id: 99 },
    { your_table_id: "549", filepath: "2022-7-28-459-A,B,C,D,E-CREAMWARE.jpg", id: 100 },
    { your_table_id: "1032", filepath: "2022-7-28-459-A,B,C,D,E-CREAMWARE.jpg", id: 101 },
    { your_table_id: "1033", filepath: "2022-7-28-459-A,B,C,D,E-CREAMWARE.jpg", id: 102 },
    { your_table_id: "464", filepath: "2022-7-28-459-A,B,C,D,E-CREAMWARE.jpg", id: 103 },
    { your_table_id: "37", filepath: "2022-6-30-334-STONEWARE_2.jpg", id: 104 },
    { your_table_id: "1074", filepath: "2022-7-28-460-A,B,C,D-GLASS_1.jpg", id: 105 },
    { your_table_id: "334", filepath: "2022-7-28-460-A,B,C,D-GLASS_1.jpg", id: 106 },
    { your_table_id: "1012", filepath: "2022-7-28-460-A,B,C,D-GLASS_1.jpg", id: 107 },
    { your_table_id: "1084", filepath: "2022-7-28-460-A,B,C,D-GLASS_1.jpg", id: 108 },
    { your_table_id: "299", filepath: "2022-8-4-471-PEARLWARE.jpg", id: 109 },
    { your_table_id: "966", filepath: "2021-6-7-114-EARTHENWARE.jpg", id: 110 },
    { your_table_id: "207", filepath: "2021-5-7-59-BONE_2.jpg", id: 111 },
    { your_table_id: "1158", filepath: "2022-8-4-478-A,B-PEARLWARE.jpg", id: 112 },
    { your_table_id: "1159", filepath: "2022-8-4-478-A,B-PEARLWARE.jpg", id: 113 },
    { your_table_id: "1196", filepath: "2022-7-11-297-RHENISHSTONEWARE_2.jpg", id: 114 },
    { your_table_id: "181", filepath: "2022-7-14-408-GLASS.jpg", id: 115 },
    { your_table_id: "1253", filepath: "2021-4-23-104-REDWARE.jpg", id: 116 },
    { your_table_id: "66", filepath: "2022-7-26-493-A,B-GLASS_2.jpg", id: 117 },
    { your_table_id: "52", filepath: "2022-7-26-493-A,B-GLASS_2.jpg", id: 118 },
    { your_table_id: "59", filepath: "2022-7-22-487-GLASS_2.jpg", id: 119 },
    { your_table_id: "1201", filepath: "2022-6-20-361-STONEWARE_3.jpg", id: 120 },
    { your_table_id: "436", filepath: "2022-5-27-224-BONE.jpg", id: 121 },
    { your_table_id: "677", filepath: "2022-6-20-362-A,B-CREAMWARE.jpg", id: 122 },
    { your_table_id: "678", filepath: "2022-6-20-362-A,B-CREAMWARE.jpg", id: 123 },
    { your_table_id: "1071", filepath: "2022-7-1-438-A,B,C,D-GLASS_1.jpg", id: 124 },
    { your_table_id: "1072", filepath: "2022-7-1-438-A,B,C,D-GLASS_1.jpg", id: 125 },
    { your_table_id: "321", filepath: "2022-7-1-438-A,B,C,D-GLASS_1.jpg", id: 126 },
    { your_table_id: "699", filepath: "2022-7-1-438-A,B,C,D-GLASS_1.jpg", id: 127 },
    { your_table_id: "1184", filepath: "2021-5-17-29-CERAMIC_4.jpg", id: 128 },
    { your_table_id: "1042", filepath: "2022-6-10-196-PIPESTEM.jpg", id: 129 },
    { your_table_id: "427", filepath: "2021-5-24-27-BONE_2.jpg", id: 130 },
    { your_table_id: "434", filepath: "2022-5-27-261-A,B-EARTHENWARE.jpg", id: 131 },
    { your_table_id: "776", filepath: "2022-5-27-261-A,B-EARTHENWARE.jpg", id: 132 },
    { your_table_id: "812", filepath: "2021-6-23-61-GLASS_2.jpg", id: 133 },
    { your_table_id: "61", filepath: "2022-6-7-277-B,C,D,E,F-EARTHENWARE_3.jpg", id: 134 },
    { your_table_id: "62", filepath: "2022-6-7-277-B,C,D,E,F-EARTHENWARE_3.jpg", id: 135 },
    { your_table_id: "844", filepath: "2022-6-7-277-B,C,D,E,F-EARTHENWARE_3.jpg", id: 136 },
    { your_table_id: "20", filepath: "2022-6-7-277-B,C,D,E,F-EARTHENWARE_3.jpg", id: 137 },
    { your_table_id: "31", filepath: "2022-6-7-277-B,C,D,E,F-EARTHENWARE_3.jpg", id: 138 },
    { your_table_id: "371", filepath: "2022-7-11-301-PEARLWARE.jpg", id: 139 },
    { your_table_id: "1091", filepath: "2022-5-25-418-GLASS_1.jpg", id: 140 },
    { your_table_id: "1183", filepath: "2021-4-23-32-GLASS_2.jpg", id: 141 },
    { your_table_id: "1184", filepath: "2021-5-17-29-CERAMIC_3.jpg", id: 142 },
    { your_table_id: "1111", filepath: "2021-5-18-21-BONE_2.jpg", id: 143 },
    { your_table_id: "89", filepath: "2022-7-8-310-D,E,F-EARTHENWARE_2.jpg", id: 144 },
    { your_table_id: "92", filepath: "2022-7-8-310-D,E,F-EARTHENWARE_2.jpg", id: 145 },
    { your_table_id: "1075", filepath: "2022-7-8-310-D,E,F-EARTHENWARE_2.jpg", id: 146 },
    { your_table_id: "664", filepath: "2022-7-8-357-C,D,E,F,G,I-CREAMWARE.jpg", id: 147 },
    { your_table_id: "653", filepath: "2022-7-8-357-C,D,E,F,G,I-CREAMWARE.jpg", id: 148 },
    { your_table_id: "936", filepath: "2022-7-8-357-C,D,E,F,G,I-CREAMWARE.jpg", id: 149 },
    { your_table_id: "811", filepath: "2022-7-8-357-C,D,E,F,G,I-CREAMWARE.jpg", id: 150 },
    { your_table_id: "635", filepath: "2022-7-8-357-C,D,E,F,G,I-CREAMWARE.jpg", id: 151 },
    { your_table_id: "821", filepath: "2022-7-8-357-C,D,E,F,G,I-CREAMWARE.jpg", id: 152 },
    { your_table_id: "1086", filepath: "2022-7-27-511-GLASS_1.jpg", id: 153 },
    { your_table_id: "759", filepath: "2022-8-4-472-A,B-CREAMWARE.jpg", id: 154 },
    { your_table_id: "485", filepath: "2022-8-4-472-A,B-CREAMWARE.jpg", id: 155 },
    { your_table_id: "1141", filepath: "2022-7-16-525-B,C-WHITEWARE_2.jpg", id: 156 },
    { your_table_id: "1131", filepath: "2022-7-16-525-B,C-WHITEWARE_2.jpg", id: 157 },
    { your_table_id: "281", filepath: "2022-7-22-428-A,B,C,D,E,F,G,H,I,J,K-GLASS_1.jpg", id: 158 },
    { your_table_id: "336", filepath: "2022-7-22-428-A,B,C,D,E,F,G,H,I,J,K-GLASS_1.jpg", id: 159 },
    { your_table_id: "290", filepath: "2022-7-22-428-A,B,C,D,E,F,G,H,I,J,K-GLASS_1.jpg", id: 160 },
    { your_table_id: "680", filepath: "2022-7-22-428-A,B,C,D,E,F,G,H,I,J,K-GLASS_1.jpg", id: 161 },
    { your_table_id: "681", filepath: "2022-7-22-428-A,B,C,D,E,F,G,H,I,J,K-GLASS_1.jpg", id: 162 },
    { your_table_id: "996", filepath: "2022-7-22-428-A,B,C,D,E,F,G,H,I,J,K-GLASS_1.jpg", id: 163 },
    { your_table_id: "997", filepath: "2022-7-22-428-A,B,C,D,E,F,G,H,I,J,K-GLASS_1.jpg", id: 164 },
    { your_table_id: "363", filepath: "2022-7-22-428-A,B,C,D,E,F,G,H,I,J,K-GLASS_1.jpg", id: 165 },
    { your_table_id: "240", filepath: "2022-7-22-428-A,B,C,D,E,F,G,H,I,J,K-GLASS_1.jpg", id: 166 },
    { your_table_id: "286", filepath: "2022-7-22-428-A,B,C,D,E,F,G,H,I,J,K-GLASS_1.jpg", id: 167 },
    { your_table_id: "335", filepath: "2022-7-22-428-A,B,C,D,E,F,G,H,I,J,K-GLASS_1.jpg", id: 168 },
    { your_table_id: "711", filepath: "2022-7-12-429-B,C-RHENISHSTONEWARE.jpg", id: 169 },
    { your_table_id: "70", filepath: "2022-7-12-429-B,C-RHENISHSTONEWARE.jpg", id: 170 },
    { your_table_id: "231", filepath: "2022-5-24-198-EARTHENWARE_1.jpg", id: 171 },
    { your_table_id: "1228", filepath: "2021-6-7-75-GLASS_2.jpg", id: 172 },
    { your_table_id: "728", filepath: "2022-7-12-381-A,B,C-CREAMWARE.jpg", id: 173 },
    { your_table_id: "729", filepath: "2022-7-12-381-A,B,C-CREAMWARE.jpg", id: 174 },
    { your_table_id: "626", filepath: "2022-7-12-381-A,B,C-CREAMWARE.jpg", id: 175 },
    { your_table_id: "61", filepath: "2022-6-7-277-B,C,D,E,F-EARTHENWARE_2.jpg", id: 176 },
    { your_table_id: "62", filepath: "2022-6-7-277-B,C,D,E,F-EARTHENWARE_2.jpg", id: 177 },
    { your_table_id: "844", filepath: "2022-6-7-277-B,C,D,E,F-EARTHENWARE_2.jpg", id: 178 },
    { your_table_id: "20", filepath: "2022-6-7-277-B,C,D,E,F-EARTHENWARE_2.jpg", id: 179 },
    { your_table_id: "31", filepath: "2022-6-7-277-B,C,D,E,F-EARTHENWARE_2.jpg", id: 180 },
    { your_table_id: "122", filepath: "2022-6-30-332-EARTHENWARE_2.jpg", id: 181 },
    { your_table_id: "1248", filepath: "2021-6-2-137-EARTHENWARE.jpg", id: 182 },
    { your_table_id: "638", filepath: "2022-8-4-477-A,B,C,D,E-CREAMWARE.jpg", id: 183 },
    { your_table_id: "778", filepath: "2022-8-4-477-A,B,C,D,E-CREAMWARE.jpg", id: 184 },
    { your_table_id: "579", filepath: "2022-8-4-477-A,B,C,D,E-CREAMWARE.jpg", id: 185 },
    { your_table_id: "622", filepath: "2022-8-4-477-A,B,C,D,E-CREAMWARE.jpg", id: 186 },
    { your_table_id: "1031", filepath: "2022-8-4-477-A,B,C,D,E-CREAMWARE.jpg", id: 187 },
    { your_table_id: "63", filepath: "2022-6-6-288-A,B,C-EARTHENWARE.jpg", id: 188 },
    { your_table_id: "805", filepath: "2022-6-6-288-A,B,C-EARTHENWARE.jpg", id: 189 },
    { your_table_id: "325", filepath: "2022-6-6-288-A,B,C-EARTHENWARE.jpg", id: 190 },
    { your_table_id: "484", filepath: "2022-5-23-200-EARTHENWARE_1.jpg", id: 191 },
    { your_table_id: "1079", filepath: "2022-7-26-496-CREAMWARE.jpg", id: 192 },
    { your_table_id: "1155", filepath: "2022-7-21-399-EARTHENWARE.jpg", id: 193 },
    { your_table_id: "94", filepath: "2022-5-27-259-EARTHENWARE_2.jpg", id: 194 },
    { your_table_id: "387", filepath: "2022-5-25-232-A,D,E,F,G-EARTHENWARE_1.jpg", id: 195 },
    { your_table_id: "40", filepath: "2022-5-25-232-A,D,E,F,G-EARTHENWARE_1.jpg", id: 196 },
    { your_table_id: "350", filepath: "2022-5-25-232-A,D,E,F,G-EARTHENWARE_1.jpg", id: 197 },
    { your_table_id: "833", filepath: "2022-5-25-232-A,D,E,F,G-EARTHENWARE_1.jpg", id: 198 },
    { your_table_id: "1151", filepath: "2022-5-25-232-A,D,E,F,G-EARTHENWARE_1.jpg", id: 199 },
    { your_table_id: "257", filepath: "2022-7-11-553-A,B,C,D,E,F,G-BONE.jpg", id: 200 },
    { your_table_id: "1160", filepath: "2022-7-11-553-A,B,C,D,E,F,G-BONE.jpg", id: 201 },
    { your_table_id: "1132", filepath: "2022-7-11-553-A,B,C,D,E,F,G-BONE.jpg", id: 202 },
    { your_table_id: "473", filepath: "2022-7-11-553-A,B,C,D,E,F,G-BONE.jpg", id: 203 },
    { your_table_id: "431", filepath: "2022-7-11-553-A,B,C,D,E,F,G-BONE.jpg", id: 204 },
    { your_table_id: "329", filepath: "2022-7-11-553-A,B,C,D,E,F,G-BONE.jpg", id: 205 },
    { your_table_id: "450", filepath: "2022-7-11-553-A,B,C,D,E,F,G-BONE.jpg", id: 206 },
    { your_table_id: "1248", filepath: "2021-6-2-137-EARTHENWARE_3.jpg", id: 207 },
    { your_table_id: "976", filepath: "2022-5-27-260-B,C-EARTHENWARE_2.jpg", id: 208 },
    { your_table_id: "169", filepath: "2022-5-27-260-B,C-EARTHENWARE_2.jpg", id: 209 },
    { your_table_id: "407", filepath: "2021-5-19-48-RHENISHSTONEWARE_2.jpg", id: 210 },
    { your_table_id: "537", filepath: "2022-6-6-567-EARTHENWARE_2.jpg", id: 211 },
    { your_table_id: "360", filepath: "2022-7-28-462-GLASS_2.jpg", id: 212 },
    { your_table_id: "1089", filepath: "2021-5-20-24-TOOTH.jpg", id: 213 },
    { your_table_id: "266", filepath: "2022-7-26-532-BONE.jpg", id: 214 },
    { your_table_id: "202", filepath: "2022-6-18-201-PIPESTEM.jpg", id: 215 },
    { your_table_id: "788", filepath: "2022-7-12-229-PIPESTEM.jpg", id: 216 },
    { your_table_id: "163", filepath: "2021-10-9-521-EARTHENWARE_1.jpg", id: 217 },
    { your_table_id: "497", filepath: "2022-6-6-480-A,B-REDWARE.jpg", id: 218 },
    { your_table_id: "845", filepath: "2022-6-6-480-A,B-REDWARE.jpg", id: 219 },
    { your_table_id: "591", filepath: "2021-5-18-19-PIPESTEM_1.jpg", id: 220 },
    { your_table_id: "904", filepath: "2022-5-26-238-PORCELAIN.jpg", id: 221 },
    { your_table_id: "362", filepath: "2021-5-13-1-TOOTH.jpg", id: 222 },
    { your_table_id: "826", filepath: "2022-7-12-404-GLASS_2.jpg", id: 223 },
    { your_table_id: "1152", filepath: "2021-5-24-44-GLASS_2.jpg", id: 224 },
    { your_table_id: "998", filepath: "2022-7-14-414-STONEWARE_2.jpg", id: 225 },
    { your_table_id: "1248", filepath: "2021-6-2-137-EARTHENWARE_2.jpg", id: 226 },
    { your_table_id: "916", filepath: "2021-6-2-179-PEARLWARE.jpg", id: 227 },
    { your_table_id: "533", filepath: "2021-5-19-88-STONEWARE_3.jpg", id: 228 },
    { your_table_id: "1199", filepath: "2021-4-21-74-GLASS_2.jpg", id: 229 },
    { your_table_id: "1194", filepath: "2021-5-19-50-EARTHENWARE.jpg", id: 230 },
    { your_table_id: "208", filepath: "2021-6-1-13-STONEWARE_2.jpg", id: 231 },
    { your_table_id: "652", filepath: "2022-7-14-415-REDWARE_1.jpg", id: 232 },
    { your_table_id: "298", filepath: "2022-7-26-497-A,B,C-PEARLWARE.jpg", id: 233 },
    { your_table_id: "235", filepath: "2022-7-26-497-A,B,C-PEARLWARE.jpg", id: 234 },
    { your_table_id: "267", filepath: "2022-7-26-497-A,B,C-PEARLWARE.jpg", id: 235 },
    { your_table_id: "146", filepath: "2022-7-21-313-A,B-GLASS_2.jpg", id: 236 },
    { your_table_id: "237", filepath: "2022-7-21-313-A,B-GLASS_2.jpg", id: 237 },
    { your_table_id: "779", filepath: "2022-7-7-368-A,B,C,D,E,F-REDWARE.jpg", id: 238 },
    { your_table_id: "230", filepath: "2022-7-7-368-A,B,C,D,E,F-REDWARE.jpg", id: 239 },
    { your_table_id: "307", filepath: "2022-7-7-368-A,B,C,D,E,F-REDWARE.jpg", id: 240 },
    { your_table_id: "550", filepath: "2022-7-7-368-A,B,C,D,E,F-REDWARE.jpg", id: 241 },
    { your_table_id: "551", filepath: "2022-7-7-368-A,B,C,D,E,F-REDWARE.jpg", id: 242 },
    { your_table_id: "552", filepath: "2022-7-7-368-A,B,C,D,E,F-REDWARE.jpg", id: 243 },
    { your_table_id: "1223", filepath: "2022-7-22-517-BONE_2.jpg", id: 244 },
    { your_table_id: "1052", filepath: "2021-6-2-183-CERAMIC_1.jpg", id: 245 },
    { your_table_id: "836", filepath: "2022-6-28-445-CREAMWARE.jpg", id: 246 },
    { your_table_id: "209", filepath: "2021-5-18-20-BONE_1.jpg", id: 247 },
    { your_table_id: "183", filepath: "2022-7-22-486-EARTHENWARE_2.jpg", id: 248 },
    { your_table_id: "95", filepath: "2022-5-24-213-PORCELAIN.jpg", id: 249 },
    { your_table_id: "695", filepath: "2022-5-24-207-EARTHENWARE_1.jpg", id: 250 },
    { your_table_id: "695", filepath: "2022-5-24-207-EARTHENWARE_2.jpg", id: 251 },
    { your_table_id: "304", filepath: "2022-6-2-195-PIPESTEM.jpg", id: 252 },
    { your_table_id: "1201", filepath: "2022-6-20-361-STONEWARE_1.jpg", id: 253 },
    { your_table_id: "67", filepath: "2022-7-14-504-A,B,C,D,E,F,G-GLASS_1.jpg", id: 254 },
    { your_table_id: "73", filepath: "2022-7-14-504-A,B,C,D,E,F,G-GLASS_1.jpg", id: 255 },
    { your_table_id: "74", filepath: "2022-7-14-504-A,B,C,D,E,F,G-GLASS_1.jpg", id: 256 },
    { your_table_id: "81", filepath: "2022-7-14-504-A,B,C,D,E,F,G-GLASS_1.jpg", id: 257 },
    { your_table_id: "191", filepath: "2022-7-14-504-A,B,C,D,E,F,G-GLASS_1.jpg", id: 258 },
    { your_table_id: "84", filepath: "2022-7-14-504-A,B,C,D,E,F,G-GLASS_1.jpg", id: 259 },
    { your_table_id: "162", filepath: "2022-7-14-504-A,B,C,D,E,F,G-GLASS_1.jpg", id: 260 },
    { your_table_id: "289", filepath: "2022-7-12-427-A,B,C,D,E,F,G-GLASS.jpg", id: 261 },
    { your_table_id: "1076", filepath: "2022-7-12-427-A,B,C,D,E,F,G-GLASS.jpg", id: 262 },
    { your_table_id: "223", filepath: "2022-7-12-427-A,B,C,D,E,F,G-GLASS.jpg", id: 263 },
    { your_table_id: "918", filepath: "2022-7-12-427-A,B,C,D,E,F,G-GLASS.jpg", id: 264 },
    { your_table_id: "278", filepath: "2022-7-12-427-A,B,C,D,E,F,G-GLASS.jpg", id: 265 },
    { your_table_id: "1092", filepath: "2022-7-12-427-A,B,C,D,E,F,G-GLASS.jpg", id: 266 },
    { your_table_id: "280", filepath: "2022-7-12-427-A,B,C,D,E,F,G-GLASS.jpg", id: 267 },
    { your_table_id: "1153", filepath: "2022-7-12-413-A,B-PEARLWARE.jpg", id: 268 },
    { your_table_id: "1157", filepath: "2022-7-12-413-A,B-PEARLWARE.jpg", id: 269 },
    { your_table_id: "708", filepath: "2022-5-31-321-REDWARE.jpg", id: 270 },
    { your_table_id: "281", filepath: "2022-7-22-428-A,B,C,D,E,F,G,H,I,J,K-GLASS_2.jpg", id: 271 },
    { your_table_id: "336", filepath: "2022-7-22-428-A,B,C,D,E,F,G,H,I,J,K-GLASS_2.jpg", id: 272 },
    { your_table_id: "290", filepath: "2022-7-22-428-A,B,C,D,E,F,G,H,I,J,K-GLASS_2.jpg", id: 273 },
    { your_table_id: "680", filepath: "2022-7-22-428-A,B,C,D,E,F,G,H,I,J,K-GLASS_2.jpg", id: 274 },
    { your_table_id: "681", filepath: "2022-7-22-428-A,B,C,D,E,F,G,H,I,J,K-GLASS_2.jpg", id: 275 },
    { your_table_id: "996", filepath: "2022-7-22-428-A,B,C,D,E,F,G,H,I,J,K-GLASS_2.jpg", id: 276 },
    { your_table_id: "997", filepath: "2022-7-22-428-A,B,C,D,E,F,G,H,I,J,K-GLASS_2.jpg", id: 277 },
    { your_table_id: "363", filepath: "2022-7-22-428-A,B,C,D,E,F,G,H,I,J,K-GLASS_2.jpg", id: 278 },
    { your_table_id: "240", filepath: "2022-7-22-428-A,B,C,D,E,F,G,H,I,J,K-GLASS_2.jpg", id: 279 },
    { your_table_id: "286", filepath: "2022-7-22-428-A,B,C,D,E,F,G,H,I,J,K-GLASS_2.jpg", id: 280 },
    { your_table_id: "335", filepath: "2022-7-22-428-A,B,C,D,E,F,G,H,I,J,K-GLASS_2.jpg", id: 281 },
    { your_table_id: "346", filepath: "2022-7-26-534-BONE.jpg", id: 282 },
    { your_table_id: "122", filepath: "2022-6-30-332-EARTHENWARE_1.jpg", id: 283 },
    { your_table_id: "565", filepath: "2022-8-4-470-A,B,C-REDWARE.jpg", id: 284 },
    { your_table_id: "195", filepath: "2022-8-4-470-A,B,C-REDWARE.jpg", id: 285 },
    { your_table_id: "474", filepath: "2022-8-4-470-A,B,C-REDWARE.jpg", id: 286 },
    { your_table_id: "85", filepath: "2022-8-4-515-A,B,C-GLASS.jpg", id: 287 },
    { your_table_id: "401", filepath: "2022-8-4-515-A,B,C-GLASS.jpg", id: 288 },
    { your_table_id: "68", filepath: "2022-8-4-515-A,B,C-GLASS.jpg", id: 289 },
    { your_table_id: "250", filepath: "2022-7-22-490-PEARLWARE.jpg", id: 290 },
    { your_table_id: "1188", filepath: "2022-7-14-508-B,C,E-WHITEWARE_2.jpg", id: 291 },
    { your_table_id: "1191", filepath: "2022-7-14-508-B,C,E-WHITEWARE_2.jpg", id: 292 },
    { your_table_id: "1242", filepath: "2022-7-14-508-B,C,E-WHITEWARE_2.jpg", id: 293 },
    { your_table_id: "1102", filepath: "2021-6-22-84-CERAMIC_1.jpg", id: 294 },
    { your_table_id: "277", filepath: "2022-7-12-416-A,B,C-GLASS_2.jpg", id: 295 },
    { your_table_id: "164", filepath: "2022-7-12-416-A,B,C-GLASS_2.jpg", id: 296 },
    { your_table_id: "170", filepath: "2022-7-12-416-A,B,C-GLASS_2.jpg", id: 297 },
    { your_table_id: "758", filepath: "2022-6-7-284-A,B-GLASS_2.jpg", id: 298 },
    { your_table_id: "999", filepath: "2022-6-7-284-A,B-GLASS_2.jpg", id: 299 },
    { your_table_id: "178", filepath: "2022-7-21-394-A,B-GLASS_2.jpg", id: 300 },
    { your_table_id: "185", filepath: "2022-7-21-394-A,B-GLASS_2.jpg", id: 301 },
    { your_table_id: "90", filepath: "2022-5-25-228-EARTHENWARE.jpg", id: 302 },
    { your_table_id: "600", filepath: "2022-7-22-424-D,E,F-EARHTHENWARE.jpg", id: 303 },
    { your_table_id: "189", filepath: "2022-7-22-424-D,E,F-EARHTHENWARE.jpg", id: 304 },
    { your_table_id: "194", filepath: "2022-7-22-424-D,E,F-EARHTHENWARE.jpg", id: 305 },
    { your_table_id: "988", filepath: "2022-7-8-303-A,B-CREAMWARE.jpg", id: 306 },
    { your_table_id: "433", filepath: "2022-7-8-303-A,B-CREAMWARE.jpg", id: 307 },
    { your_table_id: "1100", filepath: "2021-5-19-49-EARTHENWARE.jpg", id: 308 },
    { your_table_id: "1045", filepath: "2022-7-27-509-B,C,D-EARTHENWARE.jpg", id: 309 },
    { your_table_id: "524", filepath: "2022-7-27-509-B,C,D-EARTHENWARE.jpg", id: 310 },
    { your_table_id: "226", filepath: "2022-7-27-509-B,C,D-EARTHENWARE.jpg", id: 311 },
    { your_table_id: "916", filepath: "2021-6-2-179-CERAMIC_1.jpg", id: 312 },
    { your_table_id: "427", filepath: "2021-5-24-27-BONE_1.jpg", id: 313 },
    { your_table_id: "324", filepath: "2022-6-18-263-A,B,C-RHENISHSTONEWARE_2.jpg", id: 314 },
    { your_table_id: "42", filepath: "2022-6-18-263-A,B,C-RHENISHSTONEWARE_2.jpg", id: 315 },
    { your_table_id: "139", filepath: "2022-6-18-263-A,B,C-RHENISHSTONEWARE_2.jpg", id: 316 },
    { your_table_id: "277", filepath: "2022-7-12-416-A,B,C-GLASS_1.jpg", id: 317 },
    { your_table_id: "164", filepath: "2022-7-12-416-A,B,C-GLASS_1.jpg", id: 318 },
    { your_table_id: "170", filepath: "2022-7-12-416-A,B,C-GLASS_1.jpg", id: 319 },
    { your_table_id: "1112", filepath: "2021-5-19-40-PIPESTEM.jpg", id: 320 },
    { your_table_id: "212", filepath: "2022-7-26-502-EARTHENWARE.jpg", id: 321 },
    { your_table_id: "48", filepath: "2022-7-16-525-D,E,F-PEARLWARE.jpg", id: 322 },
    { your_table_id: "1197", filepath: "2022-7-16-525-D,E,F-PEARLWARE.jpg", id: 323 },
    { your_table_id: "1123", filepath: "2022-7-16-525-D,E,F-PEARLWARE.jpg", id: 324 },
    { your_table_id: "859", filepath: "2022-7-11-339-E,F,G-CREAMWARE.jpg", id: 325 },
    { your_table_id: "642", filepath: "2022-7-11-339-E,F,G-CREAMWARE.jpg", id: 326 },
    { your_table_id: "780", filepath: "2022-7-11-339-E,F,G-CREAMWARE.jpg", id: 327 },
    { your_table_id: "1175", filepath: "2022-7-5-215-A,B-RHENISHSTONEWARE_2.jpg", id: 328 },
    { your_table_id: "1195", filepath: "2022-7-5-215-A,B-RHENISHSTONEWARE_2.jpg", id: 329 },
    { your_table_id: "1005", filepath: "2022-7-12-422-E,F-PEARLWARE.jpg", id: 330 },
    { your_table_id: "1006", filepath: "2022-7-12-422-E,F-PEARLWARE.jpg", id: 331 },
    { your_table_id: "127", filepath: "2021-5-24-38-BONE_2.jpg", id: 332 },
    { your_table_id: "976", filepath: "2022-5-27-260-B,C-EARTHENWARE_1.jpg", id: 333 },
    { your_table_id: "169", filepath: "2022-5-27-260-B,C-EARTHENWARE_1.jpg", id: 334 },
    { your_table_id: "283", filepath: "2022-7-27-455-RHENISHSTONEWARE.jpg", id: 335 },
    { your_table_id: "229", filepath: "2022-7-26-506-A,B-EARTHENWARE.jpg", id: 336 },
    { your_table_id: "769", filepath: "2022-7-26-506-A,B-EARTHENWARE.jpg", id: 337 },
    { your_table_id: "430", filepath: "2022-7-22-520-D,E-BONE_1.jpg", id: 338 },
    { your_table_id: "293", filepath: "2022-7-22-520-D,E-BONE_1.jpg", id: 339 },
    { your_table_id: "65", filepath: "2022-7-26-507-GLASS_2.jpg", id: 340 },
    { your_table_id: "232", filepath: "2022-7-11-307-A,B,C,D,E,F,G,H,I,J-GLASS.jpg", id: 341 },
    { your_table_id: "944", filepath: "2022-7-11-307-A,B,C,D,E,F,G,H,I,J-GLASS.jpg", id: 342 },
    { your_table_id: "781", filepath: "2022-7-11-307-A,B,C,D,E,F,G,H,I,J-GLASS.jpg", id: 343 },
    { your_table_id: "782", filepath: "2022-7-11-307-A,B,C,D,E,F,G,H,I,J-GLASS.jpg", id: 344 },
    { your_table_id: "783", filepath: "2022-7-11-307-A,B,C,D,E,F,G,H,I,J-GLASS.jpg", id: 345 },
    { your_table_id: "933", filepath: "2022-7-11-307-A,B,C,D,E,F,G,H,I,J-GLASS.jpg", id: 346 },
    { your_table_id: "264", filepath: "2022-7-11-307-A,B,C,D,E,F,G,H,I,J-GLASS.jpg", id: 347 },
    { your_table_id: "82", filepath: "2022-7-11-307-A,B,C,D,E,F,G,H,I,J-GLASS.jpg", id: 348 },
    { your_table_id: "1068", filepath: "2022-7-11-307-A,B,C,D,E,F,G,H,I,J-GLASS.jpg", id: 349 },
    { your_table_id: "93", filepath: "2022-7-11-307-A,B,C,D,E,F,G,H,I,J-GLASS.jpg", id: 350 },
    { your_table_id: "222", filepath: "2022-8-4-473-PEARLWARE.jpg", id: 351 },
    { your_table_id: "214", filepath: "2021-9-14-210-PIPESTEM.jpg", id: 352 },
    { your_table_id: "1061", filepath: "2021-6-1-4-RHENISHSTONEWARE.jpg", id: 353 },
    { your_table_id: "1167", filepath: "2022-6-20-343-D,E,F,G-CREAMWARE.jpg", id: 354 },
    { your_table_id: "806", filepath: "2022-6-20-343-D,E,F,G-CREAMWARE.jpg", id: 355 },
    { your_table_id: "816", filepath: "2022-6-20-343-D,E,F,G-CREAMWARE.jpg", id: 356 },
    { your_table_id: "634", filepath: "2022-6-20-343-D,E,F,G-CREAMWARE.jpg", id: 357 },
    { your_table_id: "475", filepath: "2022-7-11-316-REDWARE.jpg", id: 358 },
    { your_table_id: "1141", filepath: "2022-7-16-525-B,C-WHITEWARE_1.jpg", id: 359 },
    { your_table_id: "1131", filepath: "2022-7-16-525-B,C-WHITEWARE_1.jpg", id: 360 },
    { your_table_id: "591", filepath: "2021-5-18-19-PIPESTEM_2.jpg", id: 361 },
    { your_table_id: "47", filepath: "2022-6-1-566-BONE.jpg", id: 362 },
    { your_table_id: "593", filepath: "2022-7-8-310-A,B,C-EARTHENWARE.jpg", id: 363 },
    { your_table_id: "810", filepath: "2022-7-8-310-A,B,C-EARTHENWARE.jpg", id: 364 },
    { your_table_id: "743", filepath: "2022-7-8-310-A,B,C-EARTHENWARE.jpg", id: 365 },
    { your_table_id: "177", filepath: "2022-7-19-378-EARTHENWARE_2.jpg", id: 366 },
    { your_table_id: "1061", filepath: "2021-6-1-4-RHENISHSTONEWARE_2.jpg", id: 367 },
    { your_table_id: "732", filepath: "2021-6-7-539-B,C,D,H-EARTHENEWARE.jpg", id: 368 },
    { your_table_id: "417", filepath: "2021-6-7-539-B,C,D,H-EARTHENEWARE.jpg", id: 369 },
    { your_table_id: "1200", filepath: "2021-6-7-539-B,C,D,H-EARTHENEWARE.jpg", id: 370 },
    { your_table_id: "785", filepath: "2021-6-7-539-B,C,D,H-EARTHENEWARE.jpg", id: 371 },
    { your_table_id: "252", filepath: "2022-7-1-537-BONE_1.jpg", id: 372 },
    { your_table_id: "979", filepath: "2022-7-21-411-A,B,C-EARTHENWARE_2.jpg", id: 373 },
    { your_table_id: "592", filepath: "2022-7-21-411-A,B,C-EARTHENWARE_2.jpg", id: 374 },
    { your_table_id: "606", filepath: "2022-7-21-411-A,B,C-EARTHENWARE_2.jpg", id: 375 },
    { your_table_id: "339", filepath: "2021-6-2-185-EARTHENWARE.jpg", id: 376 },
    { your_table_id: "153", filepath: "2022-7-12-379-A,B,C,D-GLASS.jpg", id: 377 },
    { your_table_id: "159", filepath: "2022-7-12-379-A,B,C,D-GLASS.jpg", id: 378 },
    { your_table_id: "160", filepath: "2022-7-12-379-A,B,C,D-GLASS.jpg", id: 379 },
    { your_table_id: "161", filepath: "2022-7-12-379-A,B,C,D-GLASS.jpg", id: 380 },
    { your_table_id: "1243", filepath: "2022-7-14-508-F,G,H,I-CREAMWARE.jpg", id: 381 },
    { your_table_id: "676", filepath: "2022-7-14-508-F,G,H,I-CREAMWARE.jpg", id: 382 },
    { your_table_id: "671", filepath: "2022-7-14-508-F,G,H,I-CREAMWARE.jpg", id: 383 },
    { your_table_id: "672", filepath: "2022-7-14-508-F,G,H,I-CREAMWARE.jpg", id: 384 },
    { your_table_id: "1071", filepath: "2022-7-1-438-A,B,C,D-GLASS_2.jpg", id: 385 },
    { your_table_id: "1072", filepath: "2022-7-1-438-A,B,C,D-GLASS_2.jpg", id: 386 },
    { your_table_id: "321", filepath: "2022-7-1-438-A,B,C,D-GLASS_2.jpg", id: 387 },
    { your_table_id: "699", filepath: "2022-7-1-438-A,B,C,D-GLASS_2.jpg", id: 388 },
    { your_table_id: "59", filepath: "2022-7-22-487-GLASS_1.jpg", id: 389 },
    { your_table_id: "1184", filepath: "2021-5-17-29-CERAMIC_1.jpg", id: 390 },
    { your_table_id: "99", filepath: "2022-7-21-309-A,B,C-PEARLWARE.jpg", id: 391 },
    { your_table_id: "109", filepath: "2022-7-21-309-A,B,C-PEARLWARE.jpg", id: 392 },
    { your_table_id: "493", filepath: "2022-7-21-309-A,B,C-PEARLWARE.jpg", id: 393 },
    { your_table_id: "131", filepath: "2022-7-7-367-GLASS_2.jpg", id: 394 },
    { your_table_id: "614", filepath: "2022-5-26-250-A,B,-EARTHENWARE.jpg", id: 395 },
    { your_table_id: "492", filepath: "2022-5-26-250-A,B,-EARTHENWARE.jpg", id: 396 },
    { your_table_id: "1217", filepath: "2019-11-15-577-WHITEWARE_1.jpg", id: 397 },
    { your_table_id: "183", filepath: "2022-7-22-486-EARTHENWARE_1.jpg", id: 398 },
    { your_table_id: "292", filepath: "2022-7-28-432-A,B,C,D,E,F,G,H,I,J,K,L-PEARLWARE.jpg", id: 399 },
    { your_table_id: "179", filepath: "2022-7-28-432-A,B,C,D,E,F,G,H,I,J,K,L-PEARLWARE.jpg", id: 400 },
    { your_table_id: "180", filepath: "2022-7-28-432-A,B,C,D,E,F,G,H,I,J,K,L-PEARLWARE.jpg", id: 401 },
    { your_table_id: "651", filepath: "2022-7-28-432-A,B,C,D,E,F,G,H,I,J,K,L-PEARLWARE.jpg", id: 402 },
    { your_table_id: "994", filepath: "2022-7-28-432-A,B,C,D,E,F,G,H,I,J,K,L-PEARLWARE.jpg", id: 403 },
    { your_table_id: "302", filepath: "2022-7-28-432-A,B,C,D,E,F,G,H,I,J,K,L-PEARLWARE.jpg", id: 404 },
    { your_table_id: "305", filepath: "2022-7-28-432-A,B,C,D,E,F,G,H,I,J,K,L-PEARLWARE.jpg", id: 405 },
    { your_table_id: "890", filepath: "2022-7-28-432-A,B,C,D,E,F,G,H,I,J,K,L-PEARLWARE.jpg", id: 406 },
    { your_table_id: "883", filepath: "2022-7-28-432-A,B,C,D,E,F,G,H,I,J,K,L-PEARLWARE.jpg", id: 407 },
    { your_table_id: "884", filepath: "2022-7-28-432-A,B,C,D,E,F,G,H,I,J,K,L-PEARLWARE.jpg", id: 408 },
    { your_table_id: "544", filepath: "2022-7-28-432-A,B,C,D,E,F,G,H,I,J,K,L-PEARLWARE.jpg", id: 409 },
    { your_table_id: "196", filepath: "2022-7-28-432-A,B,C,D,E,F,G,H,I,J,K,L-PEARLWARE.jpg", id: 410 },
    { your_table_id: "207", filepath: "2021-5-7-59-BONE_1.jpg", id: 411 },
    { your_table_id: "1238", filepath: "2022-7-7-363-GLASS.jpg", id: 412 },
    { your_table_id: "89", filepath: "2022-7-8-310-D,E,F-EARTHENWARE_1.jpg", id: 413 },
    { your_table_id: "92", filepath: "2022-7-8-310-D,E,F-EARTHENWARE_1.jpg", id: 414 },
    { your_table_id: "1075", filepath: "2022-7-8-310-D,E,F-EARTHENWARE_1.jpg", id: 415 },
    { your_table_id: "964", filepath: "2022-6-2-330-A,B,C-REDWARE.jpg", id: 416 },
    { your_table_id: "553", filepath: "2022-6-2-330-A,B,C-REDWARE.jpg", id: 417 },
    { your_table_id: "760", filepath: "2022-6-2-330-A,B,C-REDWARE.jpg", id: 418 },
    { your_table_id: "416", filepath: "2022-6-7-292-A,B,C,D,E,F,G,H,I,J,K,L-EARTHENWARE.jpg", id: 419 },
    { your_table_id: "72", filepath: "2022-6-7-292-A,B,C,D,E,F,G,H,I,J,K,L-EARTHENWARE.jpg", id: 420 },
    { your_table_id: "422", filepath: "2022-6-7-292-A,B,C,D,E,F,G,H,I,J,K,L-EARTHENWARE.jpg", id: 421 },
    { your_table_id: "413", filepath: "2022-6-7-292-A,B,C,D,E,F,G,H,I,J,K,L-EARTHENWARE.jpg", id: 422 },
    { your_table_id: "980", filepath: "2022-6-7-292-A,B,C,D,E,F,G,H,I,J,K,L-EARTHENWARE.jpg", id: 423 },
    { your_table_id: "79", filepath: "2022-6-7-292-A,B,C,D,E,F,G,H,I,J,K,L-EARTHENWARE.jpg", id: 424 },
    { your_table_id: "80", filepath: "2022-6-7-292-A,B,C,D,E,F,G,H,I,J,K,L-EARTHENWARE.jpg", id: 425 },
    { your_table_id: "930", filepath: "2022-6-7-292-A,B,C,D,E,F,G,H,I,J,K,L-EARTHENWARE.jpg", id: 426 },
    { your_table_id: "158", filepath: "2022-6-7-292-A,B,C,D,E,F,G,H,I,J,K,L-EARTHENWARE.jpg", id: 427 },
    { your_table_id: "793", filepath: "2022-6-7-292-A,B,C,D,E,F,G,H,I,J,K,L-EARTHENWARE.jpg", id: 428 },
    { your_table_id: "75", filepath: "2022-6-7-292-A,B,C,D,E,F,G,H,I,J,K,L-EARTHENWARE.jpg", id: 429 },
    { your_table_id: "227", filepath: "2022-6-7-292-A,B,C,D,E,F,G,H,I,J,K,L-EARTHENWARE.jpg", id: 430 },
    { your_table_id: "171", filepath: "2022-7-22-420-A,B,C,D-GLASS.jpg", id: 431 },
    { your_table_id: "108", filepath: "2022-7-22-420-A,B,C,D-GLASS.jpg", id: 432 },
    { your_table_id: "188", filepath: "2022-7-22-420-A,B,C,D-GLASS.jpg", id: 433 },
    { your_table_id: "197", filepath: "2022-7-22-420-A,B,C,D-GLASS.jpg", id: 434 },
    { your_table_id: "1", filepath: "2021-5-15-154-BONE_2.jpg", id: 435 },
    { your_table_id: "533", filepath: "2021-5-19-88-REDWARE.jpg", id: 436 },
    { your_table_id: "478", filepath: "2021-5-14-118-CERAMIC_2.jpg", id: 437 },
    { your_table_id: "1228", filepath: "2021-6-7-75-GLASS_1.jpg", id: 438 },
    { your_table_id: "826", filepath: "2022-7-12-404-GLASS_3.jpg", id: 439 },
    { your_table_id: "733", filepath: "2022-7-5-331-A,B-CREAMWARE.jpg", id: 440 },
    { your_table_id: "846", filepath: "2022-7-5-331-A,B-CREAMWARE.jpg", id: 441 },
    { your_table_id: "537", filepath: "2022-6-6-567-EARTHENWARE_1.jpg", id: 442 },
    { your_table_id: "646", filepath: "2022-6-20-354-B,C,D,G-CREAMWARE.jpg", id: 443 },
    { your_table_id: "519", filepath: "2022-6-20-354-B,C,D,G-CREAMWARE.jpg", id: 444 },
    { your_table_id: "125", filepath: "2022-6-20-354-B,C,D,G-CREAMWARE.jpg", id: 445 },
    { your_table_id: "835", filepath: "2022-6-20-354-B,C,D,G-CREAMWARE.jpg", id: 446 },
    { your_table_id: "673", filepath: "2022-5-25-236-EARTHENWARE.jpg", id: 447 },
    { your_table_id: "146", filepath: "2022-7-21-313-A,B-GLASS_1.jpg", id: 448 },
    { your_table_id: "237", filepath: "2022-7-21-313-A,B-GLASS_1.jpg", id: 449 },
    { your_table_id: "794", filepath: "2022-7-22-419-EARTHENWARE.jpg", id: 450 },
    { your_table_id: "861", filepath: "2022-7-8-315-REDWARE.jpg", id: 451 },
    { your_table_id: "1074", filepath: "2022-7-28-460-A,B,C,D-GLASS_2.jpg", id: 452 },
    { your_table_id: "334", filepath: "2022-7-28-460-A,B,C,D-GLASS_2.jpg", id: 453 },
    { your_table_id: "1012", filepath: "2022-7-28-460-A,B,C,D-GLASS_2.jpg", id: 454 },
    { your_table_id: "1084", filepath: "2022-7-28-460-A,B,C,D-GLASS_2.jpg", id: 455 },
    { your_table_id: "308", filepath: "2022-8-4-475-A,B,C,D,E-GLASS.jpg", id: 456 },
    { your_table_id: "186", filepath: "2022-8-4-475-A,B,C,D,E-GLASS.jpg", id: 457 },
    { your_table_id: "424", filepath: "2022-8-4-475-A,B,C,D,E-GLASS.jpg", id: 458 },
    { your_table_id: "45", filepath: "2022-8-4-475-A,B,C,D,E-GLASS.jpg", id: 459 },
    { your_table_id: "373", filepath: "2022-8-4-475-A,B,C,D,E-GLASS.jpg", id: 460 },
    { your_table_id: "1241", filepath: "2022-7-14-508-D,J-PEARLWARE.jpg", id: 461 },
    { your_table_id: "1232", filepath: "2022-7-14-508-D,J-PEARLWARE.jpg", id: 462 },
    { your_table_id: "1061", filepath: "2021-6-1-4-RHENISHSTONEWARE_1.jpg", id: 463 },
    { your_table_id: "1235", filepath: "2022-7-5-442-REDWARE.jpg", id: 464 },
    { your_table_id: "89", filepath: "2022-7-8-310-D,E,F-EARTHENWARE_3.jpg", id: 465 },
    { your_table_id: "92", filepath: "2022-7-8-310-D,E,F-EARTHENWARE_3.jpg", id: 466 },
    { your_table_id: "1075", filepath: "2022-7-8-310-D,E,F-EARTHENWARE_3.jpg", id: 467 },
    { your_table_id: "484", filepath: "2022-5-23-200-EARTHENWARE_2.jpg", id: 468 },
    { your_table_id: "896", filepath: "2022-6-28-444-PORCELAIN.jpg", id: 469 },
    { your_table_id: "647", filepath: "2021-5-12-120-EARTHENWARE.jpg", id: 470 },
    { your_table_id: "950", filepath: "2022-7-27-456-CREAMWARE.jpg", id: 471 },
    { your_table_id: "510", filepath: "2022-7-7-349-A,B-EARTHENWARE.jpg", id: 472 },
    { your_table_id: "118", filepath: "2022-7-7-349-A,B-EARTHENWARE.jpg", id: 473 },
    { your_table_id: "349", filepath: "2022-7-11-314-A,B,C-PEARLWARE.jpg", id: 474 },
    { your_table_id: "1077", filepath: "2022-7-11-314-A,B,C-PEARLWARE.jpg", id: 475 },
    { your_table_id: "358", filepath: "2022-7-11-314-A,B,C-PEARLWARE.jpg", id: 476 },
    { your_table_id: "1103", filepath: "2021-6-7-23-BONE.jpg", id: 477 },
    { your_table_id: "1152", filepath: "2021-5-24-44-GLASS_1.jpg", id: 478 },
    { your_table_id: "1240", filepath: "2022-5-31-561-BONE.jpg", id: 479 },
    { your_table_id: "66", filepath: "2022-7-26-493-A,B-GLASS_1.jpg", id: 480 },
    { your_table_id: "52", filepath: "2022-7-26-493-A,B-GLASS_1.jpg", id: 481 },
    { your_table_id: "717", filepath: "2022-8-4-513-EARTHENWARE.jpg", id: 482 },
    { your_table_id: "163", filepath: "2021-10-9-521-EARTHENWARE_2.jpg", id: 483 },
    { your_table_id: "533", filepath: "2021-5-19-88-STONEWARE_2.jpg", id: 484 },
    { your_table_id: "1057", filepath: "2022-7-22-520-A,B,C-BONE_2.jpg", id: 485 },
    { your_table_id: "30", filepath: "2022-7-22-520-A,B,C-BONE_2.jpg", id: 486 },
    { your_table_id: "787", filepath: "2022-7-22-520-A,B,C-BONE_2.jpg", id: 487 },
    { your_table_id: "675", filepath: "2022-5-26-239-REDWARE.jpg", id: 488 },
    { your_table_id: "177", filepath: "2022-7-19-378-EARTHENWARE_1.jpg", id: 489 },
    { your_table_id: "1183", filepath: "2021-4-23-32-GLASS_1.jpg", id: 490 },
    { your_table_id: "577", filepath: "2022-6-10-283-PORCELAIN.jpg", id: 491 },
    { your_table_id: "1128", filepath: "2021-6-1-7-EARTHENWARE.jpg", id: 492 },
    { your_table_id: "1182", filepath: "2022-7-12-540-BONE_2.jpg", id: 493 },
    { your_table_id: "213", filepath: "2022-5-27-305-CREAMWARE.jpg", id: 494 },
    { your_table_id: "208", filepath: "2021-6-1-13-STONEWARE_1.jpg", id: 495 },
    { your_table_id: "1217", filepath: "2019-11-15-577-WHITEWARE_2.jpg", id: 496 },
    { your_table_id: "932", filepath: "2022-7-14-410-GLASS.jpg", id: 497 },
    { your_table_id: "94", filepath: "2022-5-27-259-EARTHENWARE_1.jpg", id: 498 },
    { your_table_id: "37", filepath: "2022-6-30-334-STONEWARE_1.jpg", id: 499 },
    { your_table_id: "151", filepath: "2022-7-12-376-GLASS.jpg", id: 500 },
    { your_table_id: "387", filepath: "2022-5-25-232-A,D,E,F,G-EARTHENWARE_2.jpg", id: 501 },
    { your_table_id: "40", filepath: "2022-5-25-232-A,D,E,F,G-EARTHENWARE_2.jpg", id: 502 },
    { your_table_id: "350", filepath: "2022-5-25-232-A,D,E,F,G-EARTHENWARE_2.jpg", id: 503 },
    { your_table_id: "833", filepath: "2022-5-25-232-A,D,E,F,G-EARTHENWARE_2.jpg", id: 504 },
    { your_table_id: "1151", filepath: "2022-5-25-232-A,D,E,F,G-EARTHENWARE_2.jpg", id: 505 },
    { your_table_id: "1169", filepath: "2022-7-22-485-PEARLWARE.jpg", id: 506 },
    { your_table_id: "209", filepath: "2021-5-18-20-BONE_2.jpg", id: 507 },
    { your_table_id: "51", filepath: "2022-8-4-474-A,B,C,D-GLASS_2.jpg", id: 508 },
    { your_table_id: "287", filepath: "2022-8-4-474-A,B,C,D-GLASS_2.jpg", id: 509 },
    { your_table_id: "54", filepath: "2022-8-4-474-A,B,C,D-GLASS_2.jpg", id: 510 },
    { your_table_id: "55", filepath: "2022-8-4-474-A,B,C,D-GLASS_2.jpg", id: 511 },
    { your_table_id: "818", filepath: "2022-7-28-425-B,C,D-CREAMWARE.jpg", id: 512 },
    { your_table_id: "798", filepath: "2022-7-28-425-B,C,D-CREAMWARE.jpg", id: 513 },
    { your_table_id: "442", filepath: "2022-7-28-425-B,C,D-CREAMWARE.jpg", id: 514 },
    { your_table_id: "698", filepath: "2022-7-28-430-GLASS.jpg", id: 515 },
    { your_table_id: "295", filepath: "2022-7-5-340-GLASS_1.jpg", id: 516 },
    { your_table_id: "231", filepath: "2022-5-24-198-EARTHENWARE_3.jpg", id: 517 },
    { your_table_id: "252", filepath: "2022-7-1-537-BONE_2.jpg", id: 518 },
    { your_table_id: "740", filepath: "2022-7-12-405-A,B-REDWARE.jpg", id: 519 },
    { your_table_id: "462", filepath: "2022-7-12-405-A,B-REDWARE.jpg", id: 520 },
    { your_table_id: "478", filepath: "2021-5-14-118-CERAMIC_1.jpg", id: 521 },
    { your_table_id: "231", filepath: "2022-5-24-198-EARTHENWARE_2.jpg", id: 522 },
    { your_table_id: "385", filepath: "2022-6-1-270-C,D,F,G-EARTHENWARE.jpg", id: 523 },
    { your_table_id: "619", filepath: "2022-6-1-270-C,D,F,G-EARTHENWARE.jpg", id: 524 },
    { your_table_id: "383", filepath: "2022-6-1-270-C,D,F,G-EARTHENWARE.jpg", id: 525 },
    { your_table_id: "50", filepath: "2022-6-1-270-C,D,F,G-EARTHENWARE.jpg", id: 526 },
    { your_table_id: "372", filepath: "2022-6-28-318-PEARLWARE.jpg", id: 527 },
    { your_table_id: "967", filepath: "2022-7-16-570-B,M-EARTHENWARE_2.jpg", id: 528 },
    { your_table_id: "736", filepath: "2022-7-16-570-B,M-EARTHENWARE_2.jpg", id: 529 },
    { your_table_id: "1188", filepath: "2022-7-14-508-B,C,E-WHITEWARE_1.jpg", id: 530 },
    { your_table_id: "1191", filepath: "2022-7-14-508-B,C,E-WHITEWARE_1.jpg", id: 531 },
    { your_table_id: "1242", filepath: "2022-7-14-508-B,C,E-WHITEWARE_1.jpg", id: 532 },
    { your_table_id: "1186", filepath: "2022-7-7-546-CREAMWARE.jpg", id: 533 },
    { your_table_id: "812", filepath: "2021-6-23-61-GLASS_1.jpg", id: 534 },
    { your_table_id: "900", filepath: "2021-6-1-190-REDWARE.jpg", id: 535 },
    { your_table_id: "1226", filepath: "2022-7-8-295-RHENISHSTONEWARE.jpg", id: 536 },
    { your_table_id: "860", filepath: "2022-7-22-483-A,B-EARTHENWARE.jpg", id: 537 },
    { your_table_id: "1231", filepath: "2022-7-22-483-A,B-EARTHENWARE.jpg", id: 538 },
    { your_table_id: "1148", filepath: "2021-6-1-189-CERAMIC.jpg", id: 539 },
    { your_table_id: "204", filepath: "2022-7-26-498-A,B-REDWARE.jpg", id: 540 },
    { your_table_id: "471", filepath: "2022-7-26-498-A,B-REDWARE.jpg", id: 541 },
    { your_table_id: "755", filepath: "2022-7-22-489-PEARLWARE.jpg", id: 542 },
    { your_table_id: "758", filepath: "2022-6-7-284-A,B-GLASS_1.jpg", id: 543 },
    { your_table_id: "999", filepath: "2022-6-7-284-A,B-GLASS_1.jpg", id: 544 },
    { your_table_id: "8", filepath: "2021-6-7-101-PEARLWARE.jpg", id: 545 },
    { your_table_id: "273", filepath: "2022-7-14-503-REDWARE.jpg", id: 546 },
    { your_table_id: "127", filepath: "2021-5-24-38-BONE_1.jpg", id: 547 },
    { your_table_id: "429", filepath: "2022-7-11-298-CREAMWARE.jpg", id: 548 },
    { your_table_id: "96", filepath: "2022-7-19-377-PORCELAIN.jpg", id: 549 },
    { your_table_id: "53", filepath: "2022-7-26-499-GLASS.jpg", id: 550 },
    { your_table_id: "1108", filepath: "2022-7-5-320-A,B-CREAMWARE.jpg", id: 551 },
    { your_table_id: "1115", filepath: "2022-7-5-320-A,B-CREAMWARE.jpg", id: 552 },
    { your_table_id: "790", filepath: "2022-7-27-510-PEARLWARE.jpg", id: 553 },
    { your_table_id: "1014", filepath: "2021-6-7-36-RHENISHSTONEWARE_1.jpg", id: 554 },
    { your_table_id: "320", filepath: "2022-6-30-319-A,B-GLASS.jpg", id: 555 },
    { your_table_id: "1040", filepath: "2022-6-30-319-A,B-GLASS.jpg", id: 556 },
    { your_table_id: "533", filepath: "2021-5-19-88-STONEWARE_1.jpg", id: 557 },
    { your_table_id: "324", filepath: "2022-6-18-263-A,B,C-RHENISHSTONEWARE_1.jpg", id: 558 },
    { your_table_id: "42", filepath: "2022-6-18-263-A,B,C-RHENISHSTONEWARE_1.jpg", id: 559 },
    { your_table_id: "139", filepath: "2022-6-18-263-A,B,C-RHENISHSTONEWARE_1.jpg", id: 560 },
    { your_table_id: "1", filepath: "2021-5-15-154-BONE_1.jpg", id: 561 },
    { your_table_id: "877", filepath: "2022-5-26-243-REDWARE_1.jpg", id: 562 },
    { your_table_id: "1248", filepath: "2021-6-2-137-EARTHENWARE_1.jpg", id: 563 },
    { your_table_id: "295", filepath: "2022-7-5-340-GLASS_2.jpg", id: 564 },
    { your_table_id: "985", filepath: "2022-7-28-458-A,B,C,D-PEARLWARE.jpg", id: 565 },
    { your_table_id: "986", filepath: "2022-7-28-458-A,B,C,D-PEARLWARE.jpg", id: 566 },
    { your_table_id: "942", filepath: "2022-7-28-458-A,B,C,D-PEARLWARE.jpg", id: 567 },
    { your_table_id: "300", filepath: "2022-7-28-458-A,B,C,D-PEARLWARE.jpg", id: 568 },
    { your_table_id: "97", filepath: "2022-7-7-548-A,B-GLASS.jpg", id: 569 },
    { your_table_id: "106", filepath: "2022-7-7-548-A,B-GLASS.jpg", id: 570 },
    { your_table_id: "916", filepath: "2021-6-2-179-CERAMIC_2.jpg", id: 571 },
    { your_table_id: "1239", filepath: "2022-6-30-448-A,B,C,D,E,F-GLASS_2.jpg", id: 572 },
    { your_table_id: "285", filepath: "2022-6-30-448-A,B,C,D,E,F-GLASS_2.jpg", id: 573 },
    { your_table_id: "338", filepath: "2022-6-30-448-A,B,C,D,E,F-GLASS_2.jpg", id: 574 },
    { your_table_id: "1008", filepath: "2022-6-30-448-A,B,C,D,E,F-GLASS_2.jpg", id: 575 },
    { your_table_id: "1145", filepath: "2022-6-30-448-A,B,C,D,E,F-GLASS_2.jpg", id: 576 },
    { your_table_id: "1009", filepath: "2022-6-30-448-A,B,C,D,E,F-GLASS_2.jpg", id: 577 },
    { your_table_id: "975", filepath: "2022-6-28-446-A,B,C-REDWARE.jpg", id: 578 },
    { your_table_id: "809", filepath: "2022-6-28-446-A,B,C-REDWARE.jpg", id: 579 },
    { your_table_id: "749", filepath: "2022-6-28-446-A,B,C-REDWARE.jpg", id: 580 },
    { your_table_id: "1144", filepath: "2022-7-19-312-B,C,E,F,G,H,I,J,K-CREAMWARE.jpg", id: 581 },
    { your_table_id: "410", filepath: "2022-7-19-312-B,C,E,F,G,H,I,J,K-CREAMWARE.jpg", id: 582 },
    { your_table_id: "256", filepath: "2022-7-19-312-B,C,E,F,G,H,I,J,K-CREAMWARE.jpg", id: 583 },
    { your_table_id: "1063", filepath: "2022-7-19-312-B,C,E,F,G,H,I,J,K-CREAMWARE.jpg", id: 584 },
    { your_table_id: "720", filepath: "2022-7-19-312-B,C,E,F,G,H,I,J,K-CREAMWARE.jpg", id: 585 },
    { your_table_id: "1087", filepath: "2022-7-19-312-B,C,E,F,G,H,I,J,K-CREAMWARE.jpg", id: 586 },
    { your_table_id: "1088", filepath: "2022-7-19-312-B,C,E,F,G,H,I,J,K-CREAMWARE.jpg", id: 587 },
    { your_table_id: "962", filepath: "2022-7-19-312-B,C,E,F,G,H,I,J,K-CREAMWARE.jpg", id: 588 },
    { your_table_id: "963", filepath: "2022-7-19-312-B,C,E,F,G,H,I,J,K-CREAMWARE.jpg", id: 589 },
    { your_table_id: "700", filepath: "2022-7-5-443-GLASS_1.jpg", id: 590 },
    { your_table_id: "670", filepath: "2022-6-30-449-REDWARE.jpg", id: 591 },
    { your_table_id: "1091", filepath: "2022-5-25-418-GLASS_2.jpg", id: 592 },
    { your_table_id: "557", filepath: "2022-7-8-374-REDWARE.jpg", id: 593 },
    { your_table_id: "178", filepath: "2022-7-21-394-A,B-GLASS_1.jpg", id: 594 },
    { your_table_id: "185", filepath: "2022-7-21-394-A,B-GLASS_1.jpg", id: 595 },
    { your_table_id: "1175", filepath: "2022-7-5-215-A,B-RHENISHSTONEWARE_1.jpg", id: 596 },
    { your_table_id: "1195", filepath: "2022-7-5-215-A,B-RHENISHSTONEWARE_1.jpg", id: 597 },
    { your_table_id: "360", filepath: "2022-7-28-462-GLASS_1.jpg", id: 598 },
    { your_table_id: "203", filepath: "2021-6-23-2-BONE_2.jpg", id: 599 },
    { your_table_id: "623", filepath: "2021-5-19-90-B-PEARLWARE.jpg", id: 600 },
    { your_table_id: "340", filepath: "2021-6-1-56-GLASS_2.jpg", id: 601 },
    { your_table_id: "430", filepath: "2022-7-22-520-D,E-BONE_2.jpg", id: 602 },
    { your_table_id: "293", filepath: "2022-7-22-520-D,E-BONE_2.jpg", id: 603 },
    { your_table_id: "41", filepath: "2021-5-12-171-PIPESTEM_2.jpg", id: 604 },
    { your_table_id: "1119", filepath: "2022-7-8-550-BONE.jpg", id: 605 },
    { your_table_id: "1137", filepath: "2022-6-20-354-A,E,F-PEARLWARE.jpg", id: 606 },
    { your_table_id: "1138", filepath: "2022-6-20-354-A,E,F-PEARLWARE.jpg", id: 607 },
    { your_table_id: "1139", filepath: "2022-6-20-354-A,E,F-PEARLWARE.jpg", id: 608 },
    { your_table_id: "208", filepath: "2021-6-1-13-STONEWARE_3.jpg", id: 609 },
    { your_table_id: "885", filepath: "2022-6-10-273-A,B-CREAMWARE.jpg", id: 610 },
    { your_table_id: "886", filepath: "2022-6-10-273-A,B-CREAMWARE.jpg", id: 611 },
    { your_table_id: "1182", filepath: "2022-7-12-540-BONE_1.jpg", id: 612 },
    { your_table_id: "576", filepath: "2022-7-22-424-B,C-EARTHENWARE.jpg", id: 613 },
    { your_table_id: "601", filepath: "2022-7-22-424-B,C-EARTHENWARE.jpg", id: 614 },
    { your_table_id: "879", filepath: "2022-5-24-217-PORCELAIN.jpg", id: 615 },
    { your_table_id: "1057", filepath: "2022-7-22-520-A,B,C-BONE_1.jpg", id: 616 },
    { your_table_id: "30", filepath: "2022-7-22-520-A,B,C-BONE_1.jpg", id: 617 },
    { your_table_id: "787", filepath: "2022-7-22-520-A,B,C-BONE_1.jpg", id: 618 },
    { your_table_id: "1199", filepath: "2021-4-21-74-GLASS_1.jpg", id: 619 },
    { your_table_id: "993", filepath: "2022-5-25-220-BONE.jpg", id: 620 },
    { your_table_id: "384", filepath: "2022-6-6-268-EARTHENWARE.jpg", id: 621 },
    { your_table_id: "814", filepath: "2022-7-7-351-A,B-PORCELAIN.jpg", id: 622 },
    { your_table_id: "356", filepath: "2022-7-7-351-A,B-PORCELAIN.jpg", id: 623 },
    { your_table_id: "977", filepath: "2022-7-5-543-CREAMWARE.jpg", id: 624 },
    { your_table_id: "414", filepath: "2022-7-21-395-A,B,C,D-EARTHENWARE.jpg", id: 625 },
    { your_table_id: "587", filepath: "2022-7-21-395-A,B,C,D-EARTHENWARE.jpg", id: 626 },
    { your_table_id: "176", filepath: "2022-7-21-395-A,B,C,D-EARTHENWARE.jpg", id: 627 },
    { your_table_id: "1154", filepath: "2022-7-21-395-A,B,C,D-EARTHENWARE.jpg", id: 628 },
    { your_table_id: "478", filepath: "2021-5-14-118-CERAMIC_3.jpg", id: 629 },
    { your_table_id: "1187", filepath: "2021-6-7-539-E,F-CREAMWARE.jpg", id: 630 },
    { your_table_id: "643", filepath: "2021-6-7-539-E,F-CREAMWARE.jpg", id: 631 },
    { your_table_id: "1194", filepath: "2021-5-19-50-EARTHENWARE_2.jpg", id: 632 },
    { your_table_id: "65", filepath: "2022-7-26-507-GLASS_1.jpg", id: 633 },
    { your_table_id: "949", filepath: "2022-6-1-531-A,B,C,D,E,F,G,H,I-REDWARE.jpg", id: 634 },
    { your_table_id: "254", filepath: "2022-6-1-531-A,B,C,D,E,F,G,H,I-REDWARE.jpg", id: 635 },
    { your_table_id: "978", filepath: "2022-6-1-531-A,B,C,D,E,F,G,H,I-REDWARE.jpg", id: 636 },
    { your_table_id: "709", filepath: "2022-6-1-531-A,B,C,D,E,F,G,H,I-REDWARE.jpg", id: 637 },
    { your_table_id: "636", filepath: "2022-6-1-531-A,B,C,D,E,F,G,H,I-REDWARE.jpg", id: 638 },
    { your_table_id: "750", filepath: "2022-6-1-531-A,B,C,D,E,F,G,H,I-REDWARE.jpg", id: 639 },
    { your_table_id: "1083", filepath: "2022-6-1-531-A,B,C,D,E,F,G,H,I-REDWARE.jpg", id: 640 },
    { your_table_id: "245", filepath: "2022-6-1-531-A,B,C,D,E,F,G,H,I-REDWARE.jpg", id: 641 },
    { your_table_id: "246", filepath: "2022-6-1-531-A,B,C,D,E,F,G,H,I-REDWARE.jpg", id: 642 },
    { your_table_id: "224", filepath: "2022-6-21-197-PIPESTEM.jpg", id: 643 },
    { your_table_id: "374", filepath: "2022-7-22-484-GLASS.jpg", id: 644 },
    { your_table_id: "275", filepath: "2022-5-31-529-A,B,C,D,E,F,G,H-REDWARE.jpg", id: 645 },
    { your_table_id: "140", filepath: "2022-5-31-529-A,B,C,D,E,F,G,H-REDWARE.jpg", id: 646 },
    { your_table_id: "768", filepath: "2022-5-31-529-A,B,C,D,E,F,G,H-REDWARE.jpg", id: 647 },
    { your_table_id: "251", filepath: "2022-5-31-529-A,B,C,D,E,F,G,H-REDWARE.jpg", id: 648 },
    { your_table_id: "1011", filepath: "2022-5-31-529-A,B,C,D,E,F,G,H-REDWARE.jpg", id: 649 },
    { your_table_id: "829", filepath: "2022-5-31-529-A,B,C,D,E,F,G,H-REDWARE.jpg", id: 650 },
    { your_table_id: "463", filepath: "2022-5-31-529-A,B,C,D,E,F,G,H-REDWARE.jpg", id: 651 },
    { your_table_id: "948", filepath: "2022-5-31-529-A,B,C,D,E,F,G,H-REDWARE.jpg", id: 652 },
    { your_table_id: "117", filepath: "2022-7-7-350-GLASS.jpg", id: 653 },
    { your_table_id: "1201", filepath: "2022-6-20-361-STONEWARE_2.jpg", id: 654 },
    { your_table_id: "364", filepath: "2022-6-9-575-PEARLWARE.jpg", id: 655 },
    { your_table_id: "659", filepath: "2022-7-26-492-A,B-CREAMWARE.jpg", id: 656 },
    { your_table_id: "1078", filepath: "2022-7-26-492-A,B-CREAMWARE.jpg", id: 657 },
    { your_table_id: "355", filepath: "2022-7-27-454-A,B-PEARLWARE.jpg", id: 658 },
    { your_table_id: "249", filepath: "2022-7-27-454-A,B-PEARLWARE.jpg", id: 659 },
    { your_table_id: "1239", filepath: "2022-6-30-448-A,B,C,D,E,F-GLASS_1.jpg", id: 660 },
    { your_table_id: "285", filepath: "2022-6-30-448-A,B,C,D,E,F-GLASS_1.jpg", id: 661 },
    { your_table_id: "338", filepath: "2022-6-30-448-A,B,C,D,E,F-GLASS_1.jpg", id: 662 },
    { your_table_id: "1008", filepath: "2022-6-30-448-A,B,C,D,E,F-GLASS_1.jpg", id: 663 },
    { your_table_id: "1145", filepath: "2022-6-30-448-A,B,C,D,E,F-GLASS_1.jpg", id: 664 },
    { your_table_id: "1009", filepath: "2022-6-30-448-A,B,C,D,E,F-GLASS_1.jpg", id: 665 },
    { your_table_id: "486", filepath: "2022-7-7-364-A,B,C-REDWARE.jpg", id: 666 },
    { your_table_id: "612", filepath: "2022-7-7-364-A,B,C-REDWARE.jpg", id: 667 },
    { your_table_id: "1073", filepath: "2022-7-7-364-A,B,C-REDWARE.jpg", id: 668 },
    { your_table_id: "407", filepath: "2021-5-19-48-RHENISHSTONEWARE_1.jpg", id: 669 },
    { your_table_id: "83", filepath: "2021-5-12-123-PIPESTEM.jpg", id: 670 },
    { your_table_id: "303", filepath: "2022-6-1-194-PIPESTEM.jpg", id: 671 },
  ];

  useEffect(() => {
    fetch(backend_url + "newport_artifacts/")
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        console.log("Newport data from backend:", data);
        const newportArtifacts = data.artifacts;
        const addressMap = {
          1: "Null",
          2: "RI; Portsmouth; 66 Freeborn Street",
          3: "Newport Spring Site; 48 Touro/Spring St. Newport; RI",
          4: "Butts Hill Fort; Portsmouth; RI",
        };

        const scannedMap = {
          1: "Yes",
          2: "No",
        };
        
        const organicMap = {
          1: "Organic",
          2: "Inorganic",
        };
        
        const materialMap = {
          1: "Animal Bone",
          2: "Ash",
          3:"Bone",
          4:"Brick",
          5:"Ceramic",
          6:"Pearlware; edged",
          7:"Ceramic; earthenware",
          8:"Charcoal",
          9:"China",
          10:"Chinese Hard Paste Porcelain",
          11:"Clay",
          12:"Clear Glass",
          13:"Coal",
          14:"Coarse Earthenware",
          15:"Creamware",
          16:"Earthenware",
          17:"Earthenware and Soft Paste Porcelain",
          18:"Embossed Edged Earthenware",
          19:"Expanded polystyrene (EPS)",
          20:"Glass",
          21:"Glazed earthenware",
          22:"Granite",
          23:"Greyware",
          24:"Iron",
          25:"Iron fragment",
          26:"Japanese Hard Paste Porcelain",
          27:"lead or pewter",
          28:"Majolica",
          29:"Metal",
          30:"Nut shell",
          31:"Pearlware",
          32:"Porcelain",
          33:"Possibly Lead",
          34:"Printed Underglaze Earthenware",
          35:"Printed Underglazed Earthenware",
          36:"Quartz",
          37:"Redware fragment",
          38:"Refined Earthenware",
          39:"Refined Earthenware and Flow Blue China",
          40:"Refined Earthenware and Printed Underglaze Earthenware",
          41:"Refined Earthenware; Printed Underglaze Earthenware",
          42:"Rhenish Stoneware",
          43:"Rock",
          44:"Salt-glazed Stoneware",
          45:"Salt-Glazed Stoneware",
          46:"Shell",
          47:"Soft Paste Porcelain",
          48:"Sponge Decorated Ware",
          49:"Stone",
          50:"STONEWARE",
          51:"Stoneware",
          52:"Stoneware (possible rhenish/salt glazed)",
          53:"Underglazed Painted Earthenware",
          54:"Unknown",
          55:"Very dark olive/Light black glass",
          56:"Walnut",
          57:"Whiledon Ware",
          58:"Wood",
          59:"Yellow Earthenware",
          60:"Yellowish olive green glass",
          61:"Unknown",
          62:"Pig",
          63:"Porcelin",
          64:"Lead",
          65:"Copper",
          66:"Metal; Iron",
          67:"Metal; Iron?",
          68:"Copper?"};
        
          if (Array.isArray(data.artifacts)) {
            const processedArtifacts = data.artifacts.map((artifact) => ({
              ...artifact,
              address: addressMap[artifact.address__countyorcity] || "Unknown",
              material: materialMap[artifact.material_of_manufacture] || "Unknown",
              year: artifact.date_excavated ? artifact.date_excavated.split("-")[0] : "Unknown",
              organic: organicMap[artifact.organic_inorganic] || "Unknown",
              scanned: scannedMap[artifact.scanned_3d] || "Unknown",
            }));
    
            const materialSet = new Set();
            const yearSet = new Set();
    
            processedArtifacts.forEach((artifact) => {
              materialSet.add(artifact.material);
              yearSet.add(artifact.year);
            });

        const materials = Array.from(materialSet).sort();
        const years = Array.from(yearSet).filter(year => year !== "2262").sort();

        setArtifacts(processedArtifacts)
        setMaterialOptions(materials);
        setYearOptions(years);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching artifacts:", error);
      });
  }, []);
  
  useEffect(() => {
    let filtered = [...artifacts];
    if (materialFilter !== "All") filtered = filtered.filter((a) => a.material === materialFilter);
    if (yearFilter !== "All") filtered = filtered.filter((a) => a.year === yearFilter);
    if (scannedFilter !== "All") filtered = filtered.filter((a) => a.scanned === scannedFilter);
    if (organicFilter !== "All") filtered = filtered.filter((a) => a.organic === organicFilter);
    setFilteredArtifacts(filtered);
    setCurrentPage(0);
  }, [artifacts, materialFilter, yearFilter, scannedFilter, organicFilter]);

  const startIndex = currentPage * artifactsPerPage;
  const displayedArtifacts = filteredArtifacts.slice(startIndex, startIndex + artifactsPerPage);

  return (
    <div className="artifact-page">
      <Header />
      <div className="artifact-list">
        <h2>Newport, RI Artifacts</h2>
        
        <div className="filters-container">
          <button className="toggle-filters-btn" onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? "Hide Filters ▲" : "Show Filters ▼"}
          </button>

          {showFilters && (
            <div className="filters">
              <label>
                3D Scanned:
                <select onChange={(e) => setScannedFilter(e.target.value)} value={scannedFilter}>
                  <option value="All">All</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </label>

              <label>
                Year Collected:
                <select onChange={(e) => setYearFilter(e.target.value)} value={yearFilter}>
                  <option value="All">All</option>
                  {yearOptions.map((year, index) => (
                    <option key={index} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Organic/Inorganic:
                <select onChange={(e) => setOrganicFilter(e.target.value)} value={organicFilter}>
                  <option value="All">All</option>
                  <option value="organic">Organic</option>
                  <option value="inorganic">Inorganic</option>
                </select>
              </label>

              <label>
                Material:
                <select onChange={(e) => setMaterialFilter(e.target.value)} value={materialFilter}>
                  <option value="All">All</option>
                  {materialOptions.map((mat, index) => (
                    <option key={index} value={mat}>
                      {mat}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </div>

        {loading ? (
          <p>Loading artifacts...</p>
        ) : (
          <div className="artifacts">
            {displayedArtifacts.length === 0 ? (
              <p>No artifacts match your filters.</p>
            ) : (
              displayedArtifacts.map((artifact, index) => {
                const globalIndex = startIndex + index;
                return (
                  <div key={globalIndex} className="artifact-item" onClick={() =>
                    setExpandedArtifactIndex(expandedArtifactIndex === globalIndex ? null : globalIndex)}>
                    <h3>{artifact.object_name}</h3>
                    <p>{artifact.object_description}</p>
                    {expandedArtifactIndex === globalIndex && (
                      <div className="artifact-details">
                        {artifact.address && (
                          <p><strong>Address:</strong> {artifact.address}</p>
                        )}
                        {artifact.material && (
                          <p><strong>Material:</strong> {artifact.material}</p>
                        )}
                        {artifact.year && (
                        <p>
                        <strong>Year Excavated:</strong>{" "}
                        {artifact.year === "2262" ? "No year found" : artifact.year}
                        </p>
                        )}
                        {artifact.organic && (
                          <p><strong>Organic/Inorganic:</strong> {artifact.organic}</p>
                        )}
                        {artifact.scanned && (
                          <p><strong>3D Scanned:</strong> {artifact.scanned}</p>
                        )}
                        {artifact.id && (() => {
  const imageEntry = imageMappings.find(entry => entry.your_table_id === String(artifact.id));
  const imageUrl = imageEntry ? `https://${process.env.DJANGO_ALLOWED_HOST_1}/${imageEntry.filepath}` : null;

  return (
    <p>
      <strong>Image:</strong>{" "}
      {imageUrl ? (
        <a href={imageUrl} target="_blank" rel="noopener noreferrer">
          View Image
        </a>
      ) : (
        "No image available"
      )}
    </p>
  );
})()}

                      </div>
                    )}
                  </div>
                );              
              })
            )}
          </div>
        )}

        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.floor(filteredArtifacts.length / artifactsPerPage))
              )
            }
            disabled={startIndex + artifactsPerPage >= filteredArtifacts.length}
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewportArtifacts;

