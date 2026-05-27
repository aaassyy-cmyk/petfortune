import { useState, useEffect, useRef } from "react";

const API_URL = "/api/claude";

const PET_TYPES = [
  { emoji: "🐶", label: "강아지", value: "강아지" },
  { emoji: "🐱", label: "고양이", value: "고양이" },
];

const BREEDS = {
  강아지: ["말티즈", "푸들", "포메라니안", "골든리트리버", "시바견", "비숑프리제", "웰시코기", "진돗개", "치와와", "시츄", "기타"],
  고양이: ["코리안숏헤어", "러시안블루", "페르시안", "스코티시폴드", "메인쿤", "샴", "아비시니안", "노르웨이숲", "벵갈", "브리티시숏헤어", "기타"],
};

const SNACK_LINKS = {
  강아지: {
    "고구마 스틱": "https://link.coupang.com/a/d3CfEIQPeu",
    "닭가슴살 져키": "https://link.coupang.com/a/d3CpWgX1gG",
    "연어 트릿": "https://link.coupang.com/a/d3CuFfDWc8",
    "치즈 큐브": "https://link.coupang.com/a/d3CAb46Gke",
    "오리 육포": "https://link.coupang.com/a/d3CFvbqqXY",
  },
  고양이: {
    "츄르": "https://link.coupang.com/a/d3HFlfOPAG",
    "참치 트릿": "https://link.coupang.com/a/d3HL20Vz9o",
    "연어 스낵": "https://link.coupang.com/a/d3H75ZxfMG",
    "치킨 져키": "https://link.coupang.com/a/d3HVLwwpb2",
    "캣닢 간식": "https://link.coupang.com/a/d3H1A6hbzg",
  },
};

const ELEMENT_STYLES = {
  불: { bg: "from-orange-950 via-red-950 to-orange-900", glow: "rgba(249,115,22,0.4)", accent: "#fb923c", light: "#fed7aa", badge: "bg-orange-900/40 text-orange-300 border-orange-700/40" },
  물: { bg: "from-blue-950 via-slate-900 to-blue-950", glow: "rgba(59,130,246,0.4)", accent: "#60a5fa", light: "#bfdbfe", badge: "bg-blue-900/40 text-blue-300 border-blue-700/40" },
  나무: { bg: "from-green-950 via-emerald-950 to-green-900", glow: "rgba(34,197,94,0.4)", accent: "#4ade80", light: "#bbf7d0", badge: "bg-green-900/40 text-green-300 border-green-700/40" },
  금: { bg: "from-yellow-950 via-amber-950 to-yellow-900", glow: "rgba(234,179,8,0.4)", accent: "#facc15", light: "#fef08a", badge: "bg-yellow-900/40 text-yellow-300 border-yellow-700/40" },
  흙: { bg: "from-stone-950 via-amber-950 to-stone-900", glow: "rgba(168,162,158,0.4)", accent: "#d6d3d1", light: "#e7e5e4", badge: "bg-stone-800/40 text-stone-300 border-stone-600/40" },
};

function Stars({ count = 40 }) {
  const stars = useRef([]);
  if (!stars.current.length) {
    stars.current = Array.from({ length: count }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.15,
    }));
  }
  return (
    <div className="absolute inset-0 pointer-events-none">
      {stars.current.map((s, i) => (
        <div key={i} className="absolute rounded-full bg-white" style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size, opacity: s.opacity }} />
      ))}
    </div>
  );
}

