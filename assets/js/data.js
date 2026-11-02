/* ============================================================
   SPORTSCI RESEARCH — 全域运动科学证据数据集
   全部条目为公开发表的真实文献 / 指南 / 经典教材
   schema: { id, lib, track, sub, title, authors, year, journal,
             type, grade, tags[], key, pop }
   lib:    cardio | muscle | posture | rehab | nutrition | methods
   track:  physio | biomech | rehab | nutrition | methods
   type:   meta | rct | cohort | review | narrative | position
           | consensus | book | methods | case
   grade:  A(高) | B(中) | C(低) | D(极低/教学)
   ============================================================ */
(function () {
  "use strict";

  var LIBRARIES = [
    { id: "cardio",    name: "心肺生理证据库",       en: "Cardiopulmonary Physiology",      desc: "耐力表现决定因素、间歇训练、摄氧动力学、呼吸肌、疲劳监控与负荷建模" },
    { id: "muscle",    name: "骨骼肌适应证据库",     en: "Skeletal Muscle Adaptation",      desc: "肌肥大与力量的剂量-反应、容量/频率/负荷/力竭程度、分子信号与同期化效应" },
    { id: "posture",   name: "体态与胸廓生物力学库", en: "Posture & Thoracic Biomechanics", desc: "体态评估、胸廓呼吸力学、膈肌姿势功能、脊柱稳定、肩胛动力与动作模式筛查" },
    { id: "rehab",     name: "运动损伤康复循证库",   en: "Injury & Rehabilitation",         desc: "负荷-损伤关系、重返运动标准、肌腱病、拉伤预防、流行病学与病因模型" },
    { id: "nutrition", name: "运动代谢与营养证据库", en: "Metabolism & Sports Nutrition",   desc: "蛋白质/碳水策略、脱水与补液、乳酸穿梭、脂肪氧化、共识立场声明" },
    { id: "suppl",     name: "运动补剂循证库",       en: "Ergogenic Aids & Supplements",    desc: "肌酸、咖啡因、β-丙氨酸、硝酸盐、碳酸氢钠等增效补剂的 Meta 证据与 IOC/ISSN 立场" },
    { id: "health",    name: "健康与运动医学证据库", en: "Health & Sports Medicine",        desc: "运动处方指南、体适能与全因死亡、能量可用性、睡眠恢复、赛前心脏筛查与特殊人群" },
    { id: "methods",   name: "科研方法学证据库",     en: "Research Methodology",            desc: "Meta 分析、证据分级、偏倚风险工具、报告规范与体育统计推断" }
  ];

  var TRACKS = [
    { id: "physio",    name: "运动生理学",     en: "Exercise Physiology" },
    { id: "biomech",   name: "运动生物力学",   en: "Sports Biomechanics" },
    { id: "rehab",     name: "运动康复与损伤", en: "Rehabilitation & Injury" },
    { id: "nutrition", name: "运动营养与代谢", en: "Nutrition & Metabolism" },
    { id: "health",    name: "健康与运动医学", en: "Health & Sports Medicine" },
    { id: "methods",   name: "科研方法学",     en: "Methodology" }
  ];

  var TYPES = {
    meta:      "Meta 分析",
    rct:       "随机对照试验",
    cohort:    "队列/观察研究",
    review:    "系统/叙述综述",
    narrative: "观点/叙事综述",
    position:  "立场声明",
    consensus: "专家共识",
    book:      "经典教材",
    methods:   "方法学文献",
    case:      "病例系列"
  };

  /* lib, track, sub, title, authors, year, journal, type, grade, tags, key, pop */
  var E = [
    /* ================= 心肺生理 ================= */
    ["cardio","physio","耐力表现","Training to enhance the physiological determinants of long-distance running performance: can valid recommendations be given to runners and coaches based on current scientific knowledge?","Midgley AW, McNaughton LR, Jones AM",2007,"Sports Med","review","B",["耐力","VO2max","乳酸阈"],"系统梳理耐力表现的三大生理决定因素：最大摄氧量、乳酸阈与跑步经济性，为训练处方提供循证框架。",96],
    ["cardio","physio","间歇训练","High-intensity interval training, solutions to the programming puzzle: Part I cardiopulmonary emphasis","Buchheit M, Laursen PB",2013,"Sports Med","review","B",["HIIT","处方","心肺"],"HIIT 编程的里程碑式综述，提出以心肺刺激为目标的可操作化编程变量体系。",97],
    ["cardio","physio","间歇训练","The scientific basis for high-intensity interval training: optimising training programmes and maximising performance in highly trained endurance athletes","Laursen PB, Jenkins DG",2002,"Sports Med","review","B",["HIIT","耐力","训练适应"],"早期系统阐述 HIIT 提升耐力表现机制的经典综述，奠定现代间歇训练科学基础。",90],
    ["cardio","physio","间歇训练","Effectiveness of high-intensity interval training (HIT) and continuous endurance training for VO2max improvements: a systematic review and meta-analysis of controlled trials","Milanović Z, Sporiš G, Weston M",2015,"Sports Med","meta","A",["HIIT","VO2max","Meta"],"HIIT 与传统持续训练提升 VO2max 的 Meta 分析：HIIT 在青年人群中等效甚至更优。",93],
    ["cardio","physio","间歇训练","Physiological adaptations to low-volume, high-intensity interval training in health and disease","Gibala MJ, Little JP, MacDonald MJ, Hawley JA",2012,"J Physiol","review","B",["HIIT","低容量","分子适应"],"低容量 HIIT 可诱导接近传统耐力训练的骨骼肌氧化与心肺适应，挑战「量」的传统认知。",91],
    ["cardio","physio","疲劳监控","Monitoring training load to understand fatigue in athletes","Halson SL",2014,"Sports Med","review","B",["负荷监控","疲劳","sRPE"],"训练负荷内外部指标的权威综述，为疲劳管理与个体化监控建立概念框架。",94],
    ["cardio","physio","负荷建模","A systems model of training for athletic performance","Banister EW, Calvert TW, Savage MV, Bach T",1975,"Aust J Sports Med","methods","B",["冲量-反应","建模","TRIMP"],"fitness-fatigue 双系统冲量-反应模型的奠基之作，至今仍是训练负荷建模的理论源头。",88],
    ["cardio","physio","耐力表现","The effect of endurance training on parameters of aerobic fitness","Jones AM, Carter H",2000,"Sports Med","review","B",["耐力训练","有氧适应","经济性"],"系统总结耐力训练对 VO2max、阈强度与运动经济性影响的经典综述。",82],
    ["cardio","physio","耐力表现","Endurance exercise performance: the physiology of champions","Joyner MJ, Coyle EF",2008,"J Physiol","review","B",["精英耐力","生理学","表现模型"],"以顶尖运动员为例解析耐力表现的整合生理模型：高 VO2max × 高阈强度 × 高经济性。",87],
    ["cardio","physio","耐力表现","VO2max: what do we know, and what do we still need to know?","Levine BD",2008,"J Physiol","review","B",["VO2max","氧运输","中枢限制"],"从氧运输瀑布视角检讨 VO2max 的中枢与外周限制因素，指出尚未解决的科学问题。",85],
    ["cardio","physio","训练强度分布","What is best practice for training intensity and duration distribution in endurance athletes?","Seiler S",2010,"Int J Sports Physiol Perform","review","B",["极化训练","80/20","强度分布"],"提出并论证耐力项目「80/20」与极化强度分布的实践证据，深刻影响现代耐力训练组织。",89],
    ["cardio","physio","摄氧动力学","Oxygen uptake kinetics","Poole DC, Jones AM",2012,"Compr Physiol","review","B",["VO2 kinetics","肺动力学"],"摄氧动力学的权威教科书级综述：限速步骤、慢成分与训练对动力学的塑造。",84],
    ["cardio","physio","呼吸肌","Exercise-induced respiratory muscle fatigue: implications for performance","Romer LM, Polkey MI",2008,"J Appl Physiol","review","B",["呼吸肌疲劳","运动表现"],"呼吸肌疲劳通过代谢反射削弱运动表现的机制综述，支撑呼吸肌训练的应用逻辑。",86],
    ["cardio","physio","呼吸肌","Respiratory muscle training in healthy humans: resolving the controversy","McConnell AK, Romer LM",2004,"Int J Sports Med","review","B",["吸气肌训练","争议"],"系统评估吸气肌训练对健康人运动表现影响的证据与争议，澄清研究设计要点。",80],
    ["cardio","physio","呼吸肌","Effects of respiratory muscle training on performance in athletes: a systematic review with meta-analyses","HajGhanbari B, Yamabayashi C, Buna TR, et al.",2013,"J Strength Cond Res","meta","A",["呼吸肌训练","Meta"],"呼吸肌训练提升运动员耐力表现的 Meta 分析证据，效应量中等但方向一致。",83],
    ["cardio","physio","间歇训练","Interval training for performance: a scientific and empirical practice. Special recommendations for middle- and long-distance running. Part I: aerobic interval training","Billat VL",2001,"Sports Med","review","B",["间歇","中长跑","vVO2max"],"以 vVO2max 为锚点的有氧间歇处方经典综述，连接实验室指标与训练场实践。",81],
    ["cardio","physio","间歇训练","Effects of low-volume high-intensity interval training (HIT) on fitness in adults: a meta-analysis of controlled and non-controlled trials","Weston M, Taylor KL, Batterham AM, Hopkins WG",2014,"Br J Sports Med","meta","A",["HIIT","Meta","体适能"],"低容量 HIIT 改善成人心肺适能的 Meta 分析，为大众健身场景的 HIIT 提供证据。",82],
    ["cardio","physio","间歇训练","Aerobic high-intensity intervals improve VO2max more than moderate training","Helgerud J, Høydal K, Wang E, et al.",2007,"Med Sci Sports Exerc","rct","B",["4×4","VO2max","RCT"],"经典 4×4 分钟间歇 RCT：高强度间歇较等能中强度持续训练带来更大 VO2max 提升。",85],
    ["cardio","physio","停训与复训","Detraining: loss of training-induced physiological and performance adaptations. Part I: short term insufficient training stimulus","Mujika I, Padilla S",2000,"Sports Med","review","B",["停训","减量","适应消退"],"系统总结短期停训/减量期间心肺与代谢适应的消退时程，为赛季规划提供依据。",79],
    ["cardio","physio","负荷监控","A new approach to monitoring exercise training","Foster C, Florhaug JA, Franklin J, et al.",2001,"J Strength Cond Res","methods","B",["sRPE","负荷量化","监控"],"提出 session-RPE 负荷量化法，使内部负荷监控成为低成本、高实用的标准工具。",84],
    ["cardio","physio","同期化效应","Interference of strength development by simultaneously training for strength and endurance","Hickson RC",1980,"Eur J Appl Physiol","cohort","B",["同期训练","干扰效应"],"同期训练干扰效应的开山实验：高频同期耐力训练削弱力量增长。",83],
    ["cardio","physio","同期化效应","Effect of concurrent strength and endurance training on skeletal muscle properties and hormone concentrations in humans","Bell GJ, Syrotuik D, Martin TP, et al.",2000,"Eur J Appl Physiol","rct","B",["同期训练","激素","肌适应"],"验证同期训练下力量-耐力适应的交互作用，干扰效应在下肢与高频模式中更明显。",76],
    ["cardio","physio","同期化效应","Interference between concurrent resistance and endurance exercise: molecular bases and the role of individual training variables","Fyfe JJ, Bishop DJ, Stepto NK",2014,"Sports Med","review","B",["干扰效应","分子机制","mTOR/AMPK"],"从 AMPK-mTOR 分子交叉对话解释同期训练干扰效应的现代综述。",82],
    ["cardio","physio","呼吸极限","Is the lung built for exercise?","Dempsey JA",1986,"Med Sci Sports Exerc","review","B",["肺","运动极限","Wolffe 讲座"],"探讨肺通气是否构成运动极限的经典讲座文献，引出呼气流量受限等关键概念。",78],
    ["cardio","physio","无氧阈","Detecting the threshold of anaerobic metabolism in cardiac patients during exercise","Wasserman K, McIlroy MB",1964,"Am J Cardiol","cohort","B",["无氧阈","气体交换","历史经典"],"首次用气体交换无创探测「无氧阈」的开创性研究，奠定运动强度分区基础。",80],
    ["cardio","physio","心率","Age-predicted maximal heart rate revisited","Tanaka H, Monahan KD, Seals DR",2001,"J Am Coll Cardiol","meta","A",["HRmax","年龄预测","公式"],"Meta 分析提出 HRmax=208−0.7×年龄，优于传统 220−年龄公式。",87],
    ["cardio","physio","训练强度分布","Quantifying training intensity distribution in elite endurance athletes: is there evidence for an \"optimal\" distribution?","Seiler KS, Kjerland GØ",2006,"Scand J Med Sci Sports","cohort","B",["强度分布","极化","精英"],"精英耐力运动员强度分布实证研究：约 80% 训练量在低强度区间，极化模式优于阈强度堆积。",86],
    ["cardio","physio","间歇训练","High-intensity interval training, solutions to the programming puzzle: Part II anaerobic energy, neuromuscular load and practical applications","Buchheit M, Laursen PB",2013,"Sports Med","review","B",["HIIT","无氧","实践"],"HIIT 编程姊妹篇下篇：无氧供能、神经肌肉负荷目标与实践落地建议。",84],

    /* ================= 骨骼肌适应 ================= */
    ["muscle","physio","肌肥大","Dose-response relationship between weekly resistance training volume and increases in muscle mass: a systematic review and meta-analysis","Schoenfeld BJ, Ogborn D, Krieger JW",2017,"J Sports Sci","meta","A",["容量","剂量-反应","Meta"],"周训练组数与肌肥大增量的剂量-反应 Meta 分析：≥10 组/周显著优于低容量。",95],
    ["muscle","physio","肌肥大","Effects of resistance training frequency on measures of muscle hypertrophy: a systematic review and meta-analysis","Schoenfeld BJ, Ogborn D, Krieger JW",2016,"Sports Med","meta","A",["频率","Meta","肌肥大"],"在容量等化前提下，训练频率本身对肌肥大的独立贡献有限，高频的价值在于分配容量。",90],
    ["muscle","physio","肌肥大","The mechanisms of muscle hypertrophy and their application to resistance training","Schoenfeld BJ",2010,"J Strength Cond Res","review","B",["机械张力","代谢压力","机制"],"机械张力-代谢压力-肌肉损伤三联机制的纲领性综述，影响此后十余年的研究与实践。",88],
    ["muscle","physio","肌肥大","Resistance training volume enhances muscle hypertrophy but not strength in trained men","Schoenfeld BJ, Contreras B, Krieger J, et al.",2019,"Med Sci Sports Exerc","rct","B",["容量","RCT","训练者"],"在受训人群中，更高组数容量促进肌肥大但不进一步增加力量，提示两者的解耦。",84],
    ["muscle","physio","力竭","Muscle failure promotes greater muscle hypertrophy in low-load but not in high-load resistance training","Lasevicius T, Schoenfeld BJ, Silva-Batista C, et al.",2022,"J Strength Cond Res","rct","B",["力竭","低负荷","高负荷"],"低负荷训练需接近力竭以匹配高负荷的肥大效果；高负荷下力竭非必要。",86],
    ["muscle","physio","力量","Effect of resistance training frequency on gains in muscular strength: a systematic review and meta-analysis","Grgic J, Schoenfeld BJ, Skrepnik M, et al.",2018,"Sports Med","meta","A",["频率","力量","Meta"],"频率对力量增长的独立作用有限，容量与强度是更强驱动因素。",83],
    ["muscle","physio","间歇","The effects of short versus long inter-set rest intervals in resistance training on measures of muscle strength and hypertrophy: a systematic review","Grgic J, Lazinica B, Mikulic P, et al.",2017,"Sports Med","review","B",["组间休息","力量","肥大"],"较长组间休息（≥2 min）总体有利于力量与肥大的维持，短休息可作代谢压力工具。",81],
    ["muscle","physio","进阶","Progression models in resistance training for healthy adults (ACSM position stand)","American College of Sports Medicine",2009,"Med Sci Sports Exerc","position","A",["ACSM","立场声明","进阶"],"抗阻训练进阶模型的权威立场声明：负荷、次数、组数与进阶策略的循证基准。",92],
    ["muscle","physio","肌肥大","The influence of frequency, intensity, volume and mode of strength training on whole muscle cross-sectional area in humans","Wernbom M, Augustsson J, Thomeé R",2007,"Sports Med","review","B",["CSA","剂量","综述"],"早期系统归纳训练变量与全肌横截面积适应关系的经典综述。",78],
    ["muscle","physio","肌肥大","Single vs. multiple sets of resistance exercise for muscle hypertrophy: a meta-analysis","Krieger JW",2010,"J Strength Cond Res","meta","A",["组数","Meta"],"多组训练较单组产生约 40% 更大肌肥大增量的 Meta 分析证据。",79],
    ["muscle","physio","力量","The effect of weekly set volume on strength gain: a meta-analysis","Ralston GW, Kilgore L, Wyatt FB, Baker JS",2017,"Sports Med","meta","A",["容量","力量","Meta"],"周组数与力量增长呈正剂量关系：中-高容量优于低容量。",80],
    ["muscle","physio","力竭","Is repetition failure critical for the development of muscle hypertrophy and strength?","Sampson JA, Groeller H",2016,"Scand J Med Sci Sports","review","B",["力竭","必要性"],"论证力竭并非肥大/力量适应的必要条件，负荷与总张力时间更关键。",77],
    ["muscle","physio","机制","A brief review of critical processes in exercise-induced muscular hypertrophy","Phillips SM",2014,"Sports Med","review","B",["蛋白合成","卫星细胞","机制"],"从肌肉蛋白合成视角精要梳理运动诱导肥大的关键过程。",76],
    ["muscle","physio","机制","The development of skeletal muscle hypertrophy through resistance training: the role of muscle damage and muscle protein synthesis","Damas F, Libardi CA, Ugrinowitsch C",2018,"Eur J Appl Physiol","review","B",["肌肉损伤","蛋白合成"],"论证肌肉损伤主要影响早期反应，长期肥大由张力驱动的蛋白合成主导。",78],
    ["muscle","physio","肌肥大","Total number of sets as a training volume quantification method for muscle hypertrophy: a systematic review","Baz-Valle E, Balsalobre-Fernández C, Alix-Fages C, Santos-Concejero J",2022,"J Strength Cond Res","review","B",["组数","容量量化"],"系统梳理「组数」作为肥大容量量化指标的适用性与局限。",74],
    ["muscle","physio","基础","Fundamentals of resistance training: progression and exercise prescription","Kraemer WJ, Ratamess NA",2004,"Med Sci Sports Exerc","review","B",["处方","基础"],"抗阻训练处方原理的经典教学综述。",75],
    ["muscle","physio","负荷","Muscular adaptations in response to three different resistance-training regimens: specificity of repetition maximum training zones","Campos GER, Luecke TJ, Wendeln HK, et al.",2002,"Eur J Appl Physiol","rct","B",["重复区间","特异性","经典实验"],"低/中/高重复区间的经典实验：力量-肥大适应具有负荷区间特异性。",77],
    ["muscle","physio","负荷","Resistance exercise load does not determine training-mediated hypertrophic gains in young men","Mitchell CJ, Churchward-Venne TA, West DWD, et al.",2012,"J Appl Physiol","rct","B",["低负荷","等效肥大"],"至力竭前提下 30%1RM 与 80%1RM 产生相似肥大，挑战「必须大重量」直觉。",82],
    ["muscle","physio","负荷","Neither load nor systemic hormones determine resistance training-mediated hypertrophy or strength gains in resistance-trained young men","Morton RW, Oikawa SY, Wavell CG, et al.",2016,"J Appl Physiol","rct","B",["负荷","激素","训练者"],"在受训人群中负荷与急性激素反应均不能预测个体肥大/力量增益。",80],
    ["muscle","physio","负荷","Strength and hypertrophy adaptations between low- vs. high-load resistance training: a systematic review and meta-analysis","Schoenfeld BJ, Grgic J, Ogborn D, Krieger JW",2017,"J Strength Cond Res","meta","A",["低负荷","高负荷","Meta"],"高负荷在最大力量上占优，低负荷与高负荷肥大效果相当（力竭前提下）的 Meta 分析。",87],
    ["muscle","physio","肌纤维","The role of fiber types in muscle hypertrophy: implications for loading strategies","Ogborn D, Schoenfeld BJ",2014,"Strength Cond J","review","C",["肌纤维类型","负荷策略"],"I/II 型肌纤维肥大潜能差异与负荷策略含义的教学综述。",70],

    /* ================= 体态与胸廓生物力学 ================= */
    ["posture","biomech","经典教材","Muscles: Testing and Function with Posture and Pain (5th ed.)","Kendall FP, McCreary EK, Provance PG, et al.",2005,"Lippincott Williams & Wilkins","book","C",["肌力测试","体态"],"徒手肌力测试与体态评估的百年经典教材，体态章节为领域基准参考。",85],
    ["posture","biomech","经典教材","Kinesiology of the Musculoskeletal System: Foundations for Rehabilitation (3rd ed.)","Neumann DA",2017,"Elsevier","book","C",["肌动学","生物力学"],"肌肉骨骼肌动学权威教材：关节力学、呼吸力学与姿势控制的系统阐述。",88],
    ["posture","biomech","膈肌姿势","Postural function of the diaphragm in persons with and without chronic low back pain","Kolář P, Šulc J, Kynčl M, et al.",2012,"J Orthop Sports Phys Ther","cohort","B",["膈肌","姿势功能","腰痛"],"MRI 动态证据：膈肌同时承担呼吸与姿势稳定双重功能，腰痛者姿势功能受损。",89],
    ["posture","biomech","膈肌姿势","Analysis of diaphragm movement during tidal breathing and during its activation while breath holding using MRI synchronized with spirometry","Kolář P, Neuwirth J, Šanda J, et al.",2009,"Physiol Res","cohort","B",["膈肌","MRI","呼吸"],"MRI-肺量计同步技术量化膈肌穹顶在潮气呼吸与屏气激活时的运动学特征。",78],
    ["posture","biomech","膈肌姿势","Changes in intra-abdominal pressure during postural and respiratory activation of the human diaphragm","Hodges PW, Gandevia SC",2000,"J Appl Physiol","cohort","B",["腹内压","膈肌","稳定"],"证明膈肌在肢体快速运动中先于肢体肌激活并通过腹内压参与脊柱稳定。",82],
    ["posture","biomech","脊柱稳定","Inefficient muscular stabilization of the lumbar spine associated with low back pain: a motor control evaluation of transversus abdominis","Hodges PW, Richardson CA",1996,"Spine","cohort","B",["腹横肌","腰痛","运动控制"],"腰痛患者腹横肌激活延迟的里程碑发现，开创腰痛运动控制研究范式。",86],
    ["posture","biomech","脊柱稳定","The stabilizing system of the spine. Part I. Function, dysfunction, adaptation, and enhancement","Panjabi MM",1992,"J Spinal Disord","review","B",["三亚系统","稳定"],"脊柱稳定三亚系统（被动/主动/神经控制）模型的奠基文献。",84],
    ["posture","biomech","肌肉失衡","Muscles and motor control in low back pain: assessment and management (in: Physical Therapy of the Low Back)","Janda V",1987,"Churchill Livingstone","book","C",["上/下交叉","肌肉失衡"],"上交叉/下交叉综合征与肌肉失衡评估体系的源头文献。",80],
    ["posture","biomech","动作模式","Diagnosis and Treatment of Movement Impairment Syndromes","Sahrmann SA",2002,"Mosby","book","C",["动作损伤综合征","评估"],"动作损伤综合征分类与评估体系的代表性专著。",76],
    ["posture","biomech","动作筛查","Reliability, validity, and injury predictive value of the Functional Movement Screen: a systematic review and meta-analysis","Bonazza NA, Smuin D, Onks CA, et al.",2017,"Am J Sports Med","meta","A",["FMS","预测效度","Meta"],"FMS 的系统评价：信度良好，但单用其预测损伤的效度有限，须结合负荷等因素。",83],
    ["posture","biomech","肩胛","Current concepts: scapular dyskinesis","Kibler WB, Sciascia A",2010,"Br J Sports Med","review","B",["肩胛动力障碍","投掷"],"肩胛动力障碍分型与评估的现代综述，动力链概念的核心文献。",81],
    ["posture","biomech","肩胛","The association of scapular kinematics and glenohumeral joint pathologies","Ludewig PM, Reynolds JF",2009,"J Orthop Sports Phys Ther","review","B",["肩胛运动学","肩痛"],"梳理肩胛运动学异常与肩关节疼痛的关联证据与机制假说。",75],
    ["posture","biomech","动力链","The influence of abnormal hip mechanics on knee injury: a biomechanical perspective","Powers CM",2010,"J Orthop Sports Phys Ther","review","B",["髋-膝","动力链","髌股痛"],"远端症状近端机制：髋力学异常对膝损伤影响的生物力学综述。",79],
    ["posture","biomech","经典教材","Biomechanics and Motor Control of Human Movement (4th ed.)","Winter DA",2009,"Wiley","book","C",["步态","运动学"],"人体运动生物力学与运动控制的标准教材。",74],
    ["posture","biomech","胸廓呼吸","Coordination between rib cage muscles and diaphragm during quiet breathing in humans","De Troyer A, Estenne M",1984,"J Appl Physiol","cohort","B",["肋间肌","膈肌","协同"],"阐明安静呼吸中肋间肌与膈肌协同模式的经典实验研究。",77],
    ["posture","biomech","争论","The fall of the postural-structural-biomechanical model in manual and physical therapies: exemplified by lower back pain","Lederman E",2011,"J Bodyw Mov Ther","narrative","D",["结构主义批判","PSB 模型"],"对「体态-结构-疼痛」因果链的系统性批判，是理解现代生物-心理-社会模型争论的必读文献。",72],
    ["posture","biomech","呼吸模式","Recognizing and Treating Breathing Disorders: A Multidisciplinary Approach (2nd ed.)","Chaitow L, Bradley D, Gilbert C",2014,"Churchill Livingstone","book","C",["呼吸模式障碍","评估"],"呼吸模式障碍识别与多学科处理的实用专著。",70],
    ["posture","biomech","脊柱稳定","Therapeutic Exercise for Lumbopelvic Stabilization: A Motor Control Approach for the Treatment and Prevention of Low Back Pain (2nd ed.)","Richardson C, Hodges P, Hides J",2004,"Churchill Livingstone","book","C",["核心稳定","运动控制"],"腰盆稳定运动控制训练的奠基性临床专著。",73],
    ["posture","biomech","腰痛分类","Diagnosis and classification of chronic low back pain disorders: maladaptive movement and motor control impairments as underlying mechanism","O'Sullivan PB",2005,"Man Ther","review","B",["腰痛","分类","运动控制"],"提出基于运动控制障碍的慢性腰痛分类体系，推动个体化治疗。",76],
    ["posture","biomech","髋旋转","Patellofemoral pain and asymmetrical hip rotation","Cibulka MT, Threlkeld-Watkins J",2005,"Phys Ther","cohort","B",["髌股痛","髋旋转","队列"],"髌股痛患者髋内/外旋不对称的队列证据，支持近端因素评估。",71],

    /* ================= 运动损伤康复 ================= */
    ["rehab","rehab","负荷-损伤","The training-injury prevention paradox: should athletes be training smarter and harder?","Gabbett TJ",2016,"Br J Sports Med","review","B",["ACWR","负荷","悖论"],"「训练-损伤预防悖论」：科学递增的高慢性负荷是保护因素而非风险，ACWR 概念普及之作。",96],
    ["rehab","rehab","负荷-损伤","The relationship between training load and injury, illness and soreness: a systematic and literature review","Drew MK, Finch CF",2016,"Sports Med","review","B",["负荷","损伤","系统综述"],"负荷与损伤/疾病/酸痛关系的系统综述，确立负荷-健康结局的研究框架。",85],
    ["rehab","rehab","负荷-损伤","How much is too much? (Part 2) International Olympic Committee consensus statement on load in sport and risk of injury","Soligard T, Schwellnus M, Alonso JM, et al.",2016,"Br J Sports Med","consensus","A",["IOC","共识","负荷"],"IOC 负荷与损伤风险共识声明：负荷管理、监控与预防的官方立场。",91],
    ["rehab","rehab","负荷-损伤","How do training and competition workloads relate to injury? The workload-injury aetiology model","Windt J, Gabbett TJ",2017,"Br J Sports Med","review","B",["负荷","病因模型"],"负荷-损伤病因学模型：将负荷、内在风险因素与损伤机制整合进统一框架。",87],
    ["rehab","rehab","ACL 重返","Simple decision rules can reduce reinjury risk by 84% after ACL reconstruction: the Delaware-Oslo ACL cohort study","Grindem H, Snyder-Mackler L, Moksnes H, et al.",2016,"Br J Sports Med","cohort","B",["ACL","再损伤","重返标准"],"Delaware-Oslo 队列：通过重返运动标准者再损伤风险降低 84%，9 月龄前重返风险显著升高。",92],
    ["rehab","rehab","ACL 重返","Likelihood of ACL graft rupture: not meeting six clinical discharge criteria before return to sport is associated with a four times greater risk of rupture","Kyritsis P, Bahr R, Landreau P, et al.",2016,"Br J Sports Med","cohort","B",["ACL","出院标准","移植物断裂"],"未达 6 项临床出院标准者移植物断裂风险高 4 倍，支持标准化重返评估。",88],
    ["rehab","rehab","胸廓损伤","Rib stress fractures in rowers: a case series and proposed mechanism","Karlson KA",1998,"Am J Sports Med","case","D",["肋骨应力性骨折","赛艇","机制"],"赛艇运动员肋骨应力性骨折的经典病例系列：提出前锯肌-背阔肌负荷机制。",78],
    ["rehab","rehab","肌腱病","Is tendon pathology a continuum? A pathology model to explain the clinical presentation of load-induced tendinopathy","Cook JL, Purdam CR",2009,"Br J Sports Med","review","B",["肌腱连续体","反应性/退变"],"肌腱病理连续体模型：反应性肌腱病→失修复→退变，重塑临床治疗逻辑。",89],
    ["rehab","rehab","肌腱病","Isometric exercise induces analgesia and reduces inhibition in patellar tendinopathy","Rio E, Kidgell D, Purdam C, et al.",2015,"Br J Sports Med","rct","B",["等长","镇痛","髌腱"],"等长收缩对髌腱病的即刻镇痛效应 RCT，催生赛场边疼痛管理新实践。",84],
    ["rehab","rehab","肌腱病","Achilles and patellar tendinopathy loading programmes: a systematic review comparing clinical outcomes and identifying potential mechanisms for effectiveness","Malliaras P, Barton CJ, Reeves ND, Langberg H",2013,"Sports Med","review","B",["负荷方案","跟腱/髌腱"],"肌腱病负荷方案的系统综述：离心并非唯一答案，渐进重负荷是核心原则。",82],
    ["rehab","rehab","病因模型","Understanding injury mechanisms: a key component of preventing injuries in sport","Bahr R, Krosshaug T",2005,"Br J Sports Med","review","B",["损伤机制","预防"],"理解损伤机制是预防前提的方法学经典，规范了损伤机制研究的术语与设计。",83],
    ["rehab","rehab","预防框架","A new framework for research leading to sports injury prevention","Finch C",2006,"J Sci Med Sport","methods","B",["TRIPP","转化研究"],"TRIPP 六阶段转化框架：从机制研究到真实世界实施的损伤预防研究路线图。",80],
    ["rehab","rehab","病因模型","A dynamic model of etiology in sport injury: the recursive nature of risk and causation","Meeuwisse WH, Tyreman H, Hagel B, Emery C",2007,"Clin J Sport Med","review","B",["动态病因","递归"],"损伤病因动态递归模型：风险随参与过程不断重塑，超越线性因果。",79],
    ["rehab","rehab","预防效果","The effectiveness of exercise interventions to prevent sports injuries: a systematic review and meta-analysis of randomised controlled trials","Lauersen JB, Bertelsen DM, Andersen LB",2014,"Br J Sports Med","meta","A",["预防","力量/神经肌肉","Meta"],"RCT Meta 分析：力量训练使运动损伤减少约 2/3，神经肌肉训练约减半。",90],
    ["rehab","rehab","预防效果","Meta-analysis of meta-analyses of anterior cruciate ligament injury reduction training programs","Webster KE, Hewett TE",2018,"J Orthop Res","meta","A",["ACL","神经肌肉","Meta"],"Meta 的 Meta：神经肌肉预防训练使 ACL 损伤风险降低约 50%，女性获益更大。",85],
    ["rehab","rehab","腘绳肌","Including the Nordic hamstring exercise in injury prevention programmes halves the rate of hamstring injuries: a systematic review and meta-analysis of 8459 athletes","van Dyk N, Behan FP, Whiteley R",2019,"Br J Sports Med","meta","A",["Nordic","腘绳肌","Meta"],"8459 名运动员的 Meta 分析：含北欧腘绳肌练习的预防方案使拉伤率约减半。",88],
    ["rehab","rehab","流行病学","Injuries affect team performance negatively in professional football: an 11-year follow-up of the UEFA Champions League injury study","Hägglund M, Waldén M, Magnusson H, et al.",2013,"Br J Sports Med","cohort","B",["足球","团队表现","流行病学"],"11 年欧冠伤病队列：低伤病负担与更高联赛排名显著相关，伤病管理即竞技管理。",81],
    ["rehab","rehab","流行病学方法","Development and validation of a new method for the registration of overuse injuries in sports injury epidemiology: the Oslo Sports Trauma Research Centre (OSTRC) overuse injury questionnaire","Clarsen B, Rønsen O, Myklebust G, et al.",2013,"Br J Sports Med","methods","B",["过劳损伤","OSTRC 问卷"],"OSTRC 过劳损伤问卷：解决传统时间损失定义低估过劳损伤的问题。",76],
    ["rehab","rehab","共识定义","Consensus statement on injury definitions and data collection procedures in studies of football (soccer) injuries","Fuller CW, Ekstrand J, Junge A, et al.",2006,"Br J Sports Med","consensus","A",["定义","数据收集","足球"],"足球损伤定义与数据收集的国际共识，成为全球伤病流行病学研究的标准。",77],
    ["rehab","rehab","腘绳肌","A return-to-sport algorithm for acute hamstring injuries","Mendiguchia J, Brughelli M",2011,"Phys Ther Sport","review","B",["腘绳肌","重返算法"],"急性腘绳肌损伤重返运动的结构化决策算法：疼痛、柔韧、力量与功能递进标准。",79],
    ["rehab","rehab","流行病学","Hamstring injuries have increased by 4% annually in men's professional football since 2001: a 13-year longitudinal analysis of the UEFA Elite Club injury study","Ekstrand J, Waldén M, Hägglund M",2016,"Br J Sports Med","cohort","B",["腘绳肌","流行病学","欧足联"],"13 年欧足联精英俱乐部伤病研究：腘绳肌损伤率年均上升约 4%，预防形势严峻。",82],

    /* ================= 运动营养与代谢 ================= */
    ["nutrition","nutrition","蛋白质","A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength in healthy adults","Morton RW, Murphy KT, McKellar SR, et al.",2018,"Br J Sports Med","meta","A",["蛋白质","1.6 g/kg","Meta"],"49 项研究 Meta 回归：蛋白补充增效抗阻训练，约 1.6 g/kg/d 达收益平台。",94],
    ["nutrition","nutrition","立场声明","Nutrition and athletic performance (joint position stand of ACSM/AND/DC)","Thomas DT, Erdman KA, Burke LM",2016,"Med Sci Sports Exerc","position","A",["ACSM","营养","立场声明"],"运动营养领域最高级别立场声明：能量、宏量营养素与补剂的循证基准。",90],
    ["nutrition","nutrition","低碳水","Low carbohydrate, high fat diet impairs exercise economy and negates the performance benefit from intensified training in elite race walkers","Burke LM, Ross ML, Garvican-Lewis LA, et al.",2017,"J Physiol","rct","B",["低碳高脂","竞走","经济性"],"精英竞走 RCT：低碳高脂饮食损害运动经济性并抵消强化训练收益。",86],
    ["nutrition","nutrition","碳水周期化","Carbohydrate availability and training adaptation: effects on cell metabolism","Hawley JA, Burke LM",2010,"Exerc Sport Sci Rev","review","B",["train-low","细胞信号"],"「燃料可用性」概念综述：低糖原训练放大细胞信号但需权衡表现质量。",82],
    ["nutrition","nutrition","碳水","A step towards personalized sports nutrition: carbohydrate intake during exercise","Jeukendrup AE",2014,"Sports Med","review","B",["碳水","个体化","运动中"],"运动中碳水摄入个体化的纲领性综述：按时长-强度给剂量，肠道可训练。",84],
    ["nutrition","nutrition","蛋白质","Dietary protein for athletes: from requirements to optimum adaptation","Phillips SM, Van Loon LJC",2011,"J Sports Sci","review","B",["蛋白质","分配","每餐剂量"],"运动员蛋白需求的经典综述：强调每餐 0.3 g/kg 与全天分配策略。",85],
    ["nutrition","nutrition","蛋白质","Pre-sleep protein ingestion to improve the skeletal muscle adaptive response to exercise training","Trommelen J, van Loon LJC",2016,"Nutrients","review","B",["睡前蛋白","夜间恢复"],"睡前蛋白摄入增强夜间肌肉蛋白合成、放大抗阻训练适应的综述。",78],
    ["nutrition","nutrition","立场声明","International Society of Sports Nutrition position stand: protein and exercise","Jäger R, Kerksick CM, Campbell BI, et al.",2017,"J Int Soc Sports Nutr","position","A",["ISSN","蛋白质","立场声明"],"ISSN 蛋白质与运动立场声明：剂量、时机、来源与安全性的循证结论。",87],
    ["nutrition","nutrition","立场声明","ISSN exercise & sports nutrition review update: research & recommendations","Kerksick CM, Wilborn CD, Roberts MD, et al.",2018,"J Int Soc Sports Nutr","position","A",["ISSN","综述更新"],"ISSN 运动营养综述更新：覆盖宏量营养素、微量营养素与常见补剂的证据分级。",83],
    ["nutrition","nutrition","脱水","Effect of exercise-induced dehydration on endurance performance: a meta-analysis","Goulet EDB",2013,"Br J Sports Med","meta","A",["脱水","耐力","Meta"],"脱水对耐力表现影响的 Meta 分析：≥2% 体重丢失显著损害表现。",80],
    ["nutrition","nutrition","补液","Exercise and fluid replacement (ACSM position stand)","Sawka MN, Burke LM, Eichner ER, et al.",2007,"Med Sci Sports Exerc","position","A",["补液","ACSM","立场声明"],"运动补液立场声明：个体化补液计划、钠补充与低钠血症警示。",82],
    ["nutrition","nutrition","脱水认知","Mild dehydration impairs cognitive performance and mood of men","Ganio MS, Armstrong LE, Casa DJ, et al.",2011,"Br J Nutr","rct","B",["轻度脱水","认知"],"轻度脱水（约 1.6%）即损害男性认知表现与情绪的 RCT。",74],
    ["nutrition","nutrition","乳酸","The science and translation of lactate shuttle theory","Brooks GA",2018,"Cell Metab","review","B",["乳酸穿梭","细胞-细胞"],"乳酸穿梭理论的现代阐述：乳酸是燃料、信号分子而非代谢废物。",81],
    ["nutrition","nutrition","脂肪氧化","Optimizing fat oxidation through exercise and diet","Achten J, Jeukendrup AE",2004,"Nutrition","review","B",["Fatmax","脂肪氧化"],"脂肪氧化率与运动强度关系（Fatmax 概念）及营养干预的综述。",75],
    ["nutrition","nutrition","碳水","The use of carbohydrates during exercise as an ergogenic aid","Cermak NM, van Loon LJC",2013,"Sports Med","review","B",["碳水","增效"],"运动中碳水增效作用的机制与实践综述。",76],
    ["nutrition","nutrition","营养周期化","Fuel for the work required: a theoretical framework for carbohydrate periodization and the glycogen threshold hypothesis","Impey SG, Hearris MA, Hammond KM, et al.",2018,"Sports Med","review","B",["燃料可用性","周期化","糖原阈值"],"碳水周期化「按需供能」理论框架：训练刺激与表现质量的双目标权衡。",84],
    ["nutrition","nutrition","营养周期化","Periodized nutrition for athletes","Jeukendrup AE",2017,"Sports Med","review","B",["营养周期化","训练适应"],"将营养摄入与训练周期结构化匹配的现代纲领性综述。",80],

    /* ================= 运动补剂循证 ================= */
    ["suppl","nutrition","IOC 框架","IOC consensus statement: dietary supplements and the high-performance athlete","Maughan RJ, Burke LM, Dvorak J, et al.",2018,"Br J Sports Med","consensus","A",["IOC","补剂框架","精英运动员"],"IOC 补剂共识：仅少数补剂（咖啡因、肌酸、硝酸盐、β-丙氨酸、碳酸氢钠）具 A 级增效证据，警示污染与第三方检测。",93],
    ["suppl","nutrition","肌酸","International Society of Sports Nutrition position stand: safety and efficacy of creatine supplementation in exercise, sport, and medicine","Kreider RB, Kalman DS, Antonio J, et al.",2017,"J Int Soc Sports Nutr","position","A",["肌酸","ISSN","安全性"],"ISSN 肌酸立场声明：一水肌酸 3–5 g/d 安全有效，是研究最充分的增效补剂。",91],
    ["suppl","nutrition","肌酸","Effect of creatine supplementation on body composition and performance: a meta-analysis","Branch JD",2003,"Int J Sport Nutr Exerc Metab","meta","A",["肌酸","体成分","Meta"],"肌酸补充对去脂体重与短时高强度表现增效的 Meta 分析，效应方向一致。",80],
    ["suppl","nutrition","肌酸","Effects of creatine supplementation and resistance training on muscle strength and weightlifting performance","Rawson ES, Volek JS",2003,"J Strength Cond Res","meta","A",["肌酸","力量","Meta"],"肌酸+抗阻训练较安慰剂组力量增益更大：卧推约 +5%、深蹲约 +8%（相对增幅）。",78],
    ["suppl","nutrition","肌酸","Creatine in health and disease","Wallimann T, Tokarska-Schlattner M, Schlattner U",2011,"Amino Acids","review","B",["肌酸","磷酸原","机制"],"从磷酸原系统与细胞能量穿梭角度系统阐述肌酸生理与健康效应的权威综述。",76],
    ["suppl","nutrition","肌酸","Effectiveness of creatine supplementation on aging muscle and bone: focus on falls prevention and inflammation","Candow DG, Forbes SC, Chilibeck PD, et al.",2021,"J Clin Med","review","B",["肌酸","老龄","骨"],"肌酸在老龄人群肌肉衰减与骨健康中的潜在价值综述。",72],
    ["suppl","nutrition","咖啡因","International society of sports nutrition position stand: caffeine and exercise performance","Guest NS, VanDusseldorp TA, Nelson MT, et al.",2021,"J Int Soc Sports Nutr","position","A",["咖啡因","ISSN","立场声明"],"ISSN 咖啡因立场声明：3–6 mg/kg 提升耐力/力量/认知，高剂量不增效且副作用增加。",88],
    ["suppl","nutrition","咖啡因","Effects of caffeine intake on muscle strength and power: a systematic review and meta-analysis","Grgic J, Trexler ET, Lazinica B, Pedisic Z",2018,"Eur J Sport Sci","meta","A",["咖啡因","力量","Meta"],"咖啡因提升最大力量与跳跃功率的 Meta 分析：上肢受益较下肢更明显。",82],
    ["suppl","nutrition","咖啡因","The effect of acute caffeine ingestion on endurance performance: a systematic review and meta-analysis","Southward K, Rutherfurd-Markwick KJ, Ali A",2018,"Sports Med","meta","A",["咖啡因","耐力","Meta"],"急性咖啡因摄入改善耐力表现的 Meta 分析，平均增效约 2–4%。",84],
    ["suppl","nutrition","咖啡因","Effect of caffeine on sport-specific endurance performance: a systematic review","Ganio MS, Klau JF, Casa DJ, et al.",2009,"J Strength Cond Res","review","B",["咖啡因","耐力","计时赛"],"咖啡因对计时赛类耐力表现增效效应的系统综述。",74],
    ["suppl","nutrition","咖啡因","Administration of caffeine in alternate forms","Wickham KA, Spriet LL",2018,"Sports Med","review","B",["咖啡因","剂型","口香糖"],"咖啡因口香糖/凝胶等替代剂型的吸收动力学与增效证据综述。",70],
    ["suppl","nutrition","β-丙氨酸","Effect of β-alanine supplementation on exercise performance: a meta-analysis","Hobson RM, Saunders B, Ball G, et al.",2012,"Amino Acids","meta","A",["β-丙氨酸","肌肽","Meta"],"β-丙氨酸提升肌肽缓冲能力、改善 1–4 min 高强度运动表现的 Meta 分析。",83],
    ["suppl","nutrition","β-丙氨酸","International society of sports nutrition position stand: Beta-Alanine","Trexler ET, Smith-Ryan AE, Stout JR, et al.",2015,"J Int Soc Sports Nutr","position","A",["β-丙氨酸","ISSN","立场声明"],"ISSN β-丙氨酸立场声明：3.2–6.4 g/d 持续 4 周以上，适用于高强度间歇与格斗类项目。",79],
    ["suppl","nutrition","硝酸盐","Dietary nitrate supplementation and exercise performance","Jones AM",2014,"Sports Med","review","B",["硝酸盐","NO 通路","甜菜根"],"硝酸盐-NO 通路降低运动氧耗、改善耐力经济性的机制综述。",85],
    ["suppl","nutrition","硝酸盐","The effect of dietary nitrate supplementation on endurance exercise performance in healthy adults: a systematic review and meta-analysis","McMahon NF, Leveritt MD, Pavey TG",2017,"Sports Med","meta","A",["硝酸盐","耐力","Meta"],"硝酸盐补充对耐力表现的 Meta 分析：训练水平越低受益越明显，精英运动员效应微弱。",80],
    ["suppl","nutrition","硝酸盐","Dietary nitrate supplementation reduces the O2 cost of low-intensity exercise and enhances tolerance to high-intensity exercise","Bailey SJ, Winyard P, Vanhatalo A, et al.",2009,"J Appl Physiol","rct","B",["硝酸盐","氧耗","RCT"],"甜菜根汁降低亚极量运动氧耗并延长高强度耐受时间的经典 RCT。",81],
    ["suppl","nutrition","碳酸氢钠","Effects of acute alkalosis and acidosis on performance: a meta-analysis","Carr AJ, Hopkins WG, Gore CJ",2011,"Sports Med","meta","A",["碳酸氢钠","缓冲","Meta"],"急性碱化（碳酸氢钠 0.2–0.4 g/kg）改善高强度运动表现的 Meta 分析。",77],
    ["suppl","nutrition","HMB","International Society of Sports Nutrition Position Stand: beta-hydroxy-beta-methylbutyrate (HMB)","Wilson JM, Fitschen PJ, Campbell B, et al.",2013,"J Int Soc Sports Nutr","position","B",["HMB","抗分解","立场声明"],"ISSN HMB 立场声明：在停训/能量缺口期或有抗分解价值，增效证据弱于肌酸。",68],
    ["suppl","nutrition","胶原","Vitamin C-enriched gelatin supplementation before intermittent activity augments collagen synthesis","Shaw G, Lee-Barthel A, Ross MLR, et al.",2017,"Am J Clin Nutr","rct","B",["胶原","明胶","肌腱"],"运动前 1 h 补充 15 g 明胶+维生素 C 可提升胶原合成标志物的 RCT，为结缔组织营养策略奠基。",79],
    ["suppl","nutrition","Omega-3","Sex differences in the effect of fish-oil supplementation on the adaptive response to resistance exercise training in older people: a randomized controlled trial","Da Boit M, Sibson R, Sivasubramaniam S, et al.",2017,"Am J Clin Nutr","rct","B",["鱼油","抗阻适应","老龄"],"鱼油补充增强老年女性抗阻训练力量适应的 RCT，提示性别差异。",71],
    ["suppl","nutrition","铁","Iron considerations for the athlete: a narrative review","Sim M, Garvican-Lewis LA, Cox GR, et al.",2019,"Eur J Appl Physiol","narrative","C",["铁","筛查","女性运动员"],"运动员铁状态筛查、铁蛋白阈值与补铁策略的实用综述。",73],
    ["suppl","nutrition","酸樱桃","The role of cherries in exercise and health","Bell PG, McHugh MP, Stevenson E, Howatson G",2014,"Scand J Med Sci Sports","review","C",["酸樱桃","恢复","抗氧化"],"酸樱桃汁对 DOMS 与恢复标志物影响的综述：效应存在但幅度有限。",66],

    /* ================= 健康与运动医学 ================= */
    ["health","health","运动处方","American College of Sports Medicine position stand. Quantity and quality of exercise for developing and maintaining cardiorespiratory, musculoskeletal, and neuromotor fitness in apparently healthy adults","Garber CE, Blissmer B, Deschenes MR, et al.",2011,"Med Sci Sports Exerc","position","A",["ACSM","运动处方","FITT"],"ACSM 健康成人运动量与质量立场声明：心肺/肌肉/神经运动适能的 FITT-VP 处方基准。",92],
    ["health","health","运动处方","World Health Organization 2020 guidelines on physical activity and sedentary behaviour","Bull FC, Al-Ansari SS, Biddle S, et al.",2020,"Br J Sports Med","consensus","A",["WHO","体力活动","指南"],"WHO 2020 指南：成人每周 150–300 min 中等强度有氧 + 每周 2 次肌力训练，减少久坐。",95],
    ["health","health","运动处方","ACSM's Guidelines for Exercise Testing and Prescription (11th ed.)","Liguori G, Feito Y, Fountaine C, Roy BA",2022,"Wolters Kluwer","book","C",["运动测试","处方","教材"],"ACSM 运动测试与处方指南教材：CPET 流程、危险分层与特殊人群处方的操作标准。",88],
    ["health","health","健康效益","Health benefits of physical activity: a systematic review of current systematic reviews","Warburton DER, Bredin SSD",2017,"Curr Opin Cardiol","review","B",["体力活动","全因死亡","剂量-反应"],"体力活动健康效益的综述之综述：剂量-反应曲线在低到中等活动量区间最陡。",84],
    ["health","health","健康效益","Effect of physical inactivity on major non-communicable diseases worldwide: an analysis of burden of disease and life expectancy","Lee IM, Shiroma EJ, Lobelo F, et al.",2012,"Lancet","meta","A",["缺乏运动","疾病负担","Lancet"],"Lancet 里程碑分析：缺乏运动贡献全球约 9% 过早死亡，消除缺乏运动可延长预期寿命。",90],
    ["health","health","久坐","Does physical activity attenuate, or even eliminate, the detrimental association of sitting time with mortality?","Ekelund U, Steene-Johannessen J, Brown WJ, et al.",2016,"Lancet","meta","A",["久坐","死亡风险","Meta"],"百万级人群 Meta：每日约 60–75 min 中等强度活动可基本抵消久坐相关死亡风险。",86],
    ["health","health","久坐","Sedentary time and its association with risk for disease incidence, mortality, and hospitalization in adults: a systematic review and meta-analysis","Biswas A, Oh PI, Faulkner GE, et al.",2015,"Ann Intern Med","meta","A",["久坐","系统综述"],"久坐时间与全因死亡、心血管与糖尿病发病风险关系的 Meta 分析。",79],
    ["health","health","心肺适能","Physical fitness and all-cause mortality. A prospective study of healthy men and women","Blair SN, Kohl HW, Paffenbarger RS, et al.",1989,"JAMA","cohort","A",["心肺适能","全因死亡","队列"],"Aerobics Center 经典队列：心肺适能是全因死亡的强独立预测因子，开创体适能流行病学。",91],
    ["health","health","心肺适能","Exercise capacity and mortality among men referred for exercise testing","Myers J, Prakash M, Froelicher V, et al.",2002,"N Engl J Med","cohort","A",["MET","运动能力","NEJM"],"NEJM 队列：运动能力每增加 1 MET，死亡风险下降约 12%。",89],
    ["health","health","肌力与健康","Muscle mass index as a predictor of longevity in older adults","Srikanthan P, Karlamangla AS",2014,"Am J Med","cohort","B",["肌肉量","寿命","老龄"],"肌肉量指数与老年人全因死亡负相关的队列证据，支持「肌力即健康资本」。",75],
    ["health","health","血压","Exercise training for blood pressure: a systematic review and meta-analysis","Cornelissen VA, Smart NA",2013,"J Am Heart Assoc","meta","A",["血压","运动降压","Meta"],"耐力/动态抗阻/等长训练降压效应的 Meta 分析：各类运动均可显著降低静息血压。",83],
    ["health","health","糖尿病","Physical activity/exercise and diabetes: a position statement of the American Diabetes Association","Colberg SR, Sigal RJ, Yardley JE, et al.",2016,"Diabetes Care","position","A",["糖尿病","ADA","立场声明"],"ADA 体力活动与糖尿病立场声明：有氧+抗阻联合优于单一模式，含 1/2 型糖尿病处方细节。",81],
    ["health","health","骨健康","American College of Sports Medicine position stand: physical activity and bone health","Kohrt WM, Bloomfield SA, Little KD, et al.",2004,"Med Sci Sports Exerc","position","A",["骨密度","负重","立场声明"],"ACSM 体力活动与骨健康立场声明：高冲击负重与抗阻训练是骨量维持的核心手段。",77],
    ["health","health","肿瘤","Leisure-time physical activity and risk of 26 types of cancer in 1.44 million adults","Moore SC, Lee IM, Weiderpass E, et al.",2016,"JAMA Intern Med","cohort","A",["体力活动","癌症风险","队列"],"144 万人汇总队列：高水平业余体力活动与 13 种癌症风险降低相关。",87],
    ["health","health","HIIT 健康","Effects of high-intensity interval training on cardiometabolic health: a systematic review and meta-analysis of intervention studies","Batacan RB, Duncan MJ, Dalbo VJ, et al.",2017,"Br J Sports Med","meta","A",["HIIT","心血管代谢","Meta"],"HIIT 改善大众人群心肺适能与心血管代谢指标的 Meta 分析，支持 HIIT 的健康促进价值。",82],
    ["health","health","能量可用性","International Olympic Committee consensus statement on relative energy deficiency in sport (RED-S): 2018 update","Mountjoy M, Sundgot-Borgen JK, Burke LM, et al.",2018,"Br J Sports Med","consensus","A",["RED-S","能量可用性","IOC"],"IOC RED-S 共识：低能量可用性损害内分泌、骨、免疫与表现，EA<30 kcal/kg FFM/d 为警戒阈值。",92],
    ["health","health","能量可用性","International Olympic Committee's RED-S CAT2 consensus statement","Mountjoy M, Ackerman KE, Bailey DM, et al.",2023,"Br J Sports Med","consensus","A",["RED-S CAT2","筛查工具"],"IOC RED-S 临床评估工具第二版：分级筛查流程与重返运动决策框架。",85],
    ["health","health","能量可用性","Low energy availability in the marathon and other endurance sports","Loucks AB",2007,"Sports Med","review","B",["低能量可用性","耐力","机制"],"能量可用性概念奠基综述：内分泌与生殖功能对能量缺口敏感。",78],
    ["health","health","睡眠","Sleep and athletic performance: the effects of sleep loss on exercise performance, and physiological and cognitive responses to exercise","Fullagar HHK, Skorski S, Duffield R, et al.",2015,"Sports Med","review","B",["睡眠剥夺","运动表现"],"睡眠不足对运动表现与认知-生理反应影响的系统综述。",83],
    ["health","health","睡眠","Sleep hygiene for optimizing recovery in athletes: review and recommendations","Vitale KC, Owens R, Hopkins SR, Malhotra A",2019,"Int J Sports Med","review","B",["睡眠卫生","恢复"],"运动员睡眠卫生优化策略综述：时长、规律性与小睡策略。",74],
    ["health","health","睡眠","The effects of sleep extension on the athletic performance of collegiate basketball players","Mah CD, Mah KE, Kezirian EJ, Dement WC",2011,"Sleep","cohort","B",["睡眠延长","篮球","表现"],"睡眠延长至 10 小时显著提升冲刺、投篮精度与反应时的经典实验。",76],
    ["health","health","赛前筛查","Trends in sudden cardiovascular death in young competitive athletes after implementation of a preparticipation screening program","Corrado D, Basso C, Pavei A, et al.",2006,"JAMA","cohort","B",["心脏筛查","猝死","意大利"],"意大利赛前筛查项目使青年运动员心源性猝死率下降约 89% 的里程碑队列。",88],
    ["health","health","赛前筛查","Assessment of the 12-lead ECG as a screening test for detection of cardiovascular disease in healthy general populations of young people: a scientific statement","Maron BJ, Friedman RA, Kligfield P, et al.",2014,"Circulation","consensus","A",["心电图","AHA/ACC","筛查"],"AHA/ACC 青年人群 12 导联心电图筛查科学声明：敏感性与假阳性的权衡框架。",84],
    ["health","health","心脏安全","Incidence of sudden cardiac death in National Collegiate Athletic Association athletes","Harmon KG, Asif IM, Maleszewski JJ, et al.",2015,"Circulation","cohort","B",["猝死流行病学","NCAA"],"NCAA 运动员心源性猝死发病率队列：男性篮球最高危（约 1:5200/年）。",77],
    ["health","health","赛前筛查","Updating ACSM's recommendations for exercise preparticipation health screening","Riebe D, Franklin BA, Thompson PD, et al.",2015,"Med Sci Sports Exerc","position","A",["PAR-Q","筛查流程","ACSM"],"ACSM 运动前健康筛查流程更新：取消对无症状低风险人群的过度医疗转介。",80],
    ["health","health","体成分","Healthy percentage body fat ranges: an approach for developing guidelines based on body mass index","Gallagher D, Heymsfield SB, Heo M, et al.",2000,"Am J Clin Nutr","cohort","B",["体脂率","常模","BMI"],"基于 BMI 与体成分测量的健康体脂率参考区间，被广泛用于体成分判读。",76],
    ["health","health","体成分","Applied Body Composition Assessment (2nd ed.)","Heyward VH, Wagner DR",2004,"Human Kinetics","book","C",["体成分","皮褶","DXA"],"体成分评估方法学教材：皮褶、BIA、DXA 的原理、误差与操作规范。",72],
    ["health","health","HIIT 健康","Effect of high-intensity interval training vs moderate-intensity continuous training on body composition in overweight and obese adults: a systematic review and meta-analysis","Wewege M, van den Berg R, Ward RE, Keech A",2017,"Obes Rev","meta","A",["HIIT","体脂","肥胖人群"],"HIIT 与中等强度持续训练改善超重/肥胖成人体成分效果相近，HIIT 时间效率更优。",78],

    /* ================= 科研方法学 ================= */
    ["methods","methods","报告规范","The PRISMA 2020 statement: an updated guideline for reporting systematic reviews","Page MJ, McKenzie JE, Bossuyt PM, et al.",2021,"BMJ","methods","A",["PRISMA","报告规范"],"系统综述报告规范的现行标准：27 项清单与流程图，投稿必备。",93],
    ["methods","methods","报告规范","Preferred reporting items for systematic reviews and meta-analyses: the PRISMA statement","Moher D, Liberati A, Tetzlaff J, Altman DG",2009,"BMJ","methods","A",["PRISMA","2009 版"],"PRISMA 原始声明，系统综述报告透明化的里程碑。",86],
    ["methods","methods","异质性","Measuring inconsistency in meta-analyses","Higgins JPT, Thompson SG, Deeks JJ, Altman DG",2003,"BMJ","methods","A",["I²","异质性"],"提出 I² 统计量量化 Meta 分析异质性，成为领域通用指标。",88],
    ["methods","methods","随机效应","Meta-analysis in clinical trials","DerSimonian R, Laird N",1986,"Control Clin Trials","methods","A",["DL 法","随机效应"],"DerSimonian-Laird 随机效应模型原始文献，应用最广的合并方法。",85],
    ["methods","methods","发表偏倚","Bias in meta-analysis detected by a simple, graphical test","Egger M, Davey Smith G, Schneider M, Minder C",1997,"BMJ","methods","A",["Egger 检验","漏斗图"],"Egger 回归检验发表偏倚的经典方法学文献。",84],
    ["methods","methods","证据分级","GRADE: an emerging consensus on rating quality of evidence and strength of recommendations","Guyatt GH, Oxman AD, Vist GE, et al.",2008,"BMJ","methods","A",["GRADE","证据分级"],"GRADE 证据分级体系的纲领性文献：从证据质量到推荐强度的透明框架。",90],
    ["methods","methods","偏倚风险","RoB 2: a revised tool for assessing risk of bias in randomised trials","Sterne JAC, Savović J, Page MJ, et al.",2019,"BMJ","methods","A",["RoB 2","偏倚风险"],"Cochrane 随机试验偏倚风险评估工具第二版，现行标准。",87],
    ["methods","methods","质量评价","Reliability of the PEDro scale for rating quality of randomized controlled trials","Maher CG, Sherrington C, Herbert RD, et al.",2003,"Phys Ther","methods","A",["PEDro","物理治疗"],"PEDro 量表信度研究：物理治疗领域 RCT 质量评价的标准工具。",80],
    ["methods","methods","统计功效","Statistical Power Analysis for the Behavioral Sciences (2nd ed.)","Cohen J",1988,"Lawrence Erlbaum","book","C",["功效分析","效应量"],"效应量与统计功效分析的奠基专著，d 值标准来源。",82],
    ["methods","methods","体育统计","Progressive statistics for studies in sports medicine and exercise science","Hopkins WG, Marshall SW, Batterham AM, Hanin J",2009,"Med Sci Sports Exerc","methods","A",["量级推断","体育统计"],"倡导以效应量+置信区间的量级推断替代二元 p 值，重塑体育科学统计实践。",79],
    ["methods","methods","体育统计","Making meaningful inferences about magnitudes","Batterham AM, Hopkins WG",2006,"Int J Sports Physiol Perform","methods","A",["量级推断","MBI"],"量级推断（magnitude-based inference）方法的核心文献。",74],
    ["methods","methods","Meta 教材","Introduction to Meta-Analysis","Borenstein M, Hedges LV, Higgins JPT, Rothstein HR",2009,"Wiley","book","C",["Meta 分析","教材"],"Meta 分析标准教材：固定/随机效应、异质性与发表偏倚的系统阐述。",78]
  ];

  var entries = E.map(function (r, i) {
    return {
      id: i + 1,
      lib: r[0], track: r[1], sub: r[2], title: r[3], authors: r[4],
      year: r[5], journal: r[6], type: r[7], grade: r[8],
      tags: r[9], key: r[10], pop: r[11]
    };
  });

  function stats() {
    var byLib = {}, byType = {}, byGrade = {}, byYear = {};
    entries.forEach(function (e) {
      byLib[e.lib] = (byLib[e.lib] || 0) + 1;
      byType[e.type] = (byType[e.type] || 0) + 1;
      byGrade[e.grade] = (byGrade[e.grade] || 0) + 1;
      byYear[e.year] = (byYear[e.year] || 0) + 1;
    });
    return {
      total: entries.length,
      byLib: byLib, byType: byType, byGrade: byGrade, byYear: byYear
    };
  }

  window.SPORTSCI_DATA = {
    libraries: LIBRARIES,
    tracks: TRACKS,
    types: TYPES,
    entries: entries,
    stats: stats
  };
})();
