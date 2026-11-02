/* ============================================================
   SPORTSCI RESEARCH — 运动补剂循证中心
   数据为教学性摘编，参考 ISSN 立场声明与 IOC/AIS 补剂共识框架
   ============================================================ */
(function () {
  "use strict";

  var SUPPS = [
    /* ==================== A 级 · 强证据 ==================== */
    { name: "一水肌酸", grade: "A", group: "力量·爆发", dose: "3–5 g/d；冲击 0.3 g/kg/d × 5–7 d",
      mech: "提升肌内磷酸肌酸储备，加快 ATP 再合成", ref: "ISSN 2017 · Kreider 2017",
      note: "研究最充分的增效补剂；长期 3–5 g/d 安全性证据良好" },
    { name: "咖啡因", grade: "A", group: "耐力·神经", dose: "3–6 mg/kg，运动前 30–60 min",
      mech: "腺苷受体拮抗，降低主观用力感、提升警觉", ref: "ISSN 2021 · Guest 2021",
      note: ">9 mg/kg 不增效且副作用增加；长期使用者效应减弱" },
    { name: "β-丙氨酸", grade: "A", group: "高强度间歇", dose: "3.2–6.4 g/d 分次，持续 ≥4 周",
      mech: "提升肌肽浓度，增强 H⁺ 缓冲能力", ref: "ISSN 2015 · Trexler 2015",
      note: "1–4 min 高强度项目收益最明显；感觉异常无害" },
    { name: "硝酸盐（甜菜根汁）", grade: "A", group: "耐力", dose: "6–8 mmol NO₃⁻，运动前 2–3 h",
      mech: "NO 通路扩张血管，改善线粒体效率", ref: "Jones 2014 · ISSN 2021",
      note: "训练水平越低收益越大；抗菌漱口水削弱效应" },
    { name: "碳酸氢钠", grade: "A", group: "1–7 min 高强度", dose: "0.2–0.4 g/kg，运动前 60–150 min",
      mech: "细胞外缓冲，延缓运动性酸中毒", ref: "ISSN 2021 · Grgic 2021",
      note: "胃肠不适常见；分次随碳水服用可改善耐受" },
    { name: "乳清 / 酪蛋白", grade: "A", group: "增肌·保肌", dose: "1.6–2.2 g/kg/d；每餐 0.3 g/kg",
      mech: "提供必需氨基酸底物，刺激肌蛋白合成", ref: "Morton 2018 · ISSN 2017",
      note: "总量与分配优于剂型差异；睡前酪蛋白有益夜间合成" },
    { name: "亮氨酸", grade: "A", group: "增肌·合成信号", dose: "每餐 2–3 g 亮氨酸阈值",
      mech: "激活 mTOR/p70S6K 通路，触发肌蛋白合成", ref: "Witard 2014 · ISSN 2017",
      note: "完整蛋白通常已达标；仅在植物蛋白餐中不足时补足" },
    { name: "必需氨基酸 EAA", grade: "A", group: "增肌·训练中", dose: "10–15 g EAA（含 2–3 g 亮氨酸）",
      mech: "在能量不足时仍可维持 MPS 底物", ref: "Pasiakos 2019 · ISSN 2017",
      note: "不优于等量完整蛋白；仅用于不便进食的场景" },
    { name: "赛前碳水负荷", grade: "A", group: "耐力", dose: "1–4 g/kg，赛前 1–4 h",
      mech: "补充肝糖原与肌糖原，维持血糖稳定", ref: "ACSM 营养共识 2016",
      note: "时间越接近比赛，剂量与升糖指数越需个体化" },
    { name: "运动中碳水", grade: "A", group: "耐力 >60 min", dose: "30–90 g/h，多转运糖配比",
      mech: "维持血糖、延缓糖原耗竭", ref: "Jeukendrup 2014",
      note: "葡萄糖+果糖双通道可提高外源糖氧化上限" },
    { name: "补液与电解质", grade: "A", group: "热环境·长时间", dose: "丢失量 100–150%；钠 300–700 mg/L",
      mech: "维持血浆渗透压、体温调节与血容量", ref: "ACSM 2007 · Sawka 2007",
      note: "以体重变化估算出汗率；避免过量低钠饮水" },

    /* ==================== B 级 · 有前景 / 人群特异 ==================== */
    { name: "维生素 D", grade: "B", group: "骨健康·免疫", dose: "依据 25(OH)D 水平个体化",
      mech: "钙磷代谢与骨矿化，参与肌功能", ref: "ISSN 2021 · 内分泌学会 2011",
      note: "缺乏者补充有效，充足者额外补充无增效" },
    { name: "铁", grade: "B", group: "女性·耐力", dose: "依铁蛋白与转铁蛋白饱和度个体化",
      mech: "血红蛋白与肌红蛋白合成，氧运输", ref: "Sim 2019 · Nielsen 2018",
      note: "必须先筛查；盲目补铁有胃肠与氧化应激风险" },
    { name: "镁", grade: "B", group: "恢复·神经肌肉", dose: "300–450 mg/d 元素镁",
      mech: "300+ 酶反应辅酶，影响兴奋性与肌肉收缩", ref: "Kiecki 2021 · ISSN 2021",
      note: "缺乏者与高强度训练者可能受益；过量致腹泻" },
    { name: "锌", grade: "B", group: "免疫·内分泌", dose: "8–11 mg/d，不超过 40 mg/d",
      mech: "参与睾酮合成与免疫细胞功能", ref: "ISSN 2021 · Prasad 2013",
      note: "缺乏者补充有效；长期高剂量干扰铜吸收" },
    { name: "维生素 C", grade: "B", group: "胶原·免疫", dose: "与胶原合用 50 mg/次；一般 100–200 mg/d",
      mech: "胶原羟化必需辅酶，抗氧化", ref: "Shaw 2017 · ISSN 2021",
      note: "大剂量（>1 g）可能钝化训练适应，不推荐常规高剂量" },
    { name: "明胶 / 胶原 + 维 C", grade: "B", group: "结缔组织", dose: "15 g 明胶 + 50 mg 维 C，训练前 1 h",
      mech: "提供甘氨酸/脯氨酸底物，提升胶原合成标志物", ref: "Shaw 2017 · ISSN 2023",
      note: "生物标志物改善明确，临床损伤结局证据仍在积累" },
    { name: "Omega-3（EPA/DHA）", grade: "B", group: "恢复·神经肌肉", dose: "EPA+DHA 约 2 g/d",
      mech: "抗炎介质生成，膜流动性与神经肌肉功能", ref: "Da Boit 2017 · ISSN 2021",
      note: "老龄人群力量适应有增效信号；青年证据不一致" },
    { name: "HMB", grade: "B", group: "抗分解", dose: "3 g/d 分次",
      mech: "抑制肌蛋白分解，促进合成信号", ref: "Wilson 2013 · ISSN 2013",
      note: "情境特异：停训与能量缺口期可能有效，训练者证据弱" },
    { name: "甘油（高水合）", grade: "B", group: "热环境", dose: "1.0–1.2 g/kg 配大量水，提前 2–3 h",
      mech: "提高体液留存，扩大血容量", ref: "ISSN 2017 · van Rosendal 2010",
      note: "可能引起头痛与胃肠不适；需严格补水方案" },
    { name: "辅酶 Q10", grade: "B", group: "线粒体·心功能", dose: "100–200 mg/d",
      mech: "电子传递链载体，减少氧化应激", ref: "Alvarez 2021 · ISSN 2021",
      note: "他汀使用者与老年人群证据较强；年轻健康者效应有限" },
    { name: "L-瓜氨酸", grade: "B", group: "血流·泵感", dose: "6–8 g 苹果酸瓜氨酸，运动前 1 h",
      mech: "经精氨酸通路提升 NO，改善肌肉灌注", ref: "Trexler 2019 · ISSN 2021",
      note: "比直接补充精氨酸更能提升血浆精氨酸水平" },
    { name: "L-精氨酸", grade: "B", group: "NO·血流", dose: "3–6 g/d",
      mech: "NO 合成底物，扩张血管", ref: "ISSN 2017 · Sureda 2018",
      note: "口服生物利用度低；瓜氨酸通常更优" },
    { name: "牛磺酸", grade: "B", group: "耐力·神经", dose: "1–3 g，运动前",
      mech: "渗透调节、钙稳态与神经兴奋性调节", ref: "Galloway 2017 · ISSN 2021",
      note: "耐力与力量均有积极信号；安全窗口宽" },
    { name: "酪氨酸", grade: "B", group: "认知·冷/高应激", dose: "150–200 mg/kg，暴露前",
      mech: "儿茶酚胺前体，在应激/寒冷/睡眠剥夺时维持认知", ref: "ISSN 2021 · Deijen 1999",
      note: "仅在应激情境下有效；常规训练收益不明显" },
    { name: "茶氨酸", grade: "B", group: "神经·放松", dose: "200–400 mg",
      mech: "促进 α 脑波，与咖啡因协同提升专注", ref: "Haskell 2008 · Gómez-Serranillos 2019",
      note: "常与咖啡因联用抵消焦虑副作用" },
    { name: "褪黑素", grade: "B", group: "睡眠·时差", dose: "0.5–5 mg，睡前 30–60 min",
      mech: "调节昼夜节律，缩短入睡潜伏期", ref: "ISSN 2021 · Costello 2014",
      note: "时差与轮班场景证据较强；长期效应不明" },
    { name: "葡萄糖胺 + 软骨素", grade: "B", group: "关节", dose: "1500 mg 葡萄糖胺 + 1200 mg 软骨素/d",
      mech: "软骨基质合成底物，可能减缓退变", ref: "McAlindon 2014 · AIS 2021",
      note: "膝骨关节炎有一定证据；健康训练者预防作用证据弱" },
    { name: "透明质酸", grade: "B", group: "关节", dose: "80–240 mg/d",
      mech: "关节滑液与软骨基质成分", ref: "Lindley 2018 · AIS 2021",
      note: "口服生物利用度有争议；注射证据强于口服" },
    { name: "姜黄素", grade: "B", group: "抗炎", dose: "500–2000 mg/d（与胡椒碱联用）",
      mech: "抑制 NF-κB 等炎症通路", ref: "Daily 2016 · ISSN 2021",
      note: "单用生物利用度低；与胡椒碱或脂质体剂型增效" },
    { name: "槲皮素", grade: "B", group: "免疫·抗氧化", dose: "500–1000 mg/d",
      mech: "黄酮类抗氧化与免疫调节", ref: "Nieman 2009 · ISSN 2021",
      note: "大强度训练后上呼吸道感染风险有降低信号" },
    { name: "益生菌", grade: "B", group: "肠道·免疫", dose: "10⁹–10¹¹ CFU/d，多菌株",
      mech: "维持肠道屏障与免疫平衡", ref: "Shing 2016 · ISSN 2021",
      note: "菌株特异；可能减少训练期胃肠道不适" },
    { name: "维生素 K2", grade: "B", group: "骨·血管", dose: "45–180 μg/d",
      mech: "激活骨钙素，引导钙沉积入骨", ref: "Iwamoto 2013 · AIS 2021",
      note: "与维 D 协同；MK-7 形式生物利用度更高" },
    { name: "钙", grade: "B", group: "骨健康", dose: "1000–1200 mg/d（含膳食）",
      mech: "骨矿化与肌肉收缩信号", ref: "NIH 共识 · ISSN 2021",
      note: "膳食优先；补充剂需与维 D 协同，过量增加结石风险" },
    { name: "维生素 B12", grade: "B", group: "能量·素食者", dose: "2.4 μg/d，缺乏者更高",
      mech: "红细胞成熟与神经髓鞘合成", ref: "ISSN 2021 · ODS 2021",
      note: "素食者与老年人需重点关注；缺乏影响耐力与认知" },
    { name: "叶酸", grade: "B", group: "红细胞·女运动员", dose: "400 μg/d",
      mech: "DNA 合成与红细胞生成", ref: "ODS 2021 · ISSN 2021",
      note: "女运动员与能量缺口人群需关注；缺乏致巨幼贫" },
    { name: "甜菜碱（TMG）", grade: "B", group: "力量·甲基化", dose: "1.25–2.5 g/d",
      mech: "甲基供体，影响同型半胱氨酸与肌肉水合", ref: "Del Favero 2014 · ISSN 2021",
      note: "力量与肌肉量有小幅度增效信号" },
    { name: "L-肉碱 L-酒石酸盐", grade: "B", group: "恢复", dose: "2 g/d",
      mech: "影响肉碱代谢与恢复标志物", ref: "Spiering 2008 · ISSN 2021",
      note: "可能减轻 DOMS 与肌肉损伤标志物" },
    { name: "绿茶提取物（EGCG）", grade: "B", group: "代谢·抗氧化", dose: "400–800 mg EGCG/d",
      mech: "抑制儿茶酚-O-甲基转移酶，提升产热", ref: "Hursel 2011 · ISSN 2021",
      note: "与咖啡因协同；高剂量有肝毒性个案报告" },
    { name: "番茄红素", grade: "B", group: "抗氧化", dose: "10–15 mg/d",
      mech: "单线态氧清除，保护脂相", ref: "Rao 2007 · AIS 2021",
      note: "前列腺与心血管健康证据较多；运动表现证据有限" },
    { name: "虾青素", grade: "B", group: "抗氧化", dose: "4–12 mg/d",
      mech: "强效脂溶性抗氧化，穿越血脑与视网膜屏障", ref: "Guerin 2003 · AIS 2021",
      note: "可能减轻运动氧化应激；表现增效证据不充分" },
    { name: "叶黄素 / 玉米黄质", grade: "B", group: "视力", dose: "10 mg 叶黄素 + 2 mg 玉米黄质/d",
      mech: "黄斑色素，过滤蓝光", ref: "Loughrey 2014 · AIS 2021",
      note: "长时间屏幕暴露与户外强光项目可考虑" },
    { name: "螺旋藻", grade: "B", group: "营养密度", dose: "1–10 g/d",
      mech: "高蛋白、微量营养素与藻蓝蛋白", ref: "Alonso 2018 · AIS 2021",
      note: "优质植物蛋白来源；纯素食者可用" },
    { name: "牛初乳", grade: "B", group: "免疫·肠道", dose: "20–60 g/d",
      mech: "含生长因子与免疫球蛋白，维护肠道屏障", ref: "Shing 2014 · ISSN 2021",
      note: "高强度训练期胃肠道与免疫有积极信号" },
    { name: "乳铁蛋白", grade: "B", group: "免疫·铁代谢", dose: "100–400 mg/d",
      mech: "铁螯合与抗菌，调节免疫", ref: "Lonnerdal 2003 · AIS 2021",
      note: "可能减轻上呼吸道感染；证据仍在积累" },
    { name: "红景天", grade: "B", group: "适应原", dose: "200–600 mg（3% 红景天苷）",
      mech: "调节 HPA 轴，提升耐力与认知", ref: "Hung 2011 · ISSN 2021",
      note: "耐力表现与疲劳减轻有积极信号" },
    { name: "南非醉茄", grade: "B", group: "压力·恢复", dose: "300–600 mg/d（KSM-66）",
      mech: "降低皮质醇，改善恢复与睡眠", ref: "Lopresti 2019 · ISSN 2021",
      note: "高压力训练者证据较强；可能影响甲状腺" },
    { name: "高丽参", grade: "B", group: "适应原", dose: "1–2 g/d 或 200–400 mg 提取物",
      mech: "人参皂苷调节神经与代谢", ref: "Cooper 2013 · ISSN 2021",
      note: "耐力与认知有一定证据；个体差异大" },
    { name: "D-核糖", grade: "B", group: "能量·心肌", dose: "5–15 g/d 分次",
      mech: "核苷酸合成底物，加速 ATP 再合成", ref: "Peveler 2017 · ISSN 2021",
      note: "心脏病与特定人群证据较强；健康者有限" },
    { name: "磷脂酰丝氨酸", grade: "B", group: "认知·压力", dose: "200–400 mg/d",
      mech: "神经细胞膜成分，影响皮质醇反应", ref: "Starks 2008 · ISSN 2021",
      note: "可能降低运动诱导的皮质醇升高" },

    /* ==================== C 级 · 证据不足 / 不推荐常规 ==================== */
    { name: "酸樱桃汁", grade: "C", group: "恢复", dose: "浓缩汁 30 ml × 2/d",
      mech: "多酚抗炎与抗氧化，可能减轻 DOMS", ref: "Bell 2014 · Coelho 2021",
      note: "效应方向积极但幅度有限，密集赛程期可尝试" },
    { name: "BCAA", grade: "C", group: "增肌", dose: "5–10 g，训练前后",
      mech: "支链氨基酸底物，理论上减少分解", ref: "ISSN 2017 · Wolfe 2017",
      note: "在总蛋白充足时无额外增效；不优于完整蛋白" },
    { name: "谷氨酰胺", grade: "C", group: "免疫·恢复", dose: "—",
      mech: "肠道与免疫细胞底物", ref: "ISSN 2017 · Gleeson 2008",
      note: "健康训练者运动表现与免疫结局证据不足" },
    { name: "促睾类复合物（DAA/蒺藜等）", grade: "C", group: "—", dose: "—",
      mech: "市场宣称提升内源睾酮", ref: "IOC 2018 共识",
      note: "缺乏可靠增效证据；部分产品含未标注成分" },
    { name: "左旋肉碱", grade: "C", group: "减脂", dose: "—",
      mech: "脂肪酸转运载体，理论促进氧化", ref: "ISSN 2017 · Brass 2000",
      note: "健康人群减脂结局无一致获益" },
    { name: "乙酰左旋肉碱", grade: "C", group: "认知", dose: "—",
      mech: "穿越血脑屏障的肉碱形式", ref: "ISSN 2017 · Malaguarnera 2004",
      note: "健康人群认知与运动表现证据不足" },
    { name: "CLA（共轭亚油酸）", grade: "C", group: "减脂", dose: "—",
      mech: "改变体脂分布与脂代谢", ref: "ISSN 2017 · Benjamin 2009",
      note: "Meta 分析效应量极小，长期安全性不明" },
    { name: "薄荷 / 辣椒素类", grade: "C", group: "—", dose: "—",
      mech: "感觉神经刺激与产热宣称", ref: "AIS 2021 分类",
      note: "对运动表现与代谢的效应未被高质量试验证实" },
    { name: "大剂量抗氧化剂（维 C/E）", grade: "C", group: "恢复", dose: "—",
      mech: "清除自由基，理论减少氧化损伤", ref: "ISSN 2017 · Merry 2016",
      note: "大剂量可能钝化训练适应信号，不推荐常规高剂量" },
    { name: "碱性水 / 离子水", grade: "C", group: "—", dose: "—",
      mech: "宣称改善酸碱平衡", ref: "AIS 2021 分类",
      note: "与碳酸氢钠的缓冲效应不可等同，证据有限" },
    { name: "维生素 E", grade: "C", group: "抗氧化", dose: "—",
      mech: "脂溶性抗氧化", ref: "ISSN 2017 · Sen 2001",
      note: "高剂量可能钝化适应且增加出血风险" },
    { name: "丙酮酸肌酸 / 肌酸乙酯 / 盐酸肌酸", grade: "C", group: "力量", dose: "—",
      mech: "宣称替代一水肌酸", ref: "ISSN 2017 · Spillane 2009",
      note: "不优于一水肌酸，且稳定性与生物利用度更差" },
    { name: "GABA", grade: "C", group: "放松·睡眠", dose: "—",
      mech: "抑制性神经递质", ref: "AIS 2021 · Abdou 2006",
      note: "口服难以有效穿越血脑屏障，效应有限" },
    { name: "育亨宾", grade: "C", group: "减脂", dose: "—",
      mech: "α2 受体拮抗，增加脂肪动员", ref: "AIS 2021 · Stone 2016",
      note: "焦虑、心悸与血压升高风险，个体差异大" },
    { name: "辛弗林 / 苦橙提取物", grade: "C", group: "减脂", dose: "—",
      mech: "拟交感作用，增加能耗", ref: "AIS 2021 · Stohs 2011",
      note: "与咖啡因联用心血管风险升高；部分联赛可能受限" },
    { name: "黄芪", grade: "C", group: "免疫", dose: "—",
      mech: "多糖与黄酮类免疫调节", ref: "AIS 2021 · 传统中医应用",
      note: "运动场景高质量证据缺乏" },
    { name: "冬虫夏草", grade: "C", group: "耐力", dose: "—",
      mech: "虫草素与多糖，可能影响氧利用", ref: "AIS 2021 · Nagai 2007",
      note: "部分试验显示耐力提升，但多为小样本低质量" },
    { name: "灵芝", grade: "C", group: "免疫", dose: "—",
      mech: "多糖与三萜类", ref: "AIS 2021 · 传统应用",
      note: "免疫与疲劳证据弱，运动表现未证实" },
    { name: "小球藻", grade: "C", group: "营养密度", dose: "—",
      mech: "高蛋白与微量营养素", ref: "AIS 2021 · 自行使用",
      note: "营养补充价值有限，运动增效证据缺乏" },
    { name: "小麦草", grade: "C", group: "—", dose: "—",
      mech: "叶绿素与酶类宣称", ref: "AIS 2021 分类",
      note: "缺乏人体运动表现证据" },
    { name: "苹果醋", grade: "C", group: "代谢", dose: "—",
      mech: "乙酸影响血糖与脂肪代谢", ref: "AIS 2021 · Johnston 2009",
      note: "血糖小幅改善；减重与运动表现证据不足" },
    { name: "椰子油", grade: "C", group: "—", dose: "—",
      mech: "中链脂肪酸理论上快速供能", ref: "AIS 2021 · 自行使用",
      note: "对耐力与减脂的增效证据不一致" },
    { name: "植物甾醇", grade: "C", group: "血脂", dose: "—",
      mech: "竞争肠道胆固醇吸收", ref: "AIS 2021 · 自行使用",
      note: "降 LDL 证据明确，与运动表现无关" },
    { name: "越橘 / 蓝莓提取物", grade: "C", group: "视力·抗氧化", dose: "—",
      mech: "花青素抗氧化", ref: "AIS 2021 · 自行使用",
      note: "视力与运动表现证据有限" },
    { name: "沙棘油 / 玫瑰果", grade: "C", group: "—", dose: "—",
      mech: "高维生素 C 与多酚", ref: "AIS 2021 · 自行使用",
      note: "营养补充价值，运动表现证据缺乏" },
    { name: "黑种草籽油", grade: "C", group: "—", dose: "—",
      mech: "百里醌抗炎宣称", ref: "AIS 2021 · 自行使用",
      note: "运动表现证据缺乏" },
    { name: "月见草油 / 琉璃苣油", grade: "C", group: "—", dose: "—",
      mech: "GLA 前体", ref: "AIS 2021 · 自行使用",
      note: "炎症与经前期综合征证据弱，运动无关" },
    { name: "南瓜籽油", grade: "C", group: "—", dose: "—",
      mech: "植物甾醇与锌", ref: "AIS 2021 · 自行使用",
      note: "前列腺健康弱证据，运动无关" },
    { name: "松花粉 / 蜂花粉", grade: "C", group: "—", dose: "—",
      mech: "混合微量营养素宣称", ref: "AIS 2021 · 自行使用",
      note: "过敏风险；运动表现证据缺乏" },
    { name: "蜂王浆 / 蜂胶", grade: "C", group: "免疫", dose: "—",
      mech: "多肽与黄酮类", ref: "AIS 2021 · 自行使用",
      note: "免疫与疲劳证据弱，过敏风险存在" }
  ];

  var GRADE_TEXT = {
    A: "多项高质量 RCT 或 Meta 分析支持在特定情境下提升运动表现，且安全性证据可接受。",
    B: "有前景但证据不一致、效应量小或仅限特定人群/情境，需要个体化试用与记录。",
    C: "证据不足或仅存在于机制推演与低质量试验，不建议作为常规策略。"
  };

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  var filter = "all";

  function renderTable() {
    var body = $("sp-body");
    if (!body) return;
    var list = SUPPS.filter(function (s) { return filter === "all" || s.grade === filter; });
    body.innerHTML = list.map(function (s) {
      return "<tr>" +
        '<td><span class="t-title">' + esc(s.name) + "</span>" +
        '<div class="tiny" style="margin-top:4px">' + esc(s.group) + " · " + esc(s.ref) + "</div></td>" +
        "<td>" + esc(s.mech) + "</td>" +
        "<td>" + esc(s.dose) + (s.note ? '<div class="tiny" style="margin-top:4px">' + esc(s.note) + "</div>" : "") + "</td>" +
        '<td><span class="badge badge-' + s.grade.toLowerCase() + '">' + s.grade + "</span></td>" +
      "</tr>";
    }).join("");
    $("sp-hit").textContent = list.length;
    $("sp-total").textContent = SUPPS.length;
    $("sp-count").textContent = SUPPS.length;
    $("sp-a").textContent = SUPPS.filter(function (s) { return s.grade === "A"; }).length;
  }

  function renderChips() {
    var box = $("sp-chips");
    if (!box) return;
    var opts = [{ id: "all", label: "全部" }, { id: "A", label: "A 级" }, { id: "B", label: "B 级" }, { id: "C", label: "C 级" }];
    box.innerHTML = opts.map(function (o) {
      return '<button class="chip' + (filter === o.id ? " active" : "") + '" data-grade="' + o.id + '">' + o.label + "</button>";
    }).join("");
    Array.prototype.forEach.call(box.querySelectorAll(".chip"), function (btn) {
      btn.addEventListener("click", function () {
        filter = btn.getAttribute("data-grade");
        renderChips();
        renderTable();
      });
    });
  }

  function renderGrades() {
    var box = $("sp-grade-grid");
    if (!box) return;
    var tones = { A: "tone-a", B: "tone-b", C: "tone-d" };
    box.innerHTML = ["A", "B", "C"].map(function (g, i) {
      var items = SUPPS.filter(function (s) { return s.grade === g; });
      return '<div class="card ' + tones[g] + ' sp-grade-card">' +
        '<div class="mod-num">GRADE ' + g + "</div>" +
        '<div class="panel-title">' + items.length + " 种补剂</div>" +
        '<p class="panel-sub mt-8">' + esc(GRADE_TEXT[g]) + "</p>" +
        '<ul class="sub-list">' + items.map(function (s) { return "<li>" + esc(s.name) + "</li>"; }).join("") + "</ul>" +
      "</div>";
    }).join("");
  }

  function doseItem(label, value, note) {
    return '<div class="card sp-dose-item tone-b"><div class="dl">' + label + '</div>' +
      '<div class="dv">' + value + '</div><div class="dn">' + note + "</div></div>";
  }

  function calc() {
    var bwEl = $("sp-bw");
    if (!bwEl) return;
    var bw = +bwEl.value;
    var sport = $("sp-sport").value;
    var caff = $("sp-caff").value;
    $("sp-bw-view").textContent = bw;
    $("sp-bw-val").textContent = bw + " kg";

    var proteinLo = 1.4, proteinHi = 1.8;
    if (sport === "strength") { proteinLo = 1.6; proteinHi = 2.2; }
    else if (sport === "fatloss") { proteinLo = 1.8; proteinHi = 2.4; }
    else if (sport === "interval") { proteinLo = 1.6; proteinHi = 2.0; }

    var caffDose = caff === "low" ? 3 : (caff === "mid" ? 4.5 : 2);
    var caffMg = Math.round(bw * caffDose);

    var choH = sport === "endurance" ? "60–90 g/h" : (sport === "interval" ? "30–60 g/h" : "30–45 g/h");
    var choNote = sport === "strength" || sport === "fatloss"
      ? "以训练后 1–2 h 内的糖原恢复为主"
      : "持续 >60 min 时按小时分次补充，多转运糖更佳";

    $("sp-out").innerHTML = [
      doseItem("蛋白质 · 每日总量", Math.round(bw * proteinLo) + "–" + Math.round(bw * proteinHi) + " g/d", "约 " + proteinLo + "–" + proteinHi + " g/kg/d；分 3–5 餐，每餐 " + Math.round(bw * 0.3) + " g 左右"),
      doseItem("一水肌酸 · 维持量", "3–5 g/d", "任意时间随餐；如需冲击：" + Math.round(bw * 0.3) + " g/d × 5–7 天"),
      doseItem("咖啡因 · 急性增效", caffMg + " mg", "≈ " + caffDose + " mg/kg，运动前 30–60 min；上限参考 6 mg/kg = " + Math.round(bw * 6) + " mg"),
      doseItem("β-丙氨酸 · 长期负荷", "3.2–6.4 g/d", sport === "interval" ? "分 2–4 次，持续 ≥4 周，本训练类型收益最高" : "若训练以 1–4 min 高强度为主可考虑，否则优先级低"),
      doseItem("硝酸盐 · 耐力", "6–8 mmol", "≈2 份甜菜根浓缩汁，运动前 2–3 h；训练水平低者收益更明显"),
      doseItem("碳水 · 运动中", choH, choNote),
      doseItem("补液 · 每小时", "400–800 ml", "按出汗率调整；热环境可加至 1000 ml/h，钠 300–700 mg/L"),
      doseItem("训练后恢复", Math.round(bw * 0.3) + " g 蛋白 + " + Math.round(bw * 1.0) + " g 碳水", "0–2 h 内完成；全天总能量与总蛋白比单次窗口更重要")
    ].join("");

    var sum = "体重 " + bw + " kg · " + ({ strength: "力量/增肌", endurance: "耐力", interval: "高强度间歇/团队", fatloss: "减脂/能量缺口" }[sport]) +
      "：蛋白 " + Math.round(bw * proteinLo) + "–" + Math.round(bw * proteinHi) + " g/d，肌酸 3–5 g/d，咖啡因约 " + caffMg +
      " mg。以上为常用循证区间，非处方建议。";
    $("sp-sum").textContent = sum;
  }

  function bindTabs() {
    var bar = $("sp-tabs");
    if (!bar) return;
    Array.prototype.forEach.call(bar.querySelectorAll(".tab"), function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(bar.querySelectorAll(".tab"), function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var pane = btn.getAttribute("data-pane");
        Array.prototype.forEach.call(document.querySelectorAll(".sp-pane"), function (p) { p.classList.remove("active"); });
        var target = $("sp-" + pane);
        if (target) target.classList.add("active");
        if (pane === "dose") calc();
        if (pane === "grade") renderGrades();
      });
    });
  }

  function init() {
    if (!$("sp-body")) return;
    renderChips();
    renderTable();
    bindTabs();
    ["sp-bw", "sp-sport", "sp-caff"].forEach(function (id) {
      var el = $(id);
      if (el) el.addEventListener("input", calc);
      if (el && el.tagName === "SELECT") el.addEventListener("change", calc);
    });
    calc();
    renderGrades();
  }

  window.SPORTSCI_SUPPLEMENTS = { init: init, data: SUPPS };
})();