function Screen1({ onNext }) {
  const [petType, setPetType] = useState("강아지");
  const [breed, setBreed] = useState("");
  const [petName, setPetName] = useState("");
  const [petBday, setPetBday] = useState("");
  const [dateMode, setDateMode] = useState("birth");
  const canGo = petName.trim() && petBday && breed;

  const handleTypeChange = (type) => {
    setPetType(type);
    setBreed("");
  };

  const switchMode = (mode) => {
    setDateMode(mode);
    setPetBday("");
  };

  return (
    <div className="flex flex-col min-h-full" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* Header */}
      <div className="text-white px-5 pt-6 pb-8 rounded-b-3xl" style={{ background: "linear-gradient(145deg,#6B5CE7,#A78BFA)" }}>
        <div className="text-xs px-3 py-1 rounded-full inline-block mb-3" style={{ background: "rgba(255,255,255,0.2)" }}>🐾 마이펫 포춘</div>
        <div className="text-2xl font-bold leading-snug mb-1">우리 아이<br />사주 보러 왔어요</div>
        <div className="text-sm opacity-75">생일 하나로 성격부터 간식까지</div>
        <div className="text-4xl mt-3">✨</div>
      </div>

      <div className="px-5 py-5 flex flex-col flex-1">
        {/* 강아지 / 고양이 선택 */}
        <div className="text-xs text-gray-400 font-medium mb-3 tracking-wide">우리 아이는 어떤 친구?</div>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {PET_TYPES.map((p) => (
            <button key={p.value} onClick={() => handleTypeChange(p.value)}
              className="rounded-2xl py-4 text-center transition-all border-2"
              style={{ background: petType === p.value ? "#ede9ff" : "#f8f7ff", borderColor: petType === p.value ? "#6B5CE7" : "#e8e4ff" }}>
              <div className="text-3xl mb-1">{p.emoji}</div>
              <div className="text-sm font-medium text-gray-600">{p.label}</div>
            </button>
          ))}
        </div>

        {/* 품종 선택 */}
        <div className="text-xs text-gray-400 font-medium mb-2 tracking-wide">
          {petType === "강아지" ? "견종" : "묘종"}
        </div>
        <div className="flex flex-wrap gap-2 mb-5">
          {BREEDS[petType].map((b) => (
            <button key={b} onClick={() => setBreed(b)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border-2"
              style={{
                background: breed === b ? "#6B5CE7" : "#f8f7ff",
                borderColor: breed === b ? "#6B5CE7" : "#e8e4ff",
                color: breed === b ? "#fff" : "#555",
                fontFamily: "inherit",
              }}>
              {b === "기타" ? "🐾 기타" : b}
            </button>
          ))}
        </div>

        {/* 이름 */}
        <label className="text-xs text-gray-400 mb-1 block">이름</label>
        <input value={petName} onChange={e => setPetName(e.target.value)}
          placeholder={`아이 이름 (예: ${petType === "강아지" ? "초코" : "나비"})`}
          className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all border-2"
          style={{ background: "#f4f4f6", borderColor: petName ? "#6B5CE7" : "transparent", fontFamily: "inherit" }} />

        {/* 날짜 모드 토글 */}
        <div className="flex items-center justify-between mt-4 mb-2">
          <label className="text-xs text-gray-400">
            {dateMode === "birth" ? "생년월일" : "처음 만난 날"}
          </label>
          <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: "#e5e5ea" }}>
            <button onClick={() => switchMode("birth")}
              className="px-3 py-1.5 text-xs font-medium transition-all"
              style={{ background: dateMode === "birth" ? "#6B5CE7" : "#f4f4f6", color: dateMode === "birth" ? "#fff" : "#888", fontFamily: "inherit" }}>
              🎂 생년월일
            </button>
            <button onClick={() => switchMode("met")}
              className="px-3 py-1.5 text-xs font-medium transition-all"
              style={{ background: dateMode === "met" ? "#6B5CE7" : "#f4f4f6", color: dateMode === "met" ? "#fff" : "#888", fontFamily: "inherit" }}>
              🐾 만난 날
            </button>
          </div>
        </div>

        {dateMode === "met" && (
          <div className="flex items-start gap-2 rounded-xl px-3 py-2.5 mb-2 text-xs leading-relaxed"
            style={{ background: "#f0eeff", color: "#7c6fd4" }}>
            <span>💜</span>
            <span>입양했거나 생일을 잘 모른다면, 처음 만난 날을 입력해도 괜찮아요! 우리가 함께한 날부터 인연이 시작된 거니까요 🐾</span>
          </div>
        )}

        <input
          type="date"
          value={petBday}
          onChange={e => setPetBday(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          min="2000-01-01"
          className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all border-2"
          style={{ background: "#f4f4f6", borderColor: petBday ? "#6B5CE7" : "transparent", fontFamily: "inherit", colorScheme: "light" }} />

        <button onClick={() => canGo && onNext({ petType, breed, petName, petBday, dateMode })}
          className="w-full py-4 rounded-2xl text-white font-bold text-base mt-5 transition-all active:scale-95"
          style={{ background: canGo ? "#6B5CE7" : "#c4b5fd", cursor: canGo ? "pointer" : "default" }}>
          사주 분석 시작하기 →
        </button>

        <div className="text-center mt-3">
          <a href="/privacy" target="_blank" className="text-xs text-gray-400 underline">개인정보처리방침</a>
        </div>
      </div>
    </div>
  );
}

