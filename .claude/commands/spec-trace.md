---
description: 요구사항 ↔ 코드 ↔ 테스트 추적성 확인
argument-hint: [선택: REQ-FUNC-010 · REQ-NF-002 · REQ-IMPL-025 · 없으면 전체 커버리지]
allowed-tools: Read, Grep, Glob, Bash
---

# 추적성 — **$ARGUMENTS**

**요구사항 59건 + `REQ-IMPL` 34건이 코드와 테스트에 닿아 있는지** 확인한다.

## 1. 요구사항 ID 하나를 추적할 때

```bash
REQ="$ARGUMENTS"
echo "── SRS 원문"
grep -n "$REQ" "[SRS]ai-place -mate-SRSv1.0.md" SRS-ai-place-nextjs-v1.0.md | head -5

echo "── 설계 대응"
grep -n "$REQ" "[DIAGRAMS]DESIGN-ai-place-v1.0.md" DESIGN-ai-place-nextjs-v1.0.md | head -5

echo "── 태스크"
grep -ln "$REQ" docs/issues-aiplace/tasks/*.md | xargs -n1 basename | sed 's/.md//'

echo "── 코드 주석"
grep -rn "$REQ" --include=*.ts --include=*.tsx --include=*.sql --include=*.prisma . 2>/dev/null | head -10
```

**네 층이 다 있어야 한다** — SRS · 설계 · 태스크 · 코드.
빠진 층을 보고한다. 특히 **태스크는 있는데 코드에 없으면 미구현**이고, **코드는 있는데 태스크가 없으면 근거 없는 구현**이다.

## 2. 전체 커버리지 (인자 없음)

```bash
# 기준 SRS 요구사항 59건 중 태스크에 연결 안 된 것
for i in $(seq -w 1 27); do
  R="REQ-FUNC-0$i"
  grep -qrl "$R" docs/issues-aiplace/tasks/ || echo "  미연결: $R"
done
for i in $(seq -w 1 32); do
  R="REQ-NF-0$i"
  grep -qrl "$R" docs/issues-aiplace/tasks/ || echo "  미연결: $R"
done
```

**기대값 — 59건 중 58건 연결.** 미연결 1건은 `REQ-NF-023`(외부 제휴 미도입)이며 의도된 제외다.
그 외가 나오면 **커버리지가 깨진 것**이다.

## 3. `REQ-IMPL` 34건 커버리지

```bash
for i in $(seq -w 1 34); do
  R="REQ-IMPL-0$i"
  grep -qr "$R" .claude/ || echo "  하네스 미반영: $R"
done
```

**하네스가 다루지 않는 `REQ-IMPL`은 규칙 없이 구현된다.** 발견하면 해당 에이전트·스킬에 추가한다.

## 4. 코드에 요구사항 ID가 있는가

```bash
# 매직 넘버에 근거가 붙어 있는지
grep -rnE "\b(90|180|3000|2500|1000|400|120|30|12)\b" --include=*.ts --include=*.tsx . 2>/dev/null \
  | grep -v "REQ-" | head -20
```

**숫자만 있고 요구사항 ID가 없으면 주석을 붙인다** — `// REQ-NF-011: 90일 초과 시 경고`.

## 5. 보고

| 층 | 상태 |
| --- | --- |
| SRS → 태스크 | 59건 중 N건 연결 |
| 태스크 → 코드 | 미구현 N건 |
| 코드 → 태스크 | 근거 없는 구현 N건 |
| `REQ-IMPL` → 하네스 | 미반영 N건 |

**끊긴 곳을 파일:줄과 함께 적는다.**
