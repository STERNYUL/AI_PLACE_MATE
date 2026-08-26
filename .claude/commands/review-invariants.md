---
description: 4대 불변 규칙 감사 — 변경분이 제품 원칙을 깨지 않는지 검사
argument-hint: [선택: 파일 경로 · PR 번호 · 없으면 현재 diff]
allowed-tools: Read, Grep, Glob, Bash
---

# 불변 규칙 감사 — **$ARGUMENTS**

대상이 없으면 `git diff main...HEAD`를 본다.

> **이 감사는 통과·실패를 낸다.** 애매하면 실패로 보고한다. 규칙을 지키는 코드는 왜 지키는지 한 줄로 답할 수 있다.

---

## 규칙 1 — 근거 4항목 없는 후보는 반환하지 않는다

```bash
# 게이트가 정렬보다 앞인가
grep -rn "EvidenceGate\|evidenceGate\|hasFourFields" --include=*.ts --include=*.tsx
grep -rn "RelevanceRanker\|top3\|rank(" --include=*.ts --include=*.tsx
```

- [ ] 게이트 호출이 정렬 호출보다 **앞**인가
- [ ] `CandidateCardProps`의 `reason`·`evidenceAttributes`·`verifiedAt`·`verifiedBy`가 **non-nullable**인가
- [ ] `CandidateCardProps`를 **게이트 외의 곳에서 조립**하지 않는가
- [ ] `STALE`을 **제외 조건으로 쓰지 않는가** (경고여야 한다)

## 규칙 2 — 빈 화면을 반환하지 않는다

```bash
# 빈 배열·null 반환이 화면까지 가는 경로
grep -rn "return \[\]\|return null\|throw new Error" --include=*.ts --include=*.tsx lib/ app/ 2>/dev/null
```

- [ ] 파싱 실패가 **예외가 아니라 분기**로 처리되는가
- [ ] 후보 0건·제안 0건 경로에 **대체 화면**이 있는가
- [ ] 열화 상태 6종 중 이 변경이 건드린 것이 있으면 그 상태가 유지되는가

## 규칙 3 — 주관적 판정을 하지 않는다

```bash
# 평가형 어휘가 생성 문구·프롬프트·컴포넌트에 있는지
grep -rniE "조용|아늑|분위기 (좋|나쁨)|추천드립|최고|훌륭" --include=*.ts --include=*.tsx --include=*.md
```

- [ ] 컴포넌트가 **사실 값만** 표시하는가
- [ ] 프롬프트가 **평가를 요구하지 않는가**
- [ ] 매장 등록 문구에 `guardWording`(등록 속성 참조 검증)이 걸려 있는가

## 규칙 4 — 노출 순서를 판매하지 않는다

```bash
grep -rniE "sort|orderBy|rank" --include=*.ts | grep -iE "price|amount|fee|ad|sponsor|paid"
```

- [ ] 정렬 키에 **가격·광고·제휴**가 섞이지 않았는가
- [ ] 적합도가 **1순위 정렬 키**인가
- [ ] 가중치 조정이 있다면 **품질 신호**(불이행 기록)인가, 판매인가

---

## 서버리스 전제 위반 (같이 본다)

- [ ] DB에 닿는 경로가 **Node 런타임**인가
- [ ] 대화형 트랜잭션·advisory lock·prepared statement를 쓰지 않는가
- [ ] 새 테이블 마이그레이션에 **RLS 정책이 같은 파일**에 있는가
- [ ] Cron 작업이 **부분 완료 가능**한가
- [ ] `status` 컬럼을 화면 판정 근거로 쓰지 않는가

## 보고

위반은 **파일:줄** 과 함께, 왜 위반인지 한 줄로. 통과 항목은 개수만 요약한다.
**위반이 없으면 "없음"이라고 명확히 적는다** — 조용히 넘어가지 않는다.