function Screen2({ petInfo, onDone }) {
  const [msg, setMsg] = useState("사주 분석 중...");
  const msgs = ["기운을 읽는 중...", "별자리를 계산하는 중...", "오행을 파악하는 중...", "성격을 해석하는 중..."];
  const idx = useRef(0);
  const called = useRef(false);

  useEffect(() => {
    const t = setInterval(() => { idx.current = (idx.current + 1) % msgs.length; setMsg(msgs[idx.current]); }, 1200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const dateLabel = petInfo.dateMode === "met" ? "처음 만난 날 (생일 미상)" : "생년월일";
    const metNote = petInfo.dateMode === "met"
      ? "\n- 참고: 입양되었거나 정확한 생일을 모르는 아이예요. 처음 만난 날을 기준으로 '인연의 사주'를 분석해주세요. personality와 carePoint에 '만남의 기운', '인연의 날부터' 같은 따뜻한 표현을 자연스럽게 넣어주세요."
      : "";
    const breedNote = petInfo.breed && petInfo.breed !== "기타"
      ? `\n- 참고: ${petInfo.breed} 품종의 고유한 성격 특성(예: 푸들이면 영리함·애교, 진돗개면 충성심·독립성 등)을 personality와 carePoint에 자연스럽게 녹여주세요. 단, 사주 결과인 것처럼 재미있게 표현해주세요.`
      : "";
    const prompt = `당신은 재미있는 펫 사주 앱의 AI입니다. 아래 정보를 바탕으로 애완동물의 사주 분석 결과를 JSON으로 생성해주세요.

펫 정보:
- 이름: ${petInfo.petName}
- 종류: ${petInfo.petType}${petInfo.breed ? ` (${petInfo.breed})` : ""}
- ${dateLabel}: ${petInfo.petBday}${metNote}${breedNote}

다음 JSON 형식으로만 응답하세요 (다른 텍스트 없이):
{
  "element": "불|물|나무|금|흙 중 하나",
  "typeName": "XX형 (예: 불꽃 에너지형, 물의 안정형 등 창의적인 이름)",
  "typeEmoji": "유형에 맞는 이모지 하나",
  "keywords": ["#키워드1", "#키워드2", "#키워드3"],
  "stats": { "활동성": 숫자(40-99), "애정도": 숫자(40-99), "고집": 숫자(40-99) },
  "personality": "2-3문장. 재미있고 공감가는 성격 설명. ${petInfo.petName}이/가 주어로.",
  "carePoint": "2-3문장. 구체적이고 귀여운 케어 팁.",
  "snacks": ${petInfo.petType === "강아지" ? JSON.stringify(["고구마 스틱","닭가슴살 져키","연어 트릿","치즈 큐브","오리 육포"]) : JSON.stringify(["츄르","참치 트릿","연어 스낵","치킨 져키","캣닢 간식"])} (이 목록에서 사주에 맞는 4개만 정확한 이름 그대로 골라주세요),
  "shareQuote": "15자 이내의 한 줄 요약 (공유 카드용)"
}`;

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
      })
    })
      .then(r => r.json())
      .then(data => {
        const text = data.content?.map(c => c.text || "").join("") || "";
        const clean = text.replace(/```json\n?|```/g, "").trim();
        const jsonMatch = clean.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          onDone(result);
        } else {
          throw new Error("JSON not found");
        }
      })
      .catch((err) => {
        console.error("사주 API 에러:", err);
        // fallback
        onDone({
          element: "불",
          typeName: "불꽃 에너지형",
          typeEmoji: "🌟",
          keywords: ["#열정왕", "#애정부자", "#관종(귀여운)"],
          stats: { 활동성: 95, 애정도: 88, 고집: 72 },
          personality: `${petInfo.petName}은 불의 기운이 강한 아이예요. 에너지가 넘치고 보호자만 보면 온 몸으로 사랑을 표현해요.`,
          carePoint: "하루 30분 이상 산책 필수! 혼자 두면 분리불안이 생길 수 있어요.",
          snacks: ["고구마 스틱", "닭가슴살 져키", "연어 트릿", "치즈 큐브"],
          shareQuote: "에너지 넘치는 불꽃 아이 🔥"
        });
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-full" style={{ background: "#6B5CE7" }}>
      <Stars />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
          style={{ background: "rgba(255,255,255,0.15)", animation: "pulse 1.4s ease-in-out infinite" }}>
          🔮
        </div>
        <div className="text-white text-lg font-bold">{petInfo.petName}의 사주 분석 중</div>
        <div className="text-white/60 text-sm">{msg}</div>
        <div className="flex gap-2 mt-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-white/40"
              style={{ animation: `bounce 1.2s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
        @keyframes bounce { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
      `}</style>
    </div>
  );
}

function Screen3({ petInfo, result, onNext, onReset }) {
  const el = ELEMENT_STYLES[result.element] || ELEMENT_STYLES["불"];

  return (
    <div className="flex flex-col min-h-full" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* Header */}
      <div className={`bg-gradient-to-br ${el.bg} px-5 pt-5 pb-0`}>
        <Stars count={25} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <button onClick={onReset} className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 text-sm" style={{ background: "rgba(255,255,255,0.15)" }}>←</button>
            <span className="text-sm font-bold text-white">사주 결과</span>
          </div>
          <div className="text-xs px-3 py-1 rounded-full inline-block mb-2 border" style={{ background: "rgba(255,255,255,0.1)", color: el.light, borderColor: "rgba(255,255,255,0.2)" }}>
            🔮 분석 완료
          </div>
          <div className="text-lg font-bold text-white mb-0.5">{petInfo.petName}의 {petInfo.dateMode === "met" ? "인연 사주" : "사주"}</div>
          <div className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
            {petInfo.dateMode === "met" ? "🐾 만난 날 " : ""}{petInfo.petBday} · {petInfo.petType}{petInfo.breed ? ` · ${petInfo.breed}` : ""}
          </div>

          <div className="rounded-2xl rounded-b-none text-center py-5" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="text-5xl mb-2">{result.typeEmoji}</div>
            <div className="text-lg font-bold text-white mb-1">{result.typeName}</div>
            <div className="flex gap-1.5 justify-center flex-wrap">
              {result.keywords.map((k, i) => (
                <span key={i} className={`text-xs px-2.5 py-1 rounded-full border ${el.badge}`}>{k}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-4 flex flex-col gap-3 flex-1">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(result.stats).map(([k, v]) => (
            <div key={k} className="rounded-xl py-3 text-center" style={{ background: "#f8f7ff" }}>
              <div className="text-lg font-bold" style={{ color: el.accent }}>{v}</div>
              <div className="text-xs text-gray-400 mt-0.5">{k}</div>
            </div>
          ))}
        </div>

        {/* Personality */}
        <div className="rounded-2xl p-4" style={{ background: "#f8f7ff" }}>
          <div className="text-xs font-bold mb-2" style={{ color: "#6B5CE7" }}>🔮 성격 요약</div>
          <div className="text-sm text-gray-600 leading-relaxed">{result.personality}</div>
        </div>

        {/* Care */}
        <div className="rounded-2xl p-4" style={{ background: "#f8f7ff" }}>
          <div className="text-xs font-bold mb-2" style={{ color: "#6B5CE7" }}>💡 케어 포인트</div>
          <div className="text-sm text-gray-600 leading-relaxed">{result.carePoint}</div>
        </div>

        {/* Snacks */}
        <div className="rounded-2xl p-4" style={{ background: "#f8f7ff" }}>
          <div className="text-xs font-bold mb-2" style={{ color: "#6B5CE7" }}>🍖 사주 맞춤 간식 추천</div>
          <div className="flex flex-wrap gap-2 mb-3">
            {result.snacks.map((s, i) => {
              const link = SNACK_LINKS[petInfo.petType]?.[s];
              return link ? (
                <a key={i} href={link} target="_blank" rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 rounded-full border-2 font-medium flex items-center gap-1 transition-all active:scale-95"
                  style={{ background: "#fff", borderColor: "#6B5CE7", color: "#6B5CE7", textDecoration: "none" }}>
                  {s} <span style={{ fontSize: 10 }}>🛒</span>
                </a>
              ) : (
                <span key={i} className="text-xs px-3 py-1.5 rounded-full border-2 font-medium"
                  style={{ background: "#fff", borderColor: "#e8e4ff", color: "#6B5CE7" }}>{s}</span>
              );
            })}
          </div>
          <div className="text-xs leading-relaxed" style={{ color: "#bbb" }}>
            이 링크는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
          </div>
        </div>

        {/* 무료 프로모션 배너 */}
        <div className="flex items-center gap-2 rounded-2xl px-4 py-3" style={{ background: "linear-gradient(135deg,#fff7ed,#fef3c7)", border: "1.5px solid #fed7aa" }}>
          <span className="text-lg">🎁</span>
          <div className="flex-1">
            <div className="text-xs font-bold text-orange-600">5월 31일까지 궁합 무료!</div>
            <div className="text-xs text-orange-400">6월 1일부터 990원 · 지금 무료로 확인하세요</div>
          </div>
        </div>

        {/* 공유 버튼 */}
        <button className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 border-2 active:scale-95 transition-all"
          style={{ background: "#fff", borderColor: "#e8e4ff", color: "#6B5CE7", fontFamily: "inherit" }}
          onClick={() => {
            const text = `🐾 우리 ${petInfo.petName} 사주 봤어요!\n${result.typeName} ${result.typeEmoji}\n${result.keywords.join(" ")}\n\n우리 아이 사주도 봐봐 👇`;
            if (navigator.share) {
              navigator.share({ title: "마이펫 포춘", text, url: "https://petfortune.vercel.app" });
            } else {
              navigator.clipboard.writeText(text + "\nhttps://petfortune.vercel.app");
              alert("링크가 복사됐어요! 붙여넣기해서 공유하세요 😊");
            }
          }}>
          <span className="text-sm font-bold">📤 사주 결과 공유하기</span>
        </button>

        {/* Compat CTA */}
        <button onClick={onNext} className="w-full flex items-center gap-3 rounded-2xl p-4 border-2 transition-all active:scale-95" style={{ background: "linear-gradient(135deg,#fdf4ff,#f0e8ff)", borderColor: "#e8d5ff" }}>
          <span className="text-3xl">💞</span>
          <div className="flex-1 text-left">
            <div className="text-sm font-bold text-gray-800">보호자와 궁합 보기</div>
            <div className="text-xs text-gray-400">집사님 생년월일을 입력해 주세요</div>
          </div>
          <span className="text-purple-500">→</span>
        </button>
      </div>
    </div>
  );
}

function Screen4({ petInfo, result, onNext, onBack }) {
  const [ownerBday, setOwnerBday] = useState("");
  const [gender, setGender] = useState("무관");
  const canGo = ownerBday.trim().length >= 8;
  const el = ELEMENT_STYLES[result.element] || ELEMENT_STYLES["불"];

  return (
    <div className="flex flex-col min-h-full" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      <div className="text-white px-5 pt-5 pb-7 rounded-b-3xl" style={{ background: "linear-gradient(145deg,#f97316,#fb923c)" }}>
        <button onClick={onBack} className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 text-sm mb-4 border border-white/20" style={{ background: "rgba(255,255,255,0.15)" }}>←</button>
        <div className="text-xs px-3 py-1 rounded-full inline-block mb-2" style={{ background: "rgba(255,255,255,0.2)" }}>💞 궁합 보기</div>
        <div className="text-xl font-bold leading-snug mb-1">집사님 정보를<br />알려주세요!</div>
        <div className="text-sm opacity-75">{petInfo.petName}와의 궁합을 계산할게요 🔮</div>
      </div>

      <div className="px-5 py-5 flex flex-col flex-1">
        {/* Pet preview */}
        <div className="flex items-center gap-3 rounded-2xl p-3 mb-5 border" style={{ background: "#fff7ed", borderColor: "#fed7aa" }}>
          <span className="text-3xl">{PET_TYPES.find(p => p.value === petInfo.petType)?.emoji || "🐾"}</span>
          <div className="flex-1">
            <div className="text-sm font-bold text-gray-800">{petInfo.petName}</div>
            <div className="text-xs text-gray-400">{petInfo.petBday} · {result.typeName}</div>
          </div>
          <span className="text-xs px-2 py-1 rounded-full border font-medium" style={{ background: "#fff", borderColor: "#fed7aa", color: "#f97316" }}>{result.typeEmoji} {result.element}</span>
        </div>

        <label className="text-xs text-gray-400 mb-1 block">집사님 생년월일</label>
        <input
          type="date"
          value={ownerBday}
          onChange={e => setOwnerBday(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          min="1950-01-01"
          className="w-full rounded-xl px-4 py-3 text-sm mb-4 outline-none border-2 transition-all"
          style={{ background: "#f4f4f6", borderColor: ownerBday ? "#f97316" : "transparent", fontFamily: "inherit", colorScheme: "light" }} />

        <label className="text-xs text-gray-400 mb-2 block">성별 (선택)</label>
        <div className="flex gap-2 mb-4">
          {["👨 남성", "👩 여성", "🙂 무관"].map(g => {
            const val = g.split(" ")[1];
            return (
              <button key={val} onClick={() => setGender(val)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all"
                style={{ background: gender === val ? "#fff7ed" : "#f4f4f6", borderColor: gender === val ? "#f97316" : "#e5e5ea", color: gender === val ? "#f97316" : "#555", fontFamily: "inherit" }}>
                {g}
              </button>
            );
          })}
        </div>

        <div className="flex items-start gap-2 rounded-xl p-3 mb-4" style={{ background: "#f8f8f8" }}>
          <span className="text-sm">🔒</span>
          <div className="text-xs text-gray-400 leading-relaxed">입력하신 생년월일은 궁합 계산에만 사용되며, 별도로 저장되지 않아요.</div>
        </div>

        <button onClick={() => canGo && onNext({ ownerBday, gender })}
          className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all active:scale-95"
          style={{ background: canGo ? "#f97316" : "#fed7aa", cursor: canGo ? "pointer" : "default", fontFamily: "inherit" }}>
          궁합 결과 보기 →
        </button>
      </div>
    </div>
  );
}

function Screen5Loading({ petInfo, result, ownerInfo, onDone }) {
  const called = useRef(false);
  const [msg, setMsg] = useState("두 사주를 비교하는 중...");
  const msgs = ["오행을 대조하는 중...", "궁합 점수 계산 중...", "케어 팁 작성 중..."];
  const idx = useRef(0);

  useEffect(() => {
    const t = setInterval(() => { idx.current = (idx.current + 1) % msgs.length; setMsg(msgs[idx.current]); }, 1200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const prompt = `당신은 재미있는 펫 사주 앱의 AI입니다. 애완동물과 보호자의 궁합을 분석해주세요.

애완동물:
- 이름: ${petInfo.petName}
- 종류: ${petInfo.petType}
- 생년월일: ${petInfo.petBday}
- 사주 유형: ${result.typeName} (${result.element}의 기운)

보호자:
- 생년월일: ${ownerInfo.ownerBday}
- 성별: ${ownerInfo.gender}

다음 JSON 형식으로만 응답하세요:
{
  "score": 숫자(70-99). 입력된 생년월일 조합에 따라 매번 다르게 계산해주세요. 절대 87로 고정하지 마세요,
  "grade": "천생연분|찰떡궁합|좋은인연|무난한사이 중 하나 (90이상: 천생연분, 80-89: 찰떡궁합, 70-79: 좋은인연, 70미만: 무난한사이)",
  "gradeEmoji": "등급에 맞는 이모지",
  "ownerElement": "불|물|나무|금|흙 중 하나",
  "ownerTypeName": "집사님의 기운 유형명 (예: 물의 안정형)",
  "chemistryDesc": "두 기운의 조합 설명 (예: 불 기운 + 물 기운 = 완벽한 밸런스)",
  "pairCharacter": "2-3문장. 이 조합의 특징을 재미있게.",
  "monthlyTip": "이달의 케어 팁 1-2문장. 구체적이고 귀여운.",
  "compatTip": "궁합을 더 좋게 하는 방법 1-2문장. 예: '산책을 함께 하면 둘의 기운이 맞춰져요' 같은 구체적인 행동 팁.",
  "topPercent": 숫자(1-30),
  "compatKeywords": ["#키워드1", "#키워드2"]
}`;

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 800,
        messages: [{ role: "user", content: prompt }]
      })
    })
      .then(r => r.json())
      .then(data => {
        const text = data.content?.map(c => c.text || "").join("") || "";
        const clean = text.replace(/```json\n?|```/g, "").trim();
        const jsonMatch = clean.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          onDone(JSON.parse(jsonMatch[0]));
        } else {
          throw new Error("JSON not found");
        }
      })
      .catch((err) => {
        console.error("궁합 API 에러:", err);
        onDone({
          score: 87,
          grade: "천생연분",
          gradeEmoji: "🎉",
          ownerElement: "물",
          ownerTypeName: "물의 안정형",
          chemistryDesc: "불 기운 + 물 기운 = 완벽한 밸런스",
          pairCharacter: `${petInfo.petName}의 넘치는 에너지를 집사님이 차분하게 받아줘서 찰떡 호흡이에요. 서로의 빈자리를 채워주는 완벽한 한 쌍이에요.`,
          monthlyTip: "이달은 산책을 5분만 더 늘려보세요! 둘 다 기분이 확 업돼요 🌈",
          topPercent: 5,
          compatKeywords: ["#찰떡호흡", "#완벽밸런스"]
        });
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-full" style={{ background: "linear-gradient(145deg,#f97316,#ea580c)" }}>
      <Stars />
      <div className="relative z-10 flex flex-col items-center gap-4 text-center px-6">
        <div className="text-6xl mb-2" style={{ animation: "pulse 1.4s ease-in-out infinite" }}>💞</div>
        <div className="text-white text-lg font-bold">궁합 계산 중...</div>
        <div className="text-white/60 text-sm">{msg}</div>
        <div className="flex gap-2 mt-2">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-white/40" style={{ animation: `bounce 1.2s ease-in-out infinite`, animationDelay: `${i*0.2}s` }} />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
        @keyframes bounce { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
      `}</style>
    </div>
  );
}

function Screen6({ petInfo, result, ownerInfo, compatResult, onReset, onBack }) {
  const petEl = ELEMENT_STYLES[result.element] || ELEMENT_STYLES["불"];
  const ownerEl = ELEMENT_STYLES[compatResult.ownerElement] || ELEMENT_STYLES["물"];
  const petEmoji = PET_TYPES.find(p => p.value === petInfo.petType)?.emoji || "🐾";

  const scoreColor = compatResult.score >= 85 ? "#f97316" : compatResult.score >= 70 ? "#a78bfa" : "#60a5fa";

  return (
    <div className="flex flex-col min-h-full" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-5" style={{ background: "linear-gradient(145deg,#1a0a00,#2d1400,#0d0614)" }}>
        <Stars count={30} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <button onClick={onBack} className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 text-sm border border-white/20" style={{ background: "rgba(255,255,255,0.1)" }}>←</button>
            <span className="text-sm font-bold text-white">궁합 결과</span>
          </div>

          {/* Pair */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 rounded-2xl p-3 text-center border border-white/10" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div className="text-2xl mb-1">{petEmoji}</div>
              <div className="text-sm font-bold text-white">{petInfo.petName}</div>
              <div className="text-xs mt-0.5" style={{ color: petEl.accent }}>{result.element} 기운</div>
            </div>
            <div className="text-2xl" style={{ color: scoreColor }}>♥</div>
            <div className="flex-1 rounded-2xl p-3 text-center border border-white/10" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div className="text-2xl mb-1">{ownerInfo.gender === "남성" ? "👨" : ownerInfo.gender === "여성" ? "👩" : "🧑"}</div>
              <div className="text-sm font-bold text-white">집사님</div>
              <div className="text-xs mt-0.5" style={{ color: ownerEl.accent }}>{compatResult.ownerElement} 기운</div>
            </div>
          </div>

          {/* Score */}
          <div className="text-center">
            <div className="w-24 h-24 rounded-full mx-auto mb-3 flex flex-col items-center justify-center border-2"
              style={{ background: `rgba(${scoreColor === "#f97316" ? "249,115,22" : scoreColor === "#a78bfa" ? "167,139,250" : "96,165,250"},0.15)`, borderColor: scoreColor }}>
              <div className="text-3xl font-black" style={{ color: scoreColor }}>{compatResult.score}</div>
              <div className="text-xs text-white/50">점</div>
            </div>
            <div className="text-lg font-bold text-white mb-1">{compatResult.gradeEmoji} {compatResult.grade}에 가까워요!</div>
            <div className="text-xs text-white/50 mb-1">{compatResult.chemistryDesc}</div>
            <div className="text-xs font-medium" style={{ color: scoreColor }}>상위 {compatResult.topPercent}% 궁합</div>
            <div className="flex gap-2 justify-center mt-2">
              {compatResult.compatKeywords?.map((k, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>{k}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-4 flex flex-col gap-3 flex-1">
        <div className="rounded-2xl p-4 border-l-4" style={{ background: "#fff7ed", borderColor: "#f97316" }}>
          <div className="text-xs font-bold text-orange-600 mb-2">🌟 이 페어의 특징</div>
          <div className="text-sm text-gray-600 leading-relaxed">{compatResult.pairCharacter}</div>
        </div>

        <div className="rounded-2xl p-4 border-l-4" style={{ background: "#fff7ed", borderColor: "#f97316" }}>
          <div className="text-xs font-bold text-orange-600 mb-2">💌 이달의 케어 팁</div>
          <div className="text-sm text-gray-600 leading-relaxed">{compatResult.monthlyTip}</div>
        </div>

        {compatResult.compatTip && (
          <div className="rounded-2xl p-4 border-l-4" style={{ background: "#f0eeff", borderColor: "#6B5CE7" }}>
            <div className="text-xs font-bold mb-2" style={{ color: "#6B5CE7" }}>✨ 궁합을 더 좋게 하려면</div>
            <div className="text-sm text-gray-600 leading-relaxed">{compatResult.compatTip}</div>
          </div>
        )}

        <button className="w-full py-4 rounded-2xl text-white font-bold text-sm active:scale-95 transition-all" style={{ background: "#f97316", fontFamily: "inherit" }}
          onClick={() => {
            const text = `🐾 ${petInfo.petName}와 집사님의 궁합!\n💞 ${compatResult.grade} ${compatResult.score}점\n${compatResult.chemistryDesc}\n\n우리 아이 사주도 봐봐 👇`;
            if (navigator.share) {
              navigator.share({ title: "마이펫 포춘 궁합 결과", text, url: "https://petfortune.vercel.app" });
            } else {
              navigator.clipboard.writeText(text + "\nhttps://petfortune.vercel.app");
              alert("링크가 복사됐어요! 붙여넣기해서 공유하세요 😊");
            }
          }}>
          📤 결과 공유하기
        </button>

        <button onClick={onReset} className="w-full py-3.5 rounded-2xl font-bold text-sm border-2 active:scale-95 transition-all" style={{ background: "#fff", color: "#f97316", borderColor: "#fed7aa", fontFamily: "inherit" }}>
          다른 아이 분석하기
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState(1);
  const [petInfo, setPetInfo] = useState(null);
  const [sajuResult, setSajuResult] = useState(null);
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [compatResult, setCompatResult] = useState(null);

  const reset = () => { setScreen(1); setPetInfo(null); setSajuResult(null); setOwnerInfo(null); setCompatResult(null); };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "2rem 1rem", minHeight: "100vh", background: "#f0eefc" }}>
      <div style={{ width: "100%", maxWidth: 400, minHeight: "100dvh", background: "#fff", borderRadius: 32, border: "1.5px solid #e5e5ea", overflow: "hidden", boxShadow: "0 12px 48px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {screen === 1 && <Screen1 onNext={info => { setPetInfo(info); setScreen(2); }} />}
          {screen === 2 && petInfo && <Screen2 petInfo={petInfo} onDone={r => { setSajuResult(r); setScreen(3); }} />}
          {screen === 3 && sajuResult && <Screen3 petInfo={petInfo} result={sajuResult} onNext={() => setScreen(4)} onReset={reset} />}
          {screen === 4 && sajuResult && <Screen4 petInfo={petInfo} result={sajuResult} onNext={info => { setOwnerInfo(info); setScreen(5); }} onBack={() => setScreen(3)} />}
          {screen === 5 && ownerInfo && sajuResult && <Screen5Loading petInfo={petInfo} result={sajuResult} ownerInfo={ownerInfo} onDone={r => { setCompatResult(r); setScreen(6); }} />}
          {screen === 6 && compatResult && <Screen6 petInfo={petInfo} result={sajuResult} ownerInfo={ownerInfo} compatResult={compatResult} onReset={reset} onBack={() => setScreen(4)} />}
        </div>
      </div>
    </div>
  );
}
